import React, { useEffect, useState } from "react";
import colors from "../config/colours";
import { createStackNavigator } from "@react-navigation/stack";
import VisitedPost from "../components/VisitedPost";
import ItemSelector from "../components/ItemSelector";
import LoadingItemSelector from "../components/LoadingItemSelector";
import {
  Text,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
  Animated,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Indicator } from "../components/LoadingIndicator";
import { db, firebase } from "../config/firebase";
import {
  MaterialCommunityIcons,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import { Container, Header, Left, Right, Body } from "native-base";
import AwesomeButton from "@umangmaurya/react-native-really-awesome-button";
import { Snackbar } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import {
  addMorePosts,
  setUserPosts,
  clearProfilePosts,
  updateUser,
} from "../redux/actions";

let nav = null;
let postsLoaded = 0;

function ProfileTab({ navigation }) {
  /* #region  Variables */
  const limit = 10;
  const delay = 3000;
  const userID = firebase.auth().currentUser.uid;
  const [documentData, setDocumentData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loadingView, setLoadingView] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [endOfList, setEndOfList] = useState(false);
  const [listRefresh, setListRefresh] = useState(false);
  const [timer, setTimer] = useState(0);
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState(null);

  // const postsState = useSelector((state) => state.userPosts);
  // const usersState = useSelector((state) => state.users);
  // const dispatch = useDispatch();
  /* #endregion */

  /* #region  Functions */
  useEffect(() => {
    let mounted = true;
    if (
      documentData.length == 0 &&
      lastVisible === null &&
      !refreshing &&
      !endOfList
    ) {
      getUserInfo();
      if (mounted) retrieveData();
    }

    return () => {
      mounted = false;
    };
  }, [documentData, lastVisible, refreshing, endOfList]);

  function getUserInfo() {
    // if (usersState.length != 0) {
    //   const i = usersState.findIndex((user) => user.uid === userID);
    //   if (i != -1 && usersState[i].name !== undefined) {
    //     setUser(usersState[i]);
    //     setLoadingView(false);
    //     console.log("User data came from Redux");
    //     return;
    //   }
    // }
    console.log("Getting user data");
    db.collection("users")
      .doc(userID)
      .get()
      .then((userSnapshot) => {
        setUser(userSnapshot.data());
        // dispatch(
        //   updateUser({
        //     uid: userID,
        //     ...userSnapshot.data(),
        //   })
        // );
        setLoadingView(false);
      })
      .catch(console.log);
  }

  function retrieveData() {
    // if (postsState.length != 0) {
    //   let posts =
    //     postsState.length > limit
    //       ? postsState.slice(0, limit)
    //       : [...postsState];
    //   postsLoaded = posts.length;
    //   setDocumentData(posts);
    //   setRefreshing(false);
    //   setLastVisible(posts[posts.length - 1]?.created);
    //   console.log("Data came from Redux");
    //   return;
    // }
    if (endOfList || refreshing) return;
    console.log("Retrieving Data");
    setRefreshing(true);
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("posts")
      .orderBy("created", "desc")
      .limit(limit)
      .get()
      .then((docSnaps) => {
        let documentData = docSnaps.docs.map((document) => document.data());
        setDocumentData(documentData);
        // dispatch(setUserPosts(documentData));
        setLastVisible(documentData[documentData.length - 1]?.created);
        setRefreshing(false);
        // postsLoaded = documentData.length;
        if (documentData.length < limit) setEndOfList(true);
        if (loadingView) setLoadingView(false);
      })
      .catch(console.log);
  }

  function retrieveMore() {
    if (endOfList || refreshing) {
      return;
    }
    // if (postsState.length > postsLoaded) {
    //   let posts = postsState.slice(postsLoaded, postsLoaded + limit);
    //   setDocumentData((prevData) => [...prevData, ...posts]);
    //   setLastVisible(posts[posts.length - 1]?.created);
    //   postsLoaded += posts.length;
    //   console.log("Extra data came from Redux");
    //   return;
    // }
    console.log("Retrieving additional Data");
    setRefreshing(true);
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
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
          return;
        }
        setDocumentData((prevData) => [...prevData, ...documentData]);
        // dispatch(addMorePosts(documentData));
        setLastVisible(documentData[documentData.length - 1]?.created);
        setRefreshing(false);
        // postsLoaded += documentData.length;
        if (documentData.length < limit) setEndOfList(true);
      })
      .catch(console.log);
  }

  function selectItem(post) {
    try {
      const { created, ...rest } = post;
      navigation.navigate("VisitedPost", {
        post: rest,
        refresh: refreshFn,
      });
    } catch (err) {
      console.log(err);
    }
  }

  function ProfileImage() {
    return user.imageUrl == "" ? (
      <FontAwesome name="user-circle-o" size={80} color={colors.grey} />
    ) : (
      <Image
        source={{ uri: user.imageUrl }}
        style={{
          width: 80,
          height: 80,
          borderRadius: hp(100),
        }}
        resizeMode="contain"
      />
    );
  }

  function OpenDrawer() {
    nav.openDrawer();
  }

  function EditProfile() {
    nav.navigate("EditProfile", {
      user: user,
      refreshUser: getUserInfo,
    });
  }

  function refreshFn() {
    if (Date.now() - timer >= delay) {
      setTimer(Date.now());
    } else {
      setVisible(true);
      return;
    }
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
        <Left style={{ flex: 1 }} />
        <Body style={{ flex: 1 }}>
          <Text style={styles.header}>{loadingView ? "" : user.username}</Text>
        </Body>
        <Right style={{ flex: 1 }}>
          <TouchableOpacity
            style={{
              width: hp(7),
              height: hp(5),
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={OpenDrawer}
          >
            <MaterialCommunityIcons
              name="menu"
              size={hp(3)}
              color={colors.pink}
            />
          </TouchableOpacity>
        </Right>
      </Header>
      {loadingView && (
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
      {!loadingView && (
        <View style={{ alignItems: "center" }}>
          <ProfileImage />
          <Text style={styles.fullname}>{user.name}</Text>
          {user.bio != "" && <Text style={styles.bio}>{user.bio}</Text>}
          <AwesomeButton
            style={{ marginTop: 20 }}
            onPress={EditProfile}
            width={wp(75)}
            borderRadius={20}
            borderWidth={1}
            borderColor={colors.pink}
            height={37}
            backgroundColor={colors.background}
            backgroundDarker={colors.pink_darker}
            raiseLevel={3}
          >
            <Text
              style={{
                color: colors.pink,
                fontWeight: "bold",
                fontSize: 16,
                marginStart: wp(2),
              }}
            >
              Edit Profile
            </Text>
          </AwesomeButton>
          <View
            style={{
              flexDirection: "row",
              marginTop: hp(1),
              marginHorizontal: wp(20),
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontSize: 22,
                  justifyContent: "center",
                }}
              >
                {user.postCount}
              </Text>
              <Text
                style={{
                  color: colors.grey,
                  fontSize: 13,
                  justifyContent: "center",
                }}
              >
                Posts
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: 22,
                  justifyContent: "center",
                }}
              >
                {user.followers}
              </Text>
              <Text
                style={{
                  color: colors.grey,
                  fontSize: 13,
                  justifyContent: "center",
                }}
              >
                Followers
              </Text>
            </View>
          </View>
          <Text style={{ marginTop: hp(2), fontSize: 18, color: colors.white }}>
            My Posts
          </Text>
        </View>
      )}
      {documentData.length > 0 && (
        <FlatList
          style={{ marginTop: 15 }}
          contentContainerStyle={{ alignItems: "center" }}
          data={documentData}
          renderItem={({ item }) => (
            <ItemSelector
              item={item}
              onPress={() => selectItem(item)}
              screen="profile"
            />
          )}
          keyExtractor={(_, index) => String(index)}
          ListFooterComponent={refreshing ? <ActivityIndicator /> : null}
          onEndReached={() => retrieveMore()}
          onEndReachedThreshold={0.8}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshFn} />
          }
          refreshing={refreshing}
          extraData={listRefresh}
        />
      )}
      {refreshing && !loadingView && (
        <FlatList
          style={{ marginTop: 15 }}
          data={[1, 2, 3, 4, 5]}
          renderItem={() => <LoadingItemSelector screen="profileBackground" />}
          keyExtractor={(_, index) => String(index)}
          contentContainerStyle={{ alignItems: "center" }}
        />
      )}
      {!refreshing &&
        !loadingView &&
        documentData.length == 0 &&
        lastVisible == null && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AwesomeButton
              progress
              onPress={(next) => {
                refreshFn();
                next();
              }}
              width={wp(30)}
              borderRadius={25}
              borderWidth={1}
              borderColor={colors.pink}
              height={50}
              backgroundColor={colors.background_transparent}
              backgroundDarker={colors.pink_darker}
              textColor={colors.pink}
              raiseLevel={3}
            >
              <Ionicons name="md-refresh" size={hp(3.5)} color={colors.pink} />
              <Text
                style={{
                  color: colors.pink,
                  fontWeight: "bold",
                  fontSize: 16,
                  marginStart: 5,
                }}
              >
                Refresh
              </Text>
            </AwesomeButton>
          </View>
        )}
      <Snackbar
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}
        duration={1000}
        style={{
          backgroundColor: colors.background_transparent,
        }}
      >
        {`Please wait ${Math.trunc(
          (delay - (Date.now() - timer)) / 1000
        )} seconds`}
      </Snackbar>
    </Container>
  );
}

const Stack = createStackNavigator();

export default function ProfilePage({ navigation }) {
  useEffect(() => {
    nav = navigation;
  }, []);
  return (
    <Stack.Navigator
      initialRouteName="ProfileTab"
      screenOptions={navigatorOptions}
    >
      <Stack.Screen name="ProfileTab" component={ProfileTab} />
      <Stack.Screen name="VisitedPost" component={VisitedPost} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
  buttonText: {
    color: colors.pink,
    alignSelf: "center",
    paddingTop: Platform.OS === "android" ? 4 : 11,
    fontSize: 13,
  },
  circlePhoto: {
    marginTop: 10,
  },
  fullname: {
    marginTop: 10,
    fontSize: 15,
    color: colors.white,
  },
  bio: {
    fontSize: 13,
    color: colors.grey,
  },
  header: {
    color: colors.white,
    fontSize: 23,
    alignSelf: "center",
    fontWeight: "bold",
  },
  username: {
    fontSize: 13,
    color: colors.grey,
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
