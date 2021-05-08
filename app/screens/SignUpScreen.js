import React, { useState } from "react";
import colors from "../config/colours";
import { firebase } from "../config/firebase";
import {
  Image,
  StyleSheet,
  View,
  // Modal,
  TextInput,
  Platform,
  Alert,
  // Text,
} from "react-native";
import Svg, { G, Circle } from "react-native-svg";
// import { signInWithGoogleAsync as GoogleSignIn } from "../components/GoogleSignIn";
import { pickImage } from "../components/ImagePicking";
import AwesomeButton from "@umangmaurya/react-native-really-awesome-button";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Indicator } from "../components/LoadingIndicator";
import { userCreated } from "../components/NewUserCreated";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialIcons /* Ionicons */ } from "@expo/vector-icons";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");

  const CreateAccount = () => {
    console.log("Trying to create the account");
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        console.log("\nUser signed in");
        if (!result.additionalUserInfo.isNewUser) return;
        userCreated(result.user.uid, image, name, email);
      })
      .catch((error) => {
        Alert.alert("Unsuccessful register", error.message);
        console.log(error.message);
      })
      .finally(() => {
        setLoading(false);
        firebase.auth().useDeviceLanguage();
        firebase.auth().currentUser.sendEmailVerification();
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
          <TouchableOpacity
            onPress={async () => {
              const result = await pickImage([1, 1]);
              if (result !== null && !result.cancelled) setImage(result.uri);
            }}
          >
            {image === "" && (
              <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                <Svg width={100} height={100} viewBox="0 0 132 132">
                  <G data-name="Ellipse 1" fill="#999" stroke="#707070">
                    <Circle cx={66} cy={66} r={66} stroke="none" />
                    <Circle cx={66} cy={66} r={65.5} fill="none" />
                  </G>
                </Svg>
                <MaterialIcons
                  name="add-a-photo"
                  size={24}
                  color={colors.white}
                />
              </View>
            )}
            {image !== "" && (
              <Image
                source={{ uri: image }}
                style={{
                  width: hp(14),
                  height: hp(14),
                  borderRadius: hp(100),
                }}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>

          <View style={styles.container}>
            <TextInput
              style={styles.text}
              underlineColorAndroid="transparent"
              placeholder="Full Name"
              placeholderTextColor={colors.grey}
              autoCapitalize="words"
              onChangeText={setName}
            />
          </View>
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
            style={{ marginTop: hp(4) }}
            progress
            onPress={(next) => {
              setLoading(true);
              CreateAccount();
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
            Create an account
          </AwesomeButton>
          {/* <View
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
          </AwesomeButton> */}
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
