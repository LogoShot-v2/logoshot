import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { images, icons, COLORS, FONTS, SIZES } from "../../constant/";
import { ThemeProvider, CheckBox, Button, BottomSheet, ListItem, SearchBar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { SEND_IMAGE, GET_IMAGE2, Searching } from "../api";
import { SimpleLineIcons } from "@expo/vector-icons";

const theme = {
  CheckBox: {
    checkedColor: "black",
    uncheckedColor: "black",
    containerStyle: { width: "45%", backgroundColor: "white" },
    size: 25,
    textStyle: {},
    titleProps: {},
  },
};

const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [3, 3],
    quality: 0.5,
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
    aspect: [3, 3],
    quality: 0.5,
  });

  // console.log(result);

  if (!result.cancelled) {
    return { uri: result.uri };
  }
  return false;
};

export default function TrademarkSearch({ navigation }) {
  const [searchQuery, setSearchQuery] = React.useState("");

  const [checked1, setChecked1] = React.useState(true);
  const [checked2, setChecked2] = React.useState(true);
  const [checked3, setChecked3] = React.useState(true);
  const [checked4, setChecked4] = React.useState(true);

  const [ImageURL, setImageURL] = useState(images.uploading2);

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const list = [
    {
      title: "Take a photo",
      onPress: async () => {
        var photo = await cameraImage();
        if (photo) setImageURL(photo);
        setIsVisible(false);
      },
    },
    {
      title: "Select a photo",
      onPress: async () => {
        var photo = await pickImage();
        if (photo) setImageURL(photo);
        setIsVisible(false);
      },
    },
    {
      title: "Cancel",
      containerStyle: { backgroundColor: "red" },
      titleStyle: { color: "white" },
      onPress: () => setIsVisible(false),
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <View style={styles.container}>
        <View style={{ backgroundColor: COLORS.white, marginHorizontal: SIZES.padding / 2 }}>
          {/* Text & Button */}
          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...FONTS.h2, marginBottom: SIZES.padding / 6 }}>Search by Image</Text>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "圖片搜尋",
                  "點擊「Upload Image」按鈕可以用相機拍攝/從圖庫選擇含有商標的照片，並可對其做裁切、旋轉等編輯，完成後按下最下方的「送出」按鈕，等待一段時間後，即會回傳在臺灣商標資料庫中與該照片最相似的50張商標。\n\nTips：照片品質會影響搜尋結果，可以盡量正面拍攝照片，並裁切掉與 Logo 無關的背景，讓 Logo 圖案佔滿整張照片，搜尋結果會更為精確！"
                );
              }}
            >
              <SimpleLineIcons style={{ padding: SIZES.padding / 6 }} name="question" size={24} />
            </TouchableOpacity>
          </View>

          <Text style={{ ...FONTS.h4 }}>jpg, jpeg, png, tiff & bmp</Text>
          <Button
            buttonStyle={{ width: "45%" }}
            containerStyle={{ margin: 5 }}
            loadingProps={{ animating: true }}
            loadingStyle={{}}
            disabled={isLoading}
            onPress={() => setIsVisible(true)}
            title="Upload Image"
            titleProps={{}}
            titleStyle={{ marginHorizontal: 5 }}
          />
        </View>
        <View style={{ height: "30%", backgroundColor: COLORS.white, marginHorizontal: SIZES.padding / 2 }}>
          {/* Image */}
          <Image source={ImageURL} style={{ resizeMode: "contain", width: "100%", height: "100%" }} />
        </View>
        <View style={{ height: "35%", backgroundColor: COLORS.white, marginHorizontal: SIZES.padding / 2 }}>
          {/* Text & Searchbar */}
          <View style={{ flexDirection: "row" }}>
            <Text style={{ ...FONTS.h2, marginBottom: SIZES.padding / 6 }}>Trademark Text(s)</Text>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "文字搜尋",
                  "將與商標相關的文字輸入至下方文字框，完成後按下最下方的「送出」按鈕，等待一段時間後，即會回傳在臺灣商標資料庫中與該文字最相關的前50張商標。\n\nTips：不同詞語可用空白隔開，並勾選該文字對應的欄位（預設為全選，包含商標名稱、圖樣文字、公司相關資訊等等）"
                );
              }}
            >
              <SimpleLineIcons style={{ padding: SIZES.padding / 6 }} name="question" size={24} />
            </TouchableOpacity>
          </View>
          <SearchBar
            inputContainerStyle={{ backgroundColor: COLORS.white }}
            containerStyle={{ marginVertical: 7, backgroundColor: COLORS.white }}
            disabled={isLoading}
            onChangeText={(query) => setSearchQuery(query)}
            value={searchQuery}
            placeholder="Enter any text in your trademark"
          />
          {/* CheckBox */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <CheckBox checked={checked1} checkedTitle="商標名/商標上文字" onIconPress={() => setChecked1(!checked1)} onPress={() => setChecked1(!checked1)} title="商標名/商標上文字" />
            <CheckBox checked={checked2} checkedTitle="人名/公司名/地址..." onIconPress={() => setChecked2(!checked2)} onPress={() => setChecked2(!checked2)} title="人名/公司名/地址..." />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <CheckBox checked={checked3} checkedTitle="商品描述" onIconPress={() => setChecked3(!checked3)} onPress={() => setChecked3(!checked3)} title="商品描述" />
            <CheckBox checked={checked4} checkedTitle="其他" onIconPress={() => setChecked4(!checked4)} onPress={() => setChecked4(!checked4)} title="其他" />
          </View>
        </View>
        <View style={{ flex: 1, backgroundColor: COLORS.white, justifyContent: "flex-end" }}>
          {/* Button */}
          <Button
            buttonStyle={{ width: "100%", height: 45 }}
            containerStyle={{}}
            loading={isLoading}
            disabled={((images.uploading2 !== ImageURL) | (searchQuery !== "")) & (isLoading !== true) ? false : true}
            onPress={async () => {
              // await SEND_IMAGE(ImageURL);
              // var photos = await GET_IMAGE2();
              setIsLoading(true);
              let startTime = new Date();
              var returns = await Searching(ImageURL, searchQuery, [checked1, checked2, checked3, checked4]);
              let endTime = new Date();
              console.log((endTime - startTime) / 1000 + " seconds");
              navigation.push("SearchResults", { returns: returns });
              setIsLoading(false);
            }}
            title="送出"
          ></Button>
        </View>
        <BottomSheet isVisible={isVisible} containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}>
          {list.map((l, i) => (
            <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
              <ListItem.Content>
                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </BottomSheet>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});
