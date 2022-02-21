#!/usr/bin/env python
# coding: utf-8

# In[1]:


# Import necessary packages.
import numpy as np
import torch
import torch.nn as nn
import torchvision
import torchvision.transforms as transforms
from PIL import Image
# "ConcatDataset" and "Subset" are possibly useful when doing semi-supervised learning.
from torch.utils.data import ConcatDataset, DataLoader, Subset
from torchvision.datasets import DatasetFolder

# This is for the progress bar.
# from tqdm.auto import tqdm
#from tqdm.notebook import tqdm
from tqdm import tqdm

# for save
from pathlib import Path
import shutil

from argparse import Namespace


# In[2]:


config = Namespace(
    datadir = "./img_representaion",
    savedir = "./checkpt",
    # cpu threads when fetching & processing data.
    num_workers = 6,  
    
    # batch size in terms of tokens. gradient accumulation increases the effective batchsize.
    batch_size = 20,
        
    # maximum epochs for training
    max_epoch = 30,
    start_epoch = 1,
    
    # checkpoints
    resume = None, # if resume from checkpoint name (under config.savedir)
    #resume = "checkpoint_last.pt", 
)


# In[3]:


def try_load_checkpoint(model, optimizer=None, name=None):
    if name != None:
        #name = name if name else "checkpoint_last.pt"
        checkpath = Path(config.savedir)/name
        if checkpath.exists():
            check = torch.load(checkpath)
            model.load_state_dict(check["model"])
    #         stats = check["stats"]
    #         step = "unknown"
    #         if optimizer != None:
    #             optimizer._step = step = check["optim"]["step"]
            print(f"loaded checkpoint {checkpath}")
            print('train loss: ', check['train_score']['loss'], ', train acc:', check['train_score']['acc'].item())
            print('valid loss: ', check['valid_score']['loss'], ', valid acc:', check['valid_score']['acc'].item())
            best_valid_acc = check['valid_score']['acc'].item()
        else:
            print(f"no checkpoints found at {checkpath}!")


# In[4]:


# It is important to do data augmentation in training.
# However, not every augmentation is useful.
# Please think about what kind of augmentation is helpful for food recognition.
tfm = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# We don't need augmentations in testing and validation.
# All we need here is to resize the PIL image and transform it into Tensor.
# test_tfm = transforms.Compose([
#     transforms.Resize(256),
#     transforms.CenterCrop(224),
#     transforms.ToTensor(),
#     transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
# ])


# In[5]:


# Batch size for training, validation, and testing.
# A greater batch size usually gives a more stable gradient.
# But the GPU memory is limited, so please adjust it carefully.
batch_size = config.batch_size

# Construct datasets.
# The argument "loader" tells how torchvision reads the data.
train_set = torchvision.datasets.ImageFolder(config.datadir, transform = tfm)#DatasetFolder("food-11/training/labeled", loader=lambda x: Image.open(x), extensions="jpg", transform=train_tfm)

n = len(train_set)  # total number of examples
n_test = int(0.1 * n)  # take ~10% for test
n_valid = int(0.1 * n)  # take ~10% for test

test_set = torch.utils.data.Subset(train_set, range(0, n_test))  # take first 10%
valid_set = torch.utils.data.Subset(train_set, range(n_test, n_test + n_valid))  # take first 10%
train_set = torch.utils.data.Subset(train_set, range(n_test + n_valid, n))  # take the rest 

# Construct data loaders.
train_loader = DataLoader(train_set, batch_size=batch_size, shuffle=True, num_workers=config.num_workers, pin_memory=True)
valid_loader = DataLoader(valid_set, batch_size=batch_size, shuffle=True, num_workers=config.num_workers, pin_memory=True)
test_loader = DataLoader(test_set, batch_size=batch_size, shuffle=False)


# In[6]:


# "cuda" only when GPUs are available.
device = "cuda" if torch.cuda.is_available() else "cpu"

# Initialize a model, and put it on the device specified.
model = torchvision.models.resnet50(pretrained=False).to(device)#Classifier().to(device)
model.device = device


# In[7]:


best_valid_acc = 0


# In[8]:


try_load_checkpoint(model, None, name=config.resume)


# In[9]:



# For the classification task, we use cross-entropy as the measurement of performance.
criterion = nn.CrossEntropyLoss()

# Initialize optimizer, you may fine-tune some hyperparameters such as learning rate on your own.
optimizer = torch.optim.Adam(model.parameters(), lr=0.0003, weight_decay=1e-5)

# The number of training epochs.
n_epochs = config.max_epoch


for epoch in range(config.start_epoch - 1, n_epochs):
    # ---------- Training ----------
    # Make sure the model is in train mode before training.
    model.train()

    # These are used to record information in training.
    train_loss = []
    train_accs = []

    # Iterate the training set by batches.
    for batch in tqdm(train_loader):

        # A batch consists of image data and corresponding labels.
        imgs, labels = batch

        # Forward the data. (Make sure data and model are on the same device.)
        logits = model(imgs.to(device))

        # Calculate the cross-entropy loss.
        # We don't need to apply softmax before computing cross-entropy as it is done automatically.
        loss = criterion(logits, labels.to(device))

        # Gradients stored in the parameters in the previous step should be cleared out first.
        optimizer.zero_grad()

        # Compute the gradients for parameters.
        loss.backward()

        # Clip the gradient norms for stable training.
        grad_norm = nn.utils.clip_grad_norm_(model.parameters(), max_norm=10)

        # Update the parameters with computed gradients.
        optimizer.step()

        # Compute the accuracy for current batch.
        acc = (logits.argmax(dim=-1) == labels.to(device)).float().mean()

        # Record the loss and accuracy.
        train_loss.append(loss.item())
        train_accs.append(acc)

    # The average loss and accuracy of the training set is the average of the recorded values.
    train_loss = sum(train_loss) / len(train_loss)
    train_acc = sum(train_accs) / len(train_accs)

    # Print the information.
    print(f"[ Train | {epoch + 1:03d}/{n_epochs:03d} ] loss = {train_loss:.5f}, acc = {train_acc:.5f}")

    # ---------- Validation ----------
    # Make sure the model is in eval mode so that some modules like dropout are disabled and work normally.
    model.eval()

    # These are used to record information in validation.
    valid_loss = []
    valid_accs = []

    # Iterate the validation set by batches.
    for batch in tqdm(valid_loader):

        # A batch consists of image data and corresponding labels.
        imgs, labels = batch

        # We don't need gradient in validation.
        # Using torch.no_grad() accelerates the forward process.
        with torch.no_grad():
          logits = model(imgs.to(device))

        # We can still compute the loss (but not the gradient).
        loss = criterion(logits, labels.to(device))

        # Compute the accuracy for current batch.
        acc = (logits.argmax(dim=-1) == labels.to(device)).float().mean()

        # Record the loss and accuracy.
        valid_loss.append(loss.item())
        valid_accs.append(acc)

    # The average loss and accuracy for entire validation set is the average of the recorded values.
    valid_loss = sum(valid_loss) / len(valid_loss)
    valid_acc = sum(valid_accs) / len(valid_accs)
        
    # Print the information.
    print(f"[ Valid | {epoch + 1:03d}/{n_epochs:03d} ] loss = {valid_loss:.5f}, acc = {valid_acc:.5f}")
    
    check = {
        "model": model.state_dict(),
        "valid_score": {"loss": valid_loss, "acc": valid_acc},
        "train_score": {"loss": train_loss, "acc": train_acc},
    }
    
        
    # save epoch checkpoints
    savedir = Path(config.savedir).absolute()
    savedir.mkdir(parents=True, exist_ok=True)
    
    torch.save(check, savedir/f"checkpoint{epoch}.pt")
    shutil.copy(savedir/f"checkpoint{epoch}.pt", savedir/f"checkpoint_last.pt")
    print(f"saved epoch {epoch} checkpoint: {savedir}/checkpoint{epoch}.pt")
    
    # save best checkpoints
    if (valid_acc > best_valid_acc):
        best_valid_acc = valid_acc
        torch.save(check, savedir/f"checkpoint_best.pt")
        print(f"saved best valid acc, epoch {epoch} checkpoint: {savedir}/checkpoint_best.pt, with valid acc = {best_valid_acc}")
    


# In[ ]:





# In[ ]:




# Make sure the model is in eval mode.
# Some modules like Dropout or BatchNorm affect if the model is in training mode.
model.eval()

# Initialize a list to store the predictions.
predictions = []

# Iterate the testing set by batches.
for batch in tqdm(test_loader):
    # A batch consists of image data and corresponding labels.
    # But here the variable "labels" is useless since we do not have the ground-truth.
    # If printing out the labels, you will find that it is always 0.
    # This is because the wrapper (DatasetFolder) returns images and labels for each batch,
    # so we have to create fake labels to make it work normally.
    imgs, labels = batch

    # We don't need gradient in testing, and we don't even have labels to compute loss.
    # Using torch.no_grad() accelerates the forward process.
    with torch.no_grad():
        logits = model(imgs.to(device))

    # Take the class with greatest logit as prediction and record it.
    predictions.extend(logits.argmax(dim=-1).cpu().numpy().tolist())# Save predictions into the file.
with open("predict.csv", "w") as f:

    # The first row must be "Id, Category"
    f.write("Id,Category\n")

    # For the rest of the rows, each image id corresponds to a predicted class.
    for i, pred in  enumerate(predictions):
         f.write(f"{i},{pred}\n")