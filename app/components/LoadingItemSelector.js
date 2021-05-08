import React from "react";
import { View } from "react-native";
import colors from "../config/colours";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function LoadingItemSelector({ screen }) {
  if (screen == "feedBackground") {
    return (
      <View style={{ height: hp(38), marginBottom: hp(1) }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 35,
              height: 35,
              borderRadius: hp(100),
              backgroundColor: colors.background_transparent,
            }}
          />
          <View
            style={{
              width: wp(Math.floor(Math.random() * 15) + 10),
              height: 15,
              borderRadius: hp(100),
              backgroundColor: colors.background_transparent,
              marginStart: wp(1),
            }}
          />
        </View>
        <View
          style={{
            marginTop: hp(1),
            height: hp(30),
            width: wp(100),
            borderRadius: 20,
            backgroundColor: colors.background_transparent,
          }}
        />
      </View>
    );
  }
  return (
    <View
      style={{
        height: hp(25),
        width: wp(75),
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.grey,
        marginBottom: hp(1),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background_transparent,
      }}
    >
      <View
        style={{
          width: wp(20),
          height: wp(20),
          borderRadius: hp(100),
          backgroundColor: colors.grey,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: wp(4),
            height: wp(4),
            borderRadius: hp(100),
            backgroundColor: colors.background_transparent,
          }}
        />
      </View>
    </View>
  );
}
