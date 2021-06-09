import * as React from "react";
import { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Platform,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from "react-native";
import colors from "../config/colours";
import { db, firebase } from "../config/firebase";
import ItemSelector from "../components/ItemSelector";
import LoadingItemSelector from "../components/LoadingItemSelector";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import VisitedPost from "../components/VisitedPost";
import VisitedUser from "../components/VisitedUser";
import { Indicator } from "../components/LoadingIndicator";
import AwesomeButton from "@umangmaurya/react-native-really-awesome-button";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { setPosts } from "../redux/actions";

let nav = null;

const Feed = ({ navigation }) => {
  const limit = 10;
  const [documentData, setDocumentData] = useState([]);
  const [loadingView, setLoadingView] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [endOfList, setEndOfList] = useState(false);
  const [listRefresh, setListRefresh] = useState(false);
  const [empty, setEmpty] = useState(false);

  // const postsState = useSelector((state) => state.posts);
  // const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;
    if (documentData.length == 0) {
      getFeed();
      if (mounted) setLoadingView(false);
    }
    return () => {
      mounted = false;
    };
  }, [documentData]);

  const getFeed = async () => {
    // if (postsState.length != 0) {
    //   setDocumentData(postsState);
    //   console.log("Data came from Redux");
    //   return;
    // }
    if (endOfList || refreshing) return;
    console.log("Retrieving Recent Posts");
    setRefreshing(true);
    db.collection("followed")
      .where("followers", "array-contains", firebase.auth().currentUser.uid)
      .orderBy("lastPost", "desc")
      .limit(limit)
      .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
        var source = snapshot.metadata.fromCache ? "local cache" : "server";
        console.log("Data came from " + source);
        const data = snapshot.docChanges().map((snap) => snap.doc.data());
        const posts = data.reduce(
          (acc, cur) => acc.concat(cur.recentPosts),
          []
        );
        for (let i = 0; i < posts.length; i++) {
          if (Object.keys(posts[i]).length === 0) {
            posts.splice(i, 1);
            i--;
          }
        }
        const sortedPosts = posts.sort((a, b) =>
          b.created > a.created ? 1 : b.created < a.created ? -1 : 0
        );
        setDocumentData(sortedPosts);
        // dispatch(setPosts(sortedPosts));
        if (sortedPosts.length == 0) setEmpty(true);
        setRefreshing(false);
        if (sortedPosts.length < limit * 5) setEndOfList(true);
      });
  };

  const selectItem = (post) => {
    try {
      const { created, ...rest } = post;
      navigation.navigate("VisitedPost", {
        post: rest,
        refresh: () => {
          refreshFn();
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const selectUser = (userID) => {
    try {
      if (userID === firebase.auth().currentUser.uid) {
        nav.navigate("Profile");
        return;
      }
      navigation.navigate("VisitedUser", { user: userID });
    } catch (err) {
      console.log(err);
    }
  };

  const refreshFn = () => {
    if (empty) setEmpty(false);
    if (refreshing) setRefreshing(false);
    if (endOfList) setEndOfList(false);
    setListRefresh((listRefresh) => !listRefresh);
    setDocumentData([]);
  };

  return (
    <View style={styles.background}>
      <View
        style={{
          marginHorizontal: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 30,
            textAlign: "left",
            color: colors.pink,
            fontFamily: "Yantramanav_300Light",
          }}
        >
          NICOTIANA
        </Text>
        <Indicator
          visible={loadingView || (documentData.length == 0 && !empty)}
          size={8}
        />
      </View>
      {documentData.length > 0 && (
        <FlatList
          data={documentData}
          renderItem={({ item }) => (
            <ItemSelector
              item={item}
              onPress={() => selectItem(item)}
              userOnPress={() => selectUser(item.userUid)}
              screen="feed"
            />
          )}
          keyExtractor={(_, index) => String(index)}
          ListFooterComponent={refreshing ? <ActivityIndicator /> : null}
          onEndReached={() => {
            /* TO-DO: Import posts with high rep? */
          }}
          onEndReachedThreshold={0.8}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshFn} />
          }
          refreshing={refreshing}
          extraData={listRefresh}
        />
      )}
      {documentData.length == 0 && !empty && (
        <FlatList
          data={[1, 2, 3, 4, 5]}
          renderItem={() => <LoadingItemSelector screen="feedBackground" />}
          keyExtractor={(_, index) => String(index)}
        />
      )}
      {empty && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              justifyContent: "space-evenly",
              flexDirection: "row",
              width: wp(100),
              marginBottom: hp(5),
            }}
          >
            <AwesomeButton
              onPress={() => {
                nav.navigate("Search");
              }}
              style={{
                padding: 10,
              }}
              width={wp(30)}
              borderRadius={20}
              borderWidth={1}
              borderColor={colors.pink}
              height={wp(30)}
              backgroundColor={colors.background_transparent}
              backgroundDarker={colors.pink_darker}
              textColor={colors.pink}
              raiseLevel={3}
            >
              Follow someone!
            </AwesomeButton>
            <AwesomeButton
              onPress={() => {
                nav.navigate("Post");
              }}
              style={{
                padding: 10,
              }}
              width={wp(30)}
              borderRadius={20}
              borderWidth={1}
              borderColor={colors.pink}
              height={wp(30)}
              backgroundColor={colors.background_transparent}
              backgroundDarker={colors.pink_darker}
              textColor={colors.pink}
              raiseLevel={3}
            >
              Write a review!
            </AwesomeButton>
          </View>
          <AwesomeButton
            onPress={refreshFn}
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
    </View>
  );
};

export default function FeedPage({ navigation }) {
  useEffect(() => {
    nav = navigation;
  }, []);
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="FeedTab"
      screenOptions={navigatorOptions}
    >
      <Stack.Screen name="FeedTab" component={Feed} />
      <Stack.Screen name="VisitedPost" component={VisitedPost} />
      <Stack.Screen name="VisitedUser" component={VisitedUser} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop:
      Platform.OS === "android" ? StatusBar.currentHeight + hp(1) : hp(4),
  },
  header: {
    color: colors.pink,
    fontSize: 30,
    textAlign: "left",
  },
  username: {
    fontSize: 13,
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
