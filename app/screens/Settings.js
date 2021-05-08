import React, { useState, useEffect } from "react";
import colors from "../config/colours";
import { db, firebase } from "../config/firebase";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity,
  Animated,
  Image,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Container, Header, Left, Right, Body } from "native-base";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  List,
  RadioButton,
  Modal as PaperModal,
  Portal,
} from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import AwesomeButton from "@umangmaurya/react-native-really-awesome-button";

const Stack = createStackNavigator();
let nav = null;

const Main = ({ navigation }) => {
  return (
    <Container style={styles.background}>
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
            onPress={() => nav.goBack()}
            style={{
              width: hp(5),
              height: hp(5),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons
              name={Platform.OS === "ios" ? "arrow-back-ios" : "arrow-back"}
              size={hp(3)}
              color={colors.white}
              style={{ marginStart: Platform.OS === "ios" ? wp(2) : 0 }}
            />
          </TouchableOpacity>
        </Left>
        <Body style={{ flex: 3 }}>
          <Text style={styles.header}>Settings</Text>
        </Body>
        <Right style={{ flex: 1 }} />
      </Header>
      <View style={{ paddingHorizontal: wp(2), marginTop: 20 }}>
        <List.Item
          title="Select theme"
          titleStyle={{ color: colors.white }}
          left={(props) => (
            <MaterialCommunityIcons
              {...props}
              name="theme-light-dark"
              size={24}
              color={colors.white}
            />
          )}
          onPress={() => navigation.navigate("ThemeChanger")}
        />
        <List.Item
          title="Delete account"
          titleStyle={{ color: colors.red }}
          left={(props) => (
            <MaterialIcons
              {...props}
              name="delete"
              size={24}
              color={colors.red}
            />
          )}
          onPress={() => navigation.navigate("Leave")}
        />
      </View>
    </Container>
  );
};

const ThemeChanger = ({ navigation }) => {
  const [value, setValue] = useState("dark");
  return (
    <Container style={styles.background}>
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
            onPress={() => navigation.goBack()}
            style={{
              width: hp(5),
              height: hp(5),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons
              name={Platform.OS === "ios" ? "arrow-back-ios" : "arrow-back"}
              size={hp(3)}
              color={colors.white}
              style={{ marginStart: Platform.OS === "ios" ? wp(2) : 0 }}
            />
          </TouchableOpacity>
        </Left>
        <Body style={{ flex: 3 }}>
          <Text style={styles.header}>Select Theme</Text>
        </Body>
        <Right style={{ flex: 1 }} />
      </Header>
      <RadioButton.Group onValueChange={setValue} value={value}>
        <RadioButton.Item
          label="Dark"
          value="dark"
          color={colors.pink}
          labelStyle={{ color: colors.white }}
          uncheckedColor={colors.grey}
        />
        <RadioButton.Item
          label="Light"
          value="light"
          color={colors.pink}
          labelStyle={{ color: colors.white }}
          uncheckedColor={colors.grey}
          disabled
        />
      </RadioButton.Group>
      <Text
        style={{
          color: colors.grey,
          fontSize: 12,
          paddingHorizontal: 20,
          textAlign: "center",
        }}
      >
        Currently the app only supports dark mode.
      </Text>
    </Container>
  );
};

const Leave = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const Close = () => setModalVisible(false);
  const Open = () => setModalVisible(true);

  const DeleteAccount = async () => {
    console.log("Deleting account...");
    let madePosts = false;
    await db
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("posts")
      .limit(1)
      .get()
      .then((query) => (madePosts = query.size > 0))
      .catch(console.log);

    if (madePosts) {
      await db.collection("users").doc(firebase.auth().currentUser.uid).update({
        bio: firebase.firestore.FieldValue.delete(),
        followers: firebase.firestore.FieldValue.delete(),
        imageUrl: firebase.firestore.FieldValue.delete(),
        name: firebase.firestore.FieldValue.delete(),
        postCount: firebase.firestore.FieldValue.delete(),
        rep: firebase.firestore.FieldValue.delete(),
        verified: firebase.firestore.FieldValue.delete(),
      });
    } else {
      await db
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .delete();
    }

    return await firebase.auth().currentUser.delete();
  };

  return (
    <Container style={styles.background}>
      <Portal>
        <PaperModal
          onDismiss={Close}
          contentContainerStyle={styles.centeredView}
          visible={modalVisible}
        >
          <StatusBar
            translucent
            backgroundColor="#1C1C1C"
            barStyle="light-content"
          />
          <KeyboardAvoidingView
            behavior="position"
            style={{ marginBottom: Platform.OS === "ios" ? 80 : 0 }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalView}>
                <Text
                  style={{
                    color: colors.white,
                    textAlign: "center",
                    marginBottom: hp(1),
                    width: wp(70),
                  }}
                >
                  This action can not be undone. Are you sure you want to
                  deactivate?
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                >
                  <AwesomeButton
                    onPress={Close}
                    style={{
                      marginTop: hp(1.4),
                      marginHorizontal: wp(1.25),
                    }}
                    width={wp(30)}
                    borderRadius={hp(100)}
                    height={wp(11)}
                    backgroundColor={colors.grey}
                    backgroundDarker={colors.background}
                    raiseLevel={3}
                  >
                    <Text style={{ color: colors.background }}>Cancel</Text>
                  </AwesomeButton>
                  <AwesomeButton
                    progress
                    onPress={async (next) => {
                      firebase
                        .auth()
                        .currentUser.reauthenticateWithCredential(
                          firebase.auth.EmailAuthProvider.credential(
                            firebase.auth().currentUser.email,
                            password
                          )
                        )
                        .then(DeleteAccount)
                        .catch(alert);
                      next();
                    }}
                    style={{
                      marginTop: hp(1.4),
                      marginHorizontal: wp(1.25),
                    }}
                    width={wp(30)}
                    borderRadius={hp(100)}
                    height={wp(11)}
                    backgroundColor={colors.red}
                    backgroundDarker={colors.pink_darker}
                    raiseLevel={3}
                  >
                    <Text style={{ color: colors.white }}>Delete</Text>
                  </AwesomeButton>
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
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </PaperModal>
      </Portal>
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
            onPress={() => navigation.goBack()}
            style={{
              width: hp(5),
              height: hp(5),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons
              name={Platform.OS === "ios" ? "arrow-back-ios" : "arrow-back"}
              size={hp(3)}
              color={colors.white}
              style={{ marginStart: Platform.OS === "ios" ? wp(2) : 0 }}
            />
          </TouchableOpacity>
        </Left>
        <Body style={{ flex: 3 }}>
          <Text style={styles.header}>Delete account</Text>
        </Body>
        <Right style={{ flex: 1 }} />
      </Header>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          bottom: hp(10),
        }}
      >
        <Text style={{ color: colors.white, fontWeight: "bold", fontSize: 18 }}>
          You are about to leave{" "}
          <Text
            style={{
              color: colors.pink,
              fontFamily: "Yantramanav_300Light",
              fontWeight: "100",
            }}
          >
            NICOTIANA
          </Text>
        </Text>
        <Text
          style={{
            color: colors.grey,
            width: wp(70),
            textAlign: "center",
            marginTop: 5,
          }}
        >
          Deactivating your account cannot be undone. You will not be able to
          register a new account with the same username or recover the
          deactivated account. This will not delete the content of posts you've
          made on Nicotiana. To do so please delete them individually.
        </Text>
        <AwesomeButton
          style={{ marginTop: hp(3) }}
          onPress={Open}
          width={wp(70)}
          borderRadius={20}
          height={40}
          textColor={colors.white}
          textSize={16}
          backgroundColor={colors.red}
          backgroundDarker={colors.pink_darker}
          raiseLevel={3}
        >
          Delete
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
    </Container>
  );
};

export default function Settings({ navigation }) {
  useEffect(() => {
    nav = navigation;
    console.log("Email verified: ");
    console.log(firebase.auth().currentUser.emailVerified);
  }, []);
  return (
    <Stack.Navigator initialRouteName="Main" screenOptions={navigatorOptions}>
      <Stack.Screen name="Main" component={Main} />
      <Stack.Screen name="Leave" component={Leave} />
      <Stack.Screen name="ThemeChanger" component={ThemeChanger} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: wp(70),
    height: 36,
    marginTop: 20,
  },
  header: {
    color: colors.white,
    fontSize: 23,
    alignSelf: "center",
    fontWeight: "bold",
  },
  hookah: {
    width: 200,
    height: 366,
    alignSelf: "flex-end",
  },
  modalView: {
    borderRadius: 15,
    borderColor: colors.grey,
    borderWidth: 1,
    backgroundColor: colors.background,
    paddingVertical: hp(3),
    paddingHorizontal: wp(3.75),
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

const navigatorOptions = {
  title: "",
  header: () => null,
  cardStyle: { backgroundColor: "transparent" },
  cardStyleInterpolator: ({ current, next, inverted, layouts: { screen } }) => {
    const progress = Animated.add(
      current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: "clamp",
      }),
      next
        ? next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: "clamp",
          })
        : 0
    );

    return {
      cardStyle: {
        transform: [
          {
            translateX: Animated.multiply(
              progress.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [screen.width, 0, screen.width * -0.3],
                extrapolate: "clamp",
              }),
              inverted
            ),
          },
        ],
      },
    };
  },
};
