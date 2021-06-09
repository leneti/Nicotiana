// @refresh reset
import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import colors from "./app/config/colours";
import { firebase } from "./app/config/firebase";
import { GetDevice } from "./app/config/device";
import { LogBox, Animated, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Provider } from "react-native-paper";
import * as Linking from "expo-linking";
import { useFonts, Yantramanav_300Light } from "@expo-google-fonts/yantramanav";

import HomeScreen from "./app/screens/HomeScreen";
import SignUpScreen from "./app/screens/SignUpScreen";
import SignInScreen from "./app/screens/SignInScreen";
import BotNavigation from "./app/screens/BotNavigation";
import PrivacyPolicy from "./app/screens/PrivacyPolicy";
import EditProfilePage from "./app/tabs/EditProfilePage";
import Settings from "./app/screens/Settings";
import Splashscreen from "./app/components/Splashscreen";

import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { store, persistor } from "./app/redux/store";

LogBox.ignoreLogs(["Setting a timer for a long period of time"]);

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Privacy Policy"
        labelStyle={{ color: colors.grey }}
        onPress={() => props.navigation.navigate("PrivacyPolicy")}
      />
      <DrawerItem
        label="Terms Of Use"
        labelStyle={{ color: colors.grey }}
        onPress={() =>
          Linking.openURL(
            "https://www.websitepolicies.com/policies/view/ZPnsr0Ym"
          )
        }
      />
      <DrawerItem
        label="Settings"
        labelStyle={{ color: colors.grey }}
        onPress={() => props.navigation.navigate("Settings")}
      />
      <DrawerItem
        label="Log Out"
        labelStyle={{ color: colors.pink }}
        style={{
          backgroundColor: "#3B3D44",
        }}
        onPress={() => firebase.auth().signOut()}
      />
    </DrawerContentScrollView>
  );
}

let time = 0;

export default function App() {
  const [loggedIn, setLoggedIn] = useState();
  let [fontsLoaded] = useFonts({ Yantramanav_300Light });

  useEffect(() => {
    time = Date.now();
    GetDevice();
    const subscriber = firebase.auth().onAuthStateChanged(setLoggedIn);
    return subscriber;
  }, []);

  if (!fontsLoaded || (Date.now() - time < 2000 && !loggedIn)) {
    return <Splashscreen />;
  } else if (!loggedIn) {
    return (
      <Provider>
        <StatusBar
          translucent
          backgroundColor={colors.background}
          barStyle="light-content"
        />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={navigatorOptions}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  } else {
    return (
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Provider>
            <StatusBar
              translucent
              backgroundColor={colors.background}
              barStyle="light-content"
            />
            <NavigationContainer>
              <Drawer.Navigator
                initialRouteName={"BotNavigation"}
                drawerPosition="right"
                drawerStyle={{
                  backgroundColor: colors.background,
                  width: wp(60),
                }}
                drawerType="slide"
                backBehavior="initialRoute"
                overlayColor="transparent"
                edgeWidth={0}
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={navigatorOptions}
              >
                <Drawer.Screen name="BotNavigation" component={BotNavigation} />
                <Drawer.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
                <Drawer.Screen name="EditProfile" component={EditProfilePage} />
                <Drawer.Screen name="Settings" component={Settings} />
              </Drawer.Navigator>
            </NavigationContainer>
          </Provider>
        </PersistGate>
      </ReduxProvider>
    );
  }
}

const navigatorOptions = {
  title: "",
  headerTransparent: true,
  headerTintColor: colors.pink,
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
