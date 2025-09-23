import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/loading.gif")}
        style={styles.logo}
        contentFit="contain"
        transition={1000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: width * 0.75,
    height: 500,
  },
});
