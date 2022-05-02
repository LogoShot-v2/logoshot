import React, { useState, useEffect } from "react";
import { View, Text, Image, ImageStore, TouchableOpacity, Alert } from "react-native";
import { Chip, ThemeProvider, Button} from "react-native-elements";
import { images, icons, COLORS, FONTS, SIZES } from "../../constant/";
import { GET_IMAGE3 } from "../api";
import { SimpleLineIcons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet } from "react-native";

// import  "../../constant/others.css";
import {RNFetchBlob} from "rn-fetch-blob";
// import { Platform } from "react-native";


export default function InspirationSearch({ route, navigation }) {
    const [labelChosen, setLabelChosen] = useState(0);
    const [imageList, setImageList] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [count, setCount] = useState(0);
    const [start, setStart] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const clickChip = async (index) =>{
      if(index !== labelChosen){
          setDisabled(true);
          setImageList([]);
          setLabelChosen(index);
          setStart(false);
          setDisabled(false);
      }
  }

  useEffect(()=>{
      const fetchData = async () => {
          try{
              console.log('click chip', labelChosen);
              var images = await GET_IMAGE3(labelChosen);
              setImageList(images);
          }catch(e){
              console.log(e);
          }
      }
      fetchData();

  },[labelChosen])

  useEffect(()=>{
      if(start && imageList !== []){
          const interval = setInterval(()=>{
              setCount((count)=> (count+1) % imageList.length);
              console.log(count);
              console.log(imageList.length);
              // console.log(newCount);
          }, 1000);
          return () => clearInterval(interval);
      }
  }, [imageList, start])

  
const loading = () => (
  <View style={[styles.container, styles.horizontal]}>
    <ActivityIndicator />
    <ActivityIndicator size="large" color="#00ff00" />
  </View>
);

  const onStartOrStop = ()=>{
      // if(!start){
      //     setCount(0);
      // }
      setStart(!start);
  }

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
        <Chip buttonStyle={{ width: 80 }} title="圓圈" disabled={disabled} type={labelChosen === 0 ? "solid" : "outline"} onPress={() => clickChip(0)} />
        <Chip buttonStyle={{ width: 80 }} title="動物" disabled={disabled} type={labelChosen === 1 ? "solid" : "outline"} onPress={() => clickChip(1)} />
        <Chip buttonStyle={{ width: 80 }} title="植物" disabled={disabled} type={labelChosen === 2 ? "solid" : "outline"} onPress={() => clickChip(2)} />
        <Chip buttonStyle={{ width: 80 }} title="其他" disabled={disabled} type={labelChosen === 3 ? "solid" : "outline"} onPress={() => clickChip(3)} />
      </View>
      <View style={{ height: "35%", alignItems: "center", justifyContent: "center", backgroundColor: COLORS.white }}>
         {imageList.length !== 0 ?
        <Image source={start === true ? { uri: imageList[count] } : { uri: imageList[count] }} style={{ resizeMode: "contain", width: "70%", height: "70%" }}></Image>:
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>}
        {/* <Text>The {target === -1 ? count : target}th image</Text> */}
        {/* <Text>{label === 0 ? "Circles" : label === 1 ? "Animals" : label === 2 ? "Plants" : "Others"}</Text> */}
      </View>
      <View style={{ height: "7%",flexDirection: "row",alignItems: "center", justifyContent: "space-evenly", backgroundColor: COLORS.white }}>
        <Button
          buttonStyle={{ width: 150 }}
          containerStyle={{ alignItems: "center", justifyContent: "center" }}
          disabled={disabled}
          onPress={()=> onStartOrStop()}
          title={start === true ? "停止" : "開始"}
        ></Button>
          <Button
          buttonStyle={{ width: 150 }}
          containerStyle={{ alignItems: "center", justifyContent: "center" }}
          disabled={disabled}
          title={"下載"}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});
