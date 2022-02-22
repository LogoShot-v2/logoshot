import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView, StatusBar } from "react-native";
import { images, icons, COLORS, FONTS, SIZES } from "../../constant/";

export default function SearchResultsContent({ photos, navigation, type }) {
  return (
    <>
      {photos.base64Images.length !== 0 ? (
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginVertical: 10, marginLeft: 15 }}>{photos.base64Images.length * 2} result(s) found.</Text>
            <View style={styles.searchResults}>
              {photos.base64Images.map((values, idx) => (
                <View style={idx === 0 ? styles.searchResultsRow : { ...styles.searchResultsRow, borderTopWidth: 1 }} key={idx}>
                  <View style={{ ...styles.searchResultsBox, borderRightWidth: 1 }}>
                    <TouchableOpacity
                      style={styles.searchResultsButton}
                      onPress={() => {
                        navigation.push("ImageDetails", { uri: values[0], metadatas: photos.metadatas[idx][0] });
                      }}
                    >
                      <Image source={{ uri: values[0] }} style={styles.searchResultsImage} />
                      <Text style={styles.searchResultsText}>{photos.metadatas[idx][0].trademark_name}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.searchResultsBox}>
                    <TouchableOpacity
                      style={styles.searchResultsButton}
                      onPress={() => {
                        navigation.push("ImageDetails", { uri: values[1], metadatas: photos.metadatas[idx][1] });
                      }}
                    >
                      <Image source={{ uri: values[1] }} style={styles.searchResultsImage} />
                      <Text style={styles.searchResultsText}>{photos.metadatas[idx][1].trademark_name}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      ) : (
        <View>
          <View style={{ height: "80%", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ ...FONTS.largeTitle }}>找不到結果</Text>
            <Text style={{ ...FONTS.h1 }}>試試看搜尋不同的{type}</Text>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "white",
  },
  scrollView: {
    backgroundColor: "white",
  },
  searchResults: {
    borderWidth: 1,
    backgroundColor: "white",
  },
  searchResultsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchResultsBox: {
    flex: 1,
    padding: 20,
  },
  searchResultsButton: {
    alignItems: "center",
  },
  searchResultsImage: {
    width: 150,
    height: 100,
    resizeMode: "contain",
  },
  searchResultsText: {
    marginTop: 10,
    color: "#808080",
    fontSize: 16,
  },
});
