import * as React from "react";
import { useState, useEffect } from "react";
import colors from "../config/colours";
import { db, firebase } from "../config/firebase";
import {
  Text,
  StyleSheet,
  FlatList,
  Platform,
  View,
  Image,
  ActivityIndicator,
  RefreshControl,
  Animated,
  TouchableOpacity,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AwesomeButton from "@umangmaurya/react-native-really-awesome-button";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import VisitedPost from "./VisitedPost";
import ItemSelector from "./ItemSelector";
import LoadingItemSelector from "./LoadingItemSelector";
import { Container, Header, Left, Right, Body } from "native-base";

function User({
  navigation,
  route: {
    params: { user },
  },
}) {
  /* #region  Variables */
  const limit = 9;
  const [followerCount, setFollowerCount] = useState(user.followers);
  const [initialFollowed, setInitialFollowed] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [documentData, setDocumentData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [endOfList, setEndOfList] = useState(false);
  const [listRefresh, setListRefresh] = useState(false);
  const [goingBack, setGoingBack] = useState(false);
  const [userData, setUserData] = useState(
    typeof user === "object" ? user : null
  );
  /* #endregion */

  /* #region  Functions */
  useEffect(() => {
    if (typeof user !== "object")
      db.collection("users")
        .doc(user)
        .get()
        .then((userSnap) => setUserData(userSnap.data()))
        .then(() => console.log(userData))
        .catch(console.log);
  }, []);

  useEffect(() => {
    db.collection("followed")
      .doc(typeof user === "object" ? user.objectID : user)
      .get()
      .then((query) => {
        const followers = query.data().followers;
        const isFollowed = followers.includes(firebase.auth().currentUser.uid);
        setInitialFollowed(isFollowed);
        setFollowed(isFollowed);
        setFollowerCount(followers.length - 1);
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    if (
      documentData.length == 0 &&
      lastVisible === null &&
      !refreshing &&
      !endOfList
    )
      retrieveData().catch(console.log);
  }, [documentData, lastVisible, refreshing, endOfList]);

  useEffect(() => {
    const timeout = setTimeout(() => followUser(), 1000);
    return () => clearTimeout(timeout);
  }, [followed]);

  function followUser() {
    if (followed !== initialFollowed) {
      const followedID = typeof user === "object" ? user.objectID : user;
      const followerID = firebase.auth().currentUser.uid;
      console.log(`User ${followed ? "followed" : "unfollowed"}`);
      const union = firebase.firestore.FieldValue.arrayUnion;
      const remove = firebase.firestore.FieldValue.arrayRemove;
      const followersRef = db.collection("followed").doc(followedID);
      followersRef
        .update({
          followers: initialFollowed ? remove(followerID) : union(followerID),
        })
        .then(() => setInitialFollowed(followed))
        .catch(console.log);
    }
  }

  function toggleFollow() {
    setFollowerCount(followed ? followerCount - 1 : followerCount + 1);
    setFollowed((f) => !f);
  }

  function retrieveData() {
    return new Promise((resolve, reject) => {
      if (endOfList || refreshing) return reject("Did not retrieve data");
      setRefreshing(true);
      console.log("Retrieving User posts");
      db.collection("users")
        .doc(typeof user === "object" ? user.objectID : user)
        .collection("posts")
        .orderBy("created", "desc")
        .limit(limit)
        .get()
        .then((docSnaps) => {
          let documentData = docSnaps.docs.map((document) => document.data());
          setDocumentData(documentData);
          setLastVisible(documentData[documentData.length - 1]?.created);
          setRefreshing(false);
          if (documentData.length < limit) setEndOfList(true);
        })
        .then(resolve)
        .catch(reject);
    });
  }

  function retrieveMore() {
    return new Promise((resolve, reject) => {
      if (endOfList || refreshing)
        return reject(
          `Couldn't load more posts: ${
            endOfList ? "End of the list" : "Still refreshing"
          }`
        );
      setRefreshing(true);
      console.log("Retrieving more posts");
      db.collection("users")
        .doc(typeof user === "object" ? user.objectID : user)
        .collection("posts")
        .orderBy("created", "desc")
        .startAfter(lastVisible)
        .limit(limit)
        .get()
        .then((docSnaps) => {
          let documentData = docSnaps.docs.map((document) => document.data());
          if (documentData.length === 0) {
            setEndOfList(true);
            setRefreshing(false);
            return resolve();
          }
          setDocumentData((prevData) => [...prevData, ...documentData]);
          setLastVisible(documentData[documentData.length - 1]?.created);
          setRefreshing(false);
          if (documentData.length < limit) setEndOfList(true);
          return resolve();
        })
        .catch(reject);
    });
  }

  function selectItem(post) {
    try {
      const { created, ...rest } = post;
      navigation.navigate("VisitedPost", {
        post: rest,
      });
    } catch (err) {
      console.log(err);
    }
  }

  function ProfileImage() {
    return userData === null || userData.imageUrl === "" ? (
      <FontAwesome name="user-circle-o" size={80} color={colors.grey} />
    ) : (
      <Image
        source={{ uri: userData.imageUrl }}
        style={{
          width: 80,
          height: 80,
          borderRadius: hp(100),
        }}
        resizeMode="contain"
      />
    );
  }

  function FollowButton() {
    return (
      <AwesomeButton
        style={{ marginTop: 20 }}
        progress
        onPress={(next) => {
          toggleFollow();
          next();
        }}
        width={wp(75)}
        borderRadius={20}
        borderWidth={1}
        borderColor={colors.pink}
        height={37}
        backgroundColor={followed ? colors.background : colors.pink}
        backgroundDarker={colors.pink_darker}
        raiseLevel={3}
      >
        <Text
          style={{
            color: followed ? colors.pink : colors.background,
            fontWeight: "bold",
            fontSize: 16,
            marginStart: wp(2),
          }}
        >
          {followed ? "Following" : "Follow"}
        </Text>
      </AwesomeButton>
    );
  }

  function refreshFn() {
    setLastVisible(null);
    setRefreshing(false);
    setEndOfList(false);
    setListRefresh((r) => !r);
    setDocumentData([]);
  }
  /* #endregion */

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
        <Left>
          <TouchableOpacity
            onPress={() => {
              if (!goingBack) {
                navigation.goBack();
                setGoingBack(true);
                followUser();
              }
            }}
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
        <Body>
          <Text style={styles.title}>
            {userData == null ? "" : userData.username}
          </Text>
        </Body>
        <Right>
          {/* <TouchableOpacity
            style={{
              width: hp(7),
              height: hp(5),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              size={24}
              color={colors.white}
            />
          </TouchableOpacity> */}
        </Right>
      </Header>
      <View style={{ alignItems: "center" }}>
        <ProfileImage />
        <Text style={styles.fullname}>{userData?.name}</Text>
        {userData?.bio != "" && <Text style={styles.bio}>{userData?.bio}</Text>}
        <FollowButton />
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                color: colors.white,
                fontSize: 22,
                justifyContent: "center",
                start: 35,
              }}
            >
              {userData?.postCount}
            </Text>
            <Text
              style={{
                color: colors.grey,
                fontSize: 13,
                justifyContent: "center",
                start: 35,
              }}
            >
              Reviews
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                color: colors.white,
                fontSize: 22,
                justifyContent: "center",
                end: 35,
              }}
            >
              {followerCount}
            </Text>
            <Text
              style={{
                color: colors.grey,
                fontSize: 13,
                justifyContent: "center",
                end: 35,
              }}
            >
              Followers
            </Text>
          </View>
        </View>
        <Text style={{ marginTop: 10, fontSize: 18, color: colors.white }}>
          Reviews
        </Text>
      </View>
      {documentData.length > 0 && (
        <FlatList
          style={{ marginTop: 15 }}
          contentContainerStyle={{ alignItems: "center" }}
          data={documentData}
          renderItem={({ item }) => (
            <ItemSelector
              item={item}
              onPress={() => {
                selectItem(item);
              }}
              screen="profile"
            />
          )}
          keyExtractor={(_, index) => String(index)}
          ListFooterComponent={refreshing ? <ActivityIndicator /> : null}
          onEndReached={() => {
            retrieveMore().catch(console.log);
          }}
          onEndReachedThreshold={0}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshFn} />
          }
          refreshing={refreshing}
          extraData={listRefresh}
        />
      )}
      {refreshing && (
        <FlatList
          style={{ marginTop: 15 }}
          contentContainerStyle={{ alignItems: "center" }}
          data={[1, 2, 3, 4, 5]}
          renderItem={() => <LoadingItemSelector screen="profileBackground" />}
          keyExtractor={(_, index) => String(index)}
        />
      )}
    </Container>
  );
}

export default function VisitedUser({ route }) {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="User" screenOptions={navigatorOptions}>
      <Stack.Screen name="VisitedPost" component={VisitedPost} />
      <Stack.Screen
        name="User"
        component={User}
        initialParams={{ user: route.params.user }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bio: {
    fontSize: 13,
    color: colors.grey,
  },
  container: {
    width: wp(96),
    height: hp(5),
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: wp(2),
    marginVertical: hp(1),
  },
  fullname: {
    marginTop: 10,
    fontSize: 15,
    color: colors.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },
  headerText: {
    color: colors.pink,
    fontSize: 26,
    textAlign: "left",
  },
  tabText: {
    fontSize: 20,
  },
  textInput: {
    color: colors.white,
    paddingStart: wp(6),
    height: hp(4),
    flex: 1,
    marginStart: wp(-5),
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
  },
  title: {
    fontSize: 20,
    color: colors.white,
    fontWeight: "bold",
  },
});

const navigatorOptions = {
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
