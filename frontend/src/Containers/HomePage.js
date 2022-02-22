import React, { useState } from "react";
import { StyleSheet, Image, View, Button } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { images } from "../../constant/";
import { GET_TEXT, GET_IMAGE, SEND_IMAGE, GET_IMAGE2 } from "../api";

// ImagePicker: https://docs.expo.io/versions/latest/sdk/imagepicker/
const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  // console.log(result);

  if (!result.cancelled) {
    return { uri: result.uri };
  }
  return false;
};

const cameraImage = async () => {
  let result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  // console.log(result);

  if (!result.cancelled) {
    return { uri: result.uri };
  }
  return false;
};

export default function HomePage({ navigation }) {
  const [ImageURL, setImageURL] = useState(images.cat);
  return (
    <View style={styles.HomePage}>
      {/* <Button title="receive remote text" onPress={() => GET_TEXT()}></Button> */}
      {/* <Button
        title="receive remote file"
        onPress={async () => {
          var photo = await GET_IMAGE("104029750");
          // console.log(photo.metadata);
          setImageURL({ uri: photo.uri });
        }}
      ></Button> */}
      {/* <Button
            title="read local file"
            onPress={() => setImageURL(require("./dog.jpg"))}
          ></Button> */}
      <Button
        title="read device file"
        onPress={async () => {
          var photo = await pickImage();
          if (photo) setImageURL(photo);
          // await SEND_IMAGE(ImageURL); //這時候上行的setImageURL(photo)可能尚未執行完成，導致ImageURL.uri為null
          // await SEND_IMAGE(photo);
          var photos = await GET_IMAGE2();
          navigation.push("SearchResults", { photos: photos });
        }}
      ></Button>
      <Button
        title="create device file"
        onPress={async () => {
          var photo = await cameraImage();
          if (photo) setImageURL(photo);
          // await SEND_IMAGE(ImageURL); //這時候上行的setImageURL(photo)可能尚未執行完成，導致ImageURL.uri為null
          // await SEND_IMAGE(photo);
          var photos = await GET_IMAGE2();
          navigation.push("SearchResults", { photos: photos });
        }}
      ></Button>
      {/* <Button
        title="send device file"
        onPress={async () => {
          await SEND_IMAGE(ImageURL);
        }}
      ></Button> */}
      {/* <Button
        title="GET_IMAGE2"
        onPress={async () => {
          var photos = await GET_IMAGE2();
          navigation.push("SearchResults", { photos: photos });
        }}
      ></Button> */}
      {/* iPhone11/XR screen resolution: width = 414, height = 896 */}
      <Image source={ImageURL} style={{ width: "50%", height: "25%" }} />
    </View>
  );
}

const styles = StyleSheet.create({
  HomePage: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
