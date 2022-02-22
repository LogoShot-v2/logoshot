import React, { useEffect } from "react";
import { Platform, AppRegistry } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { name as appName } from "./app.json";
import * as ImagePicker from "expo-image-picker";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { HomePage, HomePage2, HomePage3, TrademarkSearch, InspirationSearch, SearchResults, ImageDetails } from "./src/Containers/";

const AppStack = createStackNavigator();

export default function App() {
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const permission1 = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const permission2 = await ImagePicker.requestCameraPermissionsAsync();
        if ((permission1.status !== "granted") | (permission2.status !== "granted")) {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  return (
    // <SafeAreaProvider>
    <PaperProvider>
      <NavigationContainer>
        <AppStack.Navigator initialRouteName="HomePage">
          <AppStack.Screen name="HomePage3" component={HomePage} />
          <AppStack.Screen name="HomePage2" component={HomePage2} />
          <AppStack.Screen name="HomePage" component={HomePage3} />
          <AppStack.Screen name="TrademarkSearch" component={TrademarkSearch} />
          <AppStack.Screen name="InspirationSearch" component={InspirationSearch} />
          <AppStack.Screen name="SearchResults" component={SearchResults} />
          <AppStack.Screen name="ImageDetails" component={ImageDetails} />
        </AppStack.Navigator>
      </NavigationContainer>
    </PaperProvider>
    // </SafeAreaProvider>
  );
}
// AppRegistry.registerComponent(appName, () => Main);
