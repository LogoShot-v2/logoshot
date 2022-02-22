import React, { useState, useEffect } from "react";
import { View, Text, Image, ImageStore, TouchableOpacity, Alert } from "react-native";
import { Chip, ThemeProvider, Button } from "react-native-elements";
import { images, icons, COLORS, FONTS, SIZES } from "../../constant/";
import { GET_IMAGE3 } from "../api";
import { SimpleLineIcons } from "@expo/vector-icons";

export default function InspirationSearch({ route, navigation }) {
  const [imageList, setImageList] = useState(route.params.base64Images);
  // const imageList = [images.random1, images.random2, images.random4, images.random5, images.random6, images.random7, images.random8, images.random9];
  const [label, setLabel] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(-1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((count) => (count + 1) % imageList.length);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const clickChip = async (Label) => {
    if (Label !== label) {
      setDisabled(true);
      setTarget(count);
      setLabel(Label);
      var base64Images = await GET_IMAGE3(Label);
      setImageList(base64Images);
      setTarget(-1);
      setDisabled(false);
    }
  };

  return (
    <ThemeProvider>
      <View style={{ height: "15%", alignItems: "center", justifyContent: "flex-end", backgroundColor: COLORS.white }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ ...FONTS.mediumTitle }}>你適合哪個商標</Text>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "靈感啟發",
                "我們使用生成對抗網路 (GAN) 自動生成了數以萬計的全新 Logo 圖案，並於此頁面中央隨機展示，供使用者作為靈感啟發。使用者可點擊下方 STOP / RESUME 按鈕切換觀看模式，以及點擊上方的標籤按鈕觀看特定的Logo類別。"
              );
            }}
          >
            <SimpleLineIcons style={{ padding: SIZES.padding / 6 }} name="question" size={24} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ height: "10%", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", backgroundColor: COLORS.white, padding: SIZES.padding / 2 }}>
        <Chip buttonStyle={{ width: 80 }} title="Circles" disabled={disabled} type={label === 0 ? "solid" : "outline"} onPress={() => clickChip(0)} />
        <Chip buttonStyle={{ width: 80 }} title="Animals" disabled={disabled} type={label === 1 ? "solid" : "outline"} onPress={() => clickChip(1)} />
        <Chip buttonStyle={{ width: 80 }} title="Plants" disabled={disabled} type={label === 2 ? "solid" : "outline"} onPress={() => clickChip(2)} />
        <Chip buttonStyle={{ width: 80 }} title="Others" disabled={disabled} type={label === 3 ? "solid" : "outline"} onPress={() => clickChip(3)} />
      </View>
      <View style={{ height: "35%", alignItems: "center", justifyContent: "center", backgroundColor: COLORS.white }}>
        <Image source={target === -1 ? { uri: imageList[count] } : { uri: imageList[target] }} style={{ resizeMode: "contain", width: "70%", height: "70%" }}></Image>
        {/* <Text>The {target === -1 ? count : target}th image</Text> */}
        {/* <Text>{label === 0 ? "Circles" : label === 1 ? "Animals" : label === 2 ? "Plants" : "Others"}</Text> */}
      </View>
      <View style={{ height: "7%", backgroundColor: COLORS.white }}>
        <Button
          buttonStyle={{ width: 150 }}
          containerStyle={{ alignItems: "center", justifyContent: "center" }}
          disabled={disabled}
          onPress={async () => {
            if (target === -1) {
              setTarget(count);
            } else {
              setTarget(-1);
            }
          }}
          title={target === -1 ? "STOP" : "RESUME"}
        ></Button>
      </View>
      <View style={{ height: "25%", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", backgroundColor: COLORS.white }}>
        <Image source={images.lefthand} style={{ resizeMode: "contain", width: "70%", height: "70%" }}></Image>
        <Image source={images.righthand} style={{ resizeMode: "contain", width: "70%", height: "70%" }}></Image>
      </View>
      <View style={{ height: "8%", backgroundColor: COLORS.white }}>
        {/* <Button buttonStyle={{ width: "100%" }} style={{ alignItems: "center", justifyContent: "center" }} onPress={() => {}} title="DOWNLOAD"></Button> */}
      </View>
    </ThemeProvider>
  );
}
