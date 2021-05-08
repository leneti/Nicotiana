import React, { useState } from "react";
import colors from "../config/colours";
import { db, firebase } from "../config/firebase";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import {
  TextInput as TextInputPaper,
  Modal as PaperModal,
  Portal,
} from "react-native-paper";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { Container, Header, Left, Right, Body } from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { uploadImage } from "../components/ImageUpload";
import { Indicator } from "../components/LoadingIndicator";
import { pickImage } from "../components/ImagePicking";

export default function EditProfilePage({
  navigation,
  route: {
    params: { user, refreshUser },
  },
}) {
  const [imageUri, setImageUri] = useState("");
  const [name, setFullName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [wait, setWait] = useState(false);

  /* #region Functions */
  function GoBack() {
    setWait(false);
    Keyboard.dismiss();
    setImageUri("");
    navigation.goBack();
  }

  function ProfileImage() {
    return (
      <TouchableOpacity
        onPress={async () => {
          const result = await pickImage([1, 1]);
          if (result !== null && !result.cancelled) setImageUri(result.uri);
        }}
      >
        <View style={{ alignItems: "center" }}>
          {imageUri !== "" || user.imageUrl !== "" ? (
            <Image
              source={{ uri: imageUri === "" ? user.imageUrl : imageUri }}
              style={{
                width: hp(13),
                height: hp(13),
                borderRadius: hp(100),
              }}
              resizeMode="contain"
            />
          ) : (
            <FontAwesome
              name="user-circle-o"
              size={hp(13)}
              color={colors.grey}
            />
          )}
          <Text style={{ color: colors.pink, fontSize: 18, marginTop: hp(1) }}>
            Change Picture
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  function SubmitUpdate() {
    setWait(true);
    if (
      // nothing changed
      imageUri === "" &&
      name === user.name &&
      username === user.username &&
      bio === user.bio
    ) {
      GoBack();
      return;
    }

    const userID = firebase.auth().currentUser.uid;
    const userRef = db.collection("users").doc(userID);

    if (imageUri === "") {
      userRef
        .update({ bio, name, username })
        .then(refreshUser)
        .catch((err) => {
          console.log(err);
          alert(
            "Unsuccessful",
            "Personal information was not updated. Check your internet connection and try again."
          );
        })
        .finally(GoBack);
    } else {
      uploadImage(userID, imageUri)
        .then((imageUrl) => {
          return userRef.update({
            bio,
            name,
            username,
            imageUrl,
          });
        })
        .then(refreshUser)
        .catch((err) => {
          console.log(err);
          alert(
            "Unsuccessful",
            "Personal information was not updated. Check your internet connection and try again."
          );
        })
        .finally(GoBack);
    }
  }
  /* #endregion */

  return (
    <Container style={styles.background}>
      <Portal>
        <PaperModal visible={wait} transparent={true}>
          <StatusBar
            translucent
            backgroundColor="#1C1C1C"
            barStyle="light-content"
          />
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
        </PaperModal>
      </Portal>
      <KeyboardAvoidingView behavior="position">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View>
            <Header
              iosBarStyle="light-content"
              transparent
              androidStatusBarColor={colors.background}
              style={{
                backgroundColor: colors.background,
                elevation: 0,
              }}
            >
              <Left style={{ flex: 1 }}>
                <TouchableOpacity
                  onPress={GoBack}
                  style={{
                    width: Platform.OS === "ios" ? hp(7) : hp(5),
                    height: hp(5),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {Platform.OS === "ios" ? (
                    <Text style={{ color: colors.white, fontSize: 18 }}>
                      Cancel
                    </Text>
                  ) : (
                    <MaterialIcons
                      name="close"
                      size={hp(4)}
                      color={colors.white}
                    />
                  )}
                </TouchableOpacity>
              </Left>
              <Body style={{ flex: 1 }}>
                <Text style={styles.header}>Edit Profile</Text>
              </Body>
              <Right style={{ flex: 1 }}>
                <TouchableOpacity
                  onPress={SubmitUpdate}
                  style={{
                    width: hp(6),
                    height: hp(5),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {Platform.OS === "ios" ? (
                    <Text style={{ color: colors.pink, fontSize: 18 }}>
                      Done
                    </Text>
                  ) : (
                    <MaterialIcons
                      name="done"
                      size={hp(3)}
                      color={colors.pink}
                    />
                  )}
                </TouchableOpacity>
              </Right>
            </Header>
            <View style={{ alignItems: "center" }}>
              <ProfileImage />
              <TextInputPaper
                style={{
                  width: wp(90),
                  height: hp(6),
                  marginTop: hp(5),
                }}
                mode="outlined"
                label="Name"
                defaultValue={name}
                error={false}
                onChangeText={setFullName}
                selectionColor={colors.grey}
                autoCapitalize="words"
                keyboardAppearance="dark"
                textContentType="name"
                maxLength={150}
                theme={{
                  colors: {
                    primary: colors.grey,
                    text: colors.white,
                    placeholder: colors.grey,
                    background: colors.background,
                  },
                }}
              />
              <TextInputPaper
                style={{
                  width: wp(90),
                  height: hp(6),
                  marginTop: hp(3),
                }}
                mode="outlined"
                label="Username"
                defaultValue={username}
                error={false}
                onChangeText={setUsername}
                selectionColor={colors.grey}
                autoCapitalize="words"
                keyboardAppearance="dark"
                textContentType="username"
                maxLength={150}
                theme={{
                  colors: {
                    primary: colors.grey,
                    text: colors.white,
                    placeholder: colors.grey,
                    background: colors.background,
                  },
                }}
              />
              <TextInputPaper
                style={{
                  width: wp(90),
                  height: hp(6),
                  marginTop: hp(3),
                }}
                mode="outlined"
                label="Bio"
                defaultValue={bio}
                error={false}
                onChangeText={setBio}
                selectionColor={colors.grey}
                autoCapitalize="words"
                keyboardAppearance="dark"
                multiline
                maxLength={150}
                theme={{
                  colors: {
                    primary: colors.grey,
                    text: colors.white,
                    placeholder: colors.grey,
                    background: colors.background,
                  },
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Container>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    color: colors.white,
    fontSize: 23,
    alignSelf: "center",
  },
});
