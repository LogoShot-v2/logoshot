import slimon

model = slimon.Model()

# print(model .latent_vector_path)
model.single_img_retrieve('/home/slimon/ntu.jpg')

while True:
    path = input()

    try:
        model.single_img_retrieve(path)
    except:
        print("error")
        
