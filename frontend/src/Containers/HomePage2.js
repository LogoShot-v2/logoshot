import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { images, icons, COLORS, FONTS, SIZES } from "../../constant/";
import { useFonts } from "expo-font";
import { SEND_IMAGE, GET_IMAGE2 } from "../api";

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

export default function HomePage2({ navigation }) {
  const [ImageURL, setImageURL] = useState(images.cat);
  const [loaded] = useFonts({
    "Roboto-Regular": require("../../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Black": require("../../assets/fonts/Roboto-Black.ttf"),
    "Roboto-Bold": require("../../assets/fonts/Roboto-Bold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={{ height: "25%", backgroundColor: COLORS.orange }}>
        <Image source={ImageURL} style={{ resizeMode: "contain", width: "100%", height: "100%" }} />
      </View>
      <View style={{ height: "60%", backgroundColor: COLORS.lightGray }}>
        <View style={{ marginTop: SIZES.font, marginHorizontal: SIZES.padding }}>
          {/* TITLE */}
          <View style={{ flexDirection: "row", height: "8%", alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS.white }}>
            <Text style={{ color: COLORS.secondary, ...FONTS.h2 }}>Main Function</Text>
            <TouchableOpacity
              onPress={() => {
                console.log("See All on pressed");
              }}
            >
              <Text style={{ color: COLORS.secondary, ...FONTS.body3 }}>See All</Text>
            </TouchableOpacity>
          </View>
          {/* CARDS */}
          <View style={{ flexDirection: "row", height: "88%", marginTop: SIZES.base, backgroundColor: COLORS.white }}>
            <View style={{ flex: 1, padding: 12 }}>
              {/* CARD 1 */}
              <TouchableOpacity
                style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.yellow, borderRadius: 20, marginBottom: 18 }}
                onPress={async () => {
                  var photo = await cameraImage();
                  if (photo) setImageURL(photo);
                  // await SEND_IMAGE(ImageURL); //這時候上一行的setImageURL(photo)可能尚未執行完成，導致ImageURL.uri為null
                  await SEND_IMAGE(photo);
                  var photos = await GET_IMAGE2();
                  navigation.push("SearchResults", { photos: photos });
                }}
              >
                <Text>TAKE PHOTOS</Text>
                <Image
                  source={icons.camera}
                  resizeMode="contain"
                  style={{
                    width: "60%",
                    height: "60%",
                  }}
                />
              </TouchableOpacity>
              {/* CARD 2 */}
              <TouchableOpacity
                style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.blue, borderRadius: 20 }}
                onPress={() => {
                  console.log("Button2 on pressed");
                }}
              >
                <Text>TEXT SEARCH</Text>
                <Image
                  source={icons.text}
                  resizeMode="contain"
                  style={{
                    width: "60%",
                    height: "60%",
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, padding: 12 }}>
              {/* CARD 3 */}
              <TouchableOpacity
                style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.purple, borderRadius: 20, marginBottom: 18 }}
                onPress={async () => {
                  var photo = await pickImage();
                  if (photo) setImageURL(photo);
                  // await SEND_IMAGE(ImageURL); //這時候上一行的setImageURL(photo)可能尚未執行完成，導致ImageURL.uri為null
                  await SEND_IMAGE(photo);
                  var photos = await GET_IMAGE2();
                  navigation.push("SearchResults", { photos: photos });
                }}
              >
                <Text>GALLERY</Text>
                <Image
                  source={icons.gallery}
                  resizeMode="contain"
                  style={{
                    width: "60%",
                    height: "60%",
                  }}
                />
              </TouchableOpacity>
              {/* CARD 4 */}
              <TouchableOpacity
                style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.green, borderRadius: 20 }}
                onPress={() => {
                  console.log("Button4 on pressed");
                }}
              >
                <Text>MAGIC!!!</Text>
                <Image
                  source={icons.idea}
                  resizeMode="contain"
                  style={{
                    width: "60%",
                    height: "60%",
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={{ height: "15%", backgroundColor: COLORS.gray }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
