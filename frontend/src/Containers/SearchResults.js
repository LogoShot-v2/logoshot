import * as React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SearchResultsContent from "./SearchResultsContent";

const Tab = createMaterialTopTabNavigator();

export default function SearchResults({ route, navigation }) {
  const ImageSearch = () => <SearchResultsContent photos={route.params.returns.photos1} navigation={navigation} type={"圖"} />;
  const TextSearch = () => <SearchResultsContent photos={route.params.returns.photos2} navigation={navigation} type={"字"} />;
  return (
    <Tab.Navigator initialRouteName={route.params.returns.initial}>
      <Tab.Screen name="Image Search" component={ImageSearch} />
      <Tab.Screen name="Text Search" component={TextSearch} />
    </Tab.Navigator>
  );
}
