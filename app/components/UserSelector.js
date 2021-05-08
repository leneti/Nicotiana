import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { FontAwesome } from "@expo/vector-icons";
import colors from "../config/colours";
import Svg, { Path } from "react-native-svg";
import { TouchableOpacity } from "react-native-gesture-handler";
import { firebase } from "../config/firebase";

export default function UserSelector({ user, nav }) {
  const Avatar = () => {
    return user.imageUrl == "" ? (
      <FontAwesome name="user-circle-o" size={hp(7)} color={colors.grey} />
    ) : (
      <Image
        source={{ uri: user.imageUrl }}
        style={{
          width: hp(7),
          height: hp(7),
          borderRadius: hp(100),
        }}
        resizeMode="contain"
      />
    );
  };

  if (user.objectID === firebase.auth().currentUser.uid) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        nav.navigate("VisitedUser", { user });
      }}
    >
      <Avatar />
      <View style={{ marginStart: wp(2) }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.username}>{user.username}</Text>
          {user.verified && (
            <Svg
              style={{ marginStart: wp(1) }}
              width={wp(4)}
              height={wp(3)}
              viewBox="0 0 24 16.507"
            >
              <Path
                data-name="solid graduation-cap"
                d="M23.338 3.835L12.878.151a2.631 2.631 0 00-1.755 0L.662 3.835a1.056 1.056 0 000 1.96l1.824.642a3.688 3.688 0 00-.671 2.016 1.431 1.431 0 00-.1 2.279L.762 15.67a.67.67 0 00.585.837h2.1a.67.67 0 00.586-.837l-.957-4.938a1.429 1.429 0 00-.068-2.258 2.109 2.109 0 01.776-1.578l7.334 2.583a2.635 2.635 0 001.755 0l10.461-3.684a1.056 1.056 0 00.004-1.96zm-10.109 6.959a3.688 3.688 0 01-2.46 0L5.332 8.879l-.537 4.877c0 1.52 3.224 2.751 7.2 2.751s7.2-1.232 7.2-2.751l-.532-4.878z"
                fill={colors.pink}
              />
            </Svg>
          )}
        </View>
        <Text style={styles.name}>{user.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: wp(2),
    marginBottom: hp(1),
    width: wp(96),
    height: hp(9),
  },
  name: {
    color: colors.grey,
    fontSize: 13,
  },
  username: {
    color: colors.white,
    fontSize: 14,
  },
});
