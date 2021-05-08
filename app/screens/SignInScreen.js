import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import colors from "../config/colours";
import { firebase } from "../config/firebase";
import { signInWithGoogleAsync as GoogleSignIn } from "../components/GoogleSignIn";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AwesomeButton from "@umangmaurya/react-native-really-awesome-button";
import { Indicator } from "../components/LoadingIndicator";
import { Ionicons } from "@expo/vector-icons";

export default function SignInScreen() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    console.log("Trying to log in");
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        Alert.alert("Unsuccessful Login Attempt", error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.background}>
      {loading && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              width: wp(50),
              height: hp(25),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Indicator />
          </View>
        </View>
      )}

      {!loading && (
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: hp(60),
            width: wp(75),
          }}
        >
          <Text
            style={{
              fontSize: 45,
              color: colors.pink,
              fontFamily: "Yantramanav_300Light",
              marginBottom: hp(7),
            }}
          >
            NICOTIANA
          </Text>
          <View style={styles.container}>
            <TextInput
              style={styles.text}
              underlineColorAndroid="transparent"
              placeholder="Email"
              placeholderTextColor={colors.grey}
              autoCapitalize="words"
              autoCompleteType="email"
              keyboardType="email-address"
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.container}>
            <TextInput
              style={styles.text}
              underlineColorAndroid="transparent"
              placeholder="Password"
              placeholderTextColor={colors.grey}
              autoCapitalize="words"
              returnKeyType="done"
              secureTextEntry={true}
              onChangeText={setPassword}
            />
          </View>

          <AwesomeButton
            style={{ marginTop: hp(5) }}
            progress
            onPress={(next) => {
              setLoading(true);
              login();
              next();
            }}
            width={wp(70)}
            borderRadius={20}
            height={45}
            textColor={colors.white}
            textSize={16}
            backgroundColor={colors.pink}
            backgroundDarker={colors.pink_darker}
            raiseLevel={3}
          >
            Log in
          </AwesomeButton>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              width: wp(70),
              marginVertical: hp(2),
            }}
          >
            <View
              style={{ width: wp(30), height: 1, backgroundColor: colors.grey }}
            />
            <Text style={{ color: colors.grey }}>or</Text>
            <View
              style={{ width: wp(30), height: 1, backgroundColor: colors.grey }}
            />
          </View>
          <AwesomeButton
            progress
            onPress={async (next) => {
              setLoading(true);
              const result = await GoogleSignIn();
              if (result.cancelled) setLoading(false);
              next();
            }}
            width={wp(70)}
            borderRadius={20}
            height={45}
            backgroundColor={colors.white}
            backgroundDarker={colors.grey}
            raiseLevel={3}
          >
            <Ionicons name="logo-google" size={24} color={colors.background} />
            <Text
              style={{
                color: colors.background,
                fontWeight: "bold",
                fontSize: 16,
                marginStart: wp(2),
              }}
            >
              Continue with Google
            </Text>
          </AwesomeButton>
        </View>
      )}

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
          blurRadius={Platform.OS == "ios" ? 5.0 : 3.0}
          style={styles.hookah}
          source={require("../assets/hookah.png")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: wp(70),
    height: 36,
    marginTop: 20,
  },
  hookah: {
    width: 200,
    height: 366,
    alignSelf: "flex-end",
  },
  signintext: {
    color: colors.white,
    alignSelf: "center",
    paddingTop: Platform.OS === "android" ? 6 : 13,
    fontSize: 15,
  },
  text: {
    color: colors.pink,
    paddingStart: 20,
    fontSize: 16,
    height: 45,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.background_transparent,
    backgroundColor: colors.background_transparent,
  },
});
