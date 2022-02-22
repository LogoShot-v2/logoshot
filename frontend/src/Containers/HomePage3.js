import React, { useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { images, icons, COLORS, FONTS, SIZES } from "../../constant/";
import { useFonts } from "expo-font";
import { GET_IMAGE3 } from "../api";
import { SimpleLineIcons } from "@expo/vector-icons";

export default function HomePage3({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
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
      <View style={{ height: "20%", flexDirection: "row", justifyContent: "flex-end", backgroundColor: COLORS.white }}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              "LogoShot 介紹",
              "LogoShot 是台灣最好用的商標搜尋 APP，使用者只要拿起手機拍攝身邊的商標，就能得知該商標的註冊資訊。\n我們也使用自然語言處理（NLP）技術優化文字搜尋功能，並使用生成對抗網路（GAN）產生數以萬計的商標圖片，供使用者作為靈感啟發。\n\n指導教授：盧信銘老師\n組員：賴群龍（APP開發）\n組員：石子仙（文字搜尋）\n組員：陳韋傑（文字搜尋）\n組員：陳柏瑜（圖片搜尋）\n組員：黃佳文（商標生成）"
            );
          }}
        >
          <SimpleLineIcons style={{ padding: 20 }} name="info" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={{ height: "13%", backgroundColor: COLORS.white, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: COLORS.secondary, ...FONTS.largeTitle }}>LOGO SHOT</Text>
      </View>
      <View style={{ height: "32%", backgroundColor: COLORS.white }}></View>
      <View style={{ flexDirection: "row", height: "25%", backgroundColor: COLORS.white }}>
        <TouchableOpacity
          style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.white, borderRadius: 100, marginHorizontal: SIZES.base * 2 }}
          disabled={isLoading}
          onPress={async () => {
            setIsLoading(true);
            navigation.push("TrademarkSearch");
            setIsLoading(false);
          }}
        >
          <Text style={{ ...FONTS.h4 }}>找商標</Text>
          <Image source={icons.camera} resizeMode="contain" style={{ width: "60%", height: "60%" }} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.white, borderRadius: 100, marginHorizontal: SIZES.base * 2 }}
          disabled={isLoading}
          onPress={async () => {
            setIsLoading(true);
            let startTime = new Date();
            var base64Images = await GET_IMAGE3(0);
            let endTime = new Date();
            console.log((endTime - startTime) / 1000 + " seconds");
            navigation.push("InspirationSearch", { base64Images: base64Images });
            setIsLoading(false);
          }}
        >
          <Text style={{ ...FONTS.h4 }}>找靈感</Text>
          <Image source={icons.idea} resizeMode="contain" style={{ width: "60%", height: "60%" }} />
        </TouchableOpacity>
      </View>
      <View style={{ height: "10%", backgroundColor: COLORS.white }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
