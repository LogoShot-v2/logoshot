import * as React from "react";
import { useState, useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SearchResultsContent from "./SearchResultsContent";

const Tab = createMaterialTopTabNavigator();

export default function SearchResults({ route, navigation }) {
  const ImageSearch = () => <SearchResultsContent photos={route.params.returns.photos1} navigation={navigation} type={"圖"} />;
  const TextSearch = () => <SearchResultsContent photos={route.params.returns.photos2} navigation={navigation} type={"字"} />;
  
  useEffect(() => {
    console.log(route.params.returns.photos1.base64Images.Array)
    console.log(route.params.returns.photos2.base64Images.Array)
  })
  return (
    
     (route.params.returns.initial == "Text Search" )? 
      <SearchResultsContent
    photos={route.params.returns.photos2} 
    navigation={navigation} 
    type={"字"}  />
    : 
      <SearchResultsContent
      photos={route.params.returns.photos1} 
      navigation={navigation} 
      type={"圖"}  />    
     
  );
}
