import React from "react";
import { View, Image } from "react-native";
import colours from "../config/colours";

export default function Splashscreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colours.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        style={{ width: 550, height: 756 }}
        resizeMode="contain"
        source={require("../assets/splash.png")}
      />
    </View>
  );
}
