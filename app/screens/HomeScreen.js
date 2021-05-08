import * as React from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import colors from "../config/colours";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AwesomeButton from "@umangmaurya/react-native-really-awesome-button";
import { Container } from "native-base";

export default function HomeScreen({ navigation }) {
  return (
    <Container>
      <View style={styles.background}>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, color: colors.white }}>Welcome to</Text>
          <Text
            style={{
              fontSize: 45,
              color: colors.pink,
              fontFamily: "Yantramanav_300Light",
            }}
          >
            NICOTIANA
          </Text>
          <AwesomeButton
            style={{ marginTop: hp(5) }}
            onPress={() => navigation.navigate("SignIn")}
            width={wp(64)}
            borderRadius={20}
            height={45}
            textColor={colors.background}
            textSize={16}
            backgroundColor={colors.white}
            backgroundDarker={colors.grey}
            raiseLevel={3}
          >
            Log in
          </AwesomeButton>
          <AwesomeButton
            style={{ marginTop: hp(1) }}
            onPress={() => navigation.navigate("SignUp")}
            width={wp(64)}
            borderRadius={20}
            height={45}
            textColor={colors.white}
            textSize={16}
            backgroundColor={colors.pink}
            backgroundDarker={colors.pink_darker}
            raiseLevel={3}
          >
            Sign Up
          </AwesomeButton>
        </View>
        <View
          pointerEvents="none"
          style={{
            alignSelf: "flex-end",
            zIndex: -1,
            bottom: 0,
            position: "absolute",
          }}
        >
          <Image
            resizeMode="contain"
            style={styles.hookah}
            source={require("../assets/hookah.png")}
          />
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  hookah: {
    width: 200,
    height: 366,
    alignSelf: "flex-end",
  },
});
