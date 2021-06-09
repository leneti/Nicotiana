import React, { useEffect, useState } from "react";
import colors from "../config/colours";
import Svg, { Path } from "react-native-svg";
import { Text, View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedPage from "../tabs/FeedPage";
import SearchPage from "../tabs/SearchPage";
import PostPage from "../tabs/PostPage";
import ProfilePage from "../tabs/ProfilePage";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { db, firebase } from "../config/firebase";
import { Indicator } from "../components/LoadingIndicator";
import { Container } from "native-base";
import AwesomeButton from "@umangmaurya/react-native-really-awesome-button";
import * as Linking from "expo-linking";

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      backBehavior="initialRoute"
      tabBarOptions={{
        keyboardHidesTabBar: "true",
        showLabel: "false",
        style: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
        },
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedPage}
        options={{
          tabBarIcon: (props) => (
            <Svg width={wp(4)} height={hp(2.5)} viewBox="0 0 18 18">
              <Path
                data-name="solid align-left"
                d="M.515 12.857h10.54a.515.515 0 00.515-.515V10.8a.515.515 0 00-.515-.515H.515A.515.515 0 000 10.8v1.54a.515.515 0 00.515.515zm0-10.286h10.54a.515.515 0 00.515-.515V.516A.515.515 0 0011.056 0H.515A.515.515 0 000 .515v1.54a.515.515 0 00.515.515zm16.842 2.571H.643A.643.643 0 000 5.786v1.286a.643.643 0 00.643.643h16.714A.643.643 0 0018 7.071V5.786a.643.643 0 00-.643-.643zm0 10.286H.643a.643.643 0 00-.643.643v1.286A.643.643 0 00.643 18h16.714a.643.643 0 00.643-.643v-1.286a.643.643 0 00-.643-.642z"
                fill={props.focused ? colors.pink : colors.grey}
              />
            </Svg>
          ),
          tabBarLabel: () => (
            <Text style={{ fontSize: 1, color: colors.background }}>Feed</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchPage}
        options={{
          tabBarIcon: (props) => (
            <Svg width={wp(4.5)} height={hp(3.5)} viewBox="0 0 20 20.003">
              <Path
                data-name="solid search"
                d="M19.728 17.294L15.833 13.4a.937.937 0 00-.664-.273h-.637a8.122 8.122 0 10-1.406 1.406v.637a.937.937 0 00.273.664l3.895 3.895a.934.934 0 001.324 0l1.106-1.106a.942.942 0 00.004-1.329zm-11.6-4.168a5 5 0 115-5 5 5 0 01-5.002 5z"
                fill={props.focused ? colors.pink : colors.grey}
              />
            </Svg>
          ),
          tabBarLabel: (props) => (
            <Text
              style={{
                fontSize: 1,
                color: colors.background,
              }}
            >
              Search
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={PostPage}
        options={{
          tabBarIcon: (props) => (
            <Svg width={wp(4.5)} height={hp(3.5)} viewBox="0 0 20 20">
              <Path
                data-name="solid pen-nib"
                d="M5.336 5.422a2.5 2.5 0 00-1.692 1.615L0 17.969l.574.574 5.864-5.864a1.893 1.893 0 11.884.884l-5.865 5.864.574.576 10.932-3.644a2.5 2.5 0 001.615-1.692l1.672-5.916-5-5-5.914 1.671zm14.115-2.524L17.1.55a1.876 1.876 0 00-2.653 0l-2.206 2.209 5 5L19.45 5.55a1.876 1.876 0 000-2.653z"
                fill={props.focused ? colors.pink : colors.grey}
              />
            </Svg>
          ),
          tabBarLabel: (props) => (
            <Text
              style={{
                fontSize: 1,
                color: colors.background,
              }}
            >
              Post
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          tabBarIcon: (props) => (
            <Svg width={wp(4.5)} height={hp(3.5)} viewBox="0 0 20 20">
              <Path
                data-name="solid user-alt"
                d="M10 11.25a5.625 5.625 0 10-5.625-5.625A5.626 5.626 0 0010 11.25zm5 1.25h-2.152a6.8 6.8 0 01-5.7 0H5a5 5 0 00-5 5v.625A1.875 1.875 0 001.875 20h16.25A1.875 1.875 0 0020 18.125V17.5a5 5 0 00-5-5z"
                fill={props.focused ? colors.pink : colors.grey}
              />
            </Svg>
          ),
          tabBarLabel: (props) => (
            <Text
              style={{
                fontSize: 1,
                color: colors.background,
              }}
            >
              Profile
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function BotNavigation() {
  const [uptodate, setUptodate] = useState();

  useEffect(() => {
    db.collection("sensitive-info")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snap) => setUptodate(snap.data().uptodate))
      .catch((e) => {
        console.log(e);
        setUptodate(false);
      });
  }, []);

  const Conditions = () => {
    return (
      <Container style={styles.background}>
        <Text style={{ color: colors.white, fontWeight: "bold" }}>
          Welcome to <Text style={{ color: colors.pink }}>Nicotiana</Text>
        </Text>
        <Text
          style={{ color: colors.grey, width: wp(70), textAlign: "center" }}
        >
          Write reviews or follow other enthusiasts to see what they have come
          up with
        </Text>
        <AwesomeButton
          style={{ marginTop: hp(3) }}
          onPress={() => {
            db.collection("sensitive-info")
              .doc(firebase.auth().currentUser.uid)
              .update({ uptodate: true })
              .catch(console.log);
            setUptodate(true);
          }}
          width={wp(70)}
          borderRadius={20}
          height={40}
          textColor={colors.white}
          textSize={16}
          backgroundColor={colors.pink}
          backgroundDarker={colors.pink_darker}
          raiseLevel={3}
        >
          Next
        </AwesomeButton>
        <View style={{ position: "absolute", bottom: 10 }}>
          <Text
            style={{
              color: colors.grey,
              fontSize: 12,
              paddingHorizontal: 20,
              textAlign: "center",
            }}
          >
            By clicling Next, you agree to our{" "}
            <Text
              style={{ fontWeight: "bold", color: colors.white }}
              onPress={() =>
                Linking.openURL(
                  "https://www.websitepolicies.com/policies/view/ZPnsr0Ym"
                )
              }
            >
              Terms
            </Text>
            . Learn how we collect, use and share your data in our{" "}
            <Text
              style={{ fontWeight: "bold", color: colors.white }}
              onPress={() =>
                Linking.openURL(
                  "https://www.freeprivacypolicy.com/live/2a958176-ba41-4dd2-8032-24fab93b1c0e"
                )
              }
            >
              Policy Notice
            </Text>
            .
          </Text>
        </View>
      </Container>
    );
  };

  const Loading = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
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
    );
  };

  if (uptodate === undefined) return <Loading />;
  return uptodate ? <Tabs /> : <Conditions />;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
});
