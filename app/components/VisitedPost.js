import React, { useState, useEffect, useRef } from "react";
import { G, Line, Text as SvgText, TSpan } from "react-native-svg";
import {
  View,
  StyleSheet,
  Text,
  Platform,
  Image,
  TouchableWithoutFeedback,
  FlatList,
  StatusBar,
} from "react-native";
import BottomSheet from "reanimated-bottom-sheet";
import colors from "../config/colours";
import { PieChart } from "react-native-svg-charts";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { db, firebase } from "../config/firebase";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
  Entypo,
} from "@expo/vector-icons";
import { Container, Header, Left, Right, Body } from "native-base";
import {
  TextInput as TextInputPaper,
  Divider,
  Portal,
  List,
  Modal as PaperModal,
  Menu,
} from "react-native-paper";
import AwesomeButton from "@umangmaurya/react-native-really-awesome-button";
import Slider from "@react-native-community/slider";
import { useSelector } from "react-redux";

export default function VisitedPost({
  navigation,
  route: {
    params: { post, refresh },
  },
}) {
  const userID = firebase.auth().currentUser.uid;
  const postOwner = post.userUid === userID;

  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [pieData, setPieData] = useState(null);
  const [goingBack, setGoingBack] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [comment, setComment] = useState(post.comment);
  const [liked, setLiked] = useState(post.likedBy.includes(userID));
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [initialLiked, setInitialLiked] = useState(
    post.likedBy.includes(userID)
  );
  const savedUsers = useSelector((state) => state.users);

  /* #region Rating variables */
  const [strength, setStrength] = useState(post.strength);
  const [taste, setTaste] = useState(post.taste);
  const [clouds, setClouds] = useState(post.clouds);
  const [bowlUsed, setBowlUsed] = useState(post.bowlUsed);
  const [seshLength, setSeshLength] = useState(post.sessionLength);
  /* #endregion */

  /* #region Selection menu variables */
  const [selectBowl, setSelectBowl] = useState(false);
  const bowlTypes = ["Turkish", "Killer", "Phunel", "Fruit", "Other"];

  const [selectLength, setSelectLength] = useState(false);
  const lengths = [
    "Less than 1 hour",
    "1 to 2 hours",
    "2 to 3 hours",
    "More than 3 hours",
  ];
  /* #endregion */

  /* #region Functions */
  useEffect(() => {
    const mUser = savedUsers.filter((user) => user.uid === post.userUid)[0];
    if (mUser === undefined)
      db.collection("users")
        .doc(post.userUid)
        .get()
        .then((userSnapshot) => setUser(userSnapshot.data()))
        .catch(console.log);
    else setUser(mUser);

    /*
     * Random Pastel Colour generation
     * by Robin Nong (medium.com)
     */
    let colourArray = [];
    let nColours = 6;

    const randomPastelColour = () => {
      let hue = Math.floor(Math.random() * nColours);
      while (colourArray.includes(hue) && colourArray.length < nColours) {
        hue = Math.floor(Math.random() * nColours);
      }
      colourArray.push(hue);
      return `hsl(${hue * (360 / nColours)}, 70%, 80%)`;
    };

    const pieData = post.tobaccos.map((tobacco, index) => ({
      brand: tobacco.brand,
      flavour: tobacco.flavour,
      value: parseInt(tobacco.percentage),
      svg: {
        fill: tobacco.colour != null ? tobacco.colour : randomPastelColour(),
        onPress: () => {
          console.log("press", tobacco.flavour);
        },
      },
      key: `pie-${index}`,
    }));

    setPieData(pieData);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => likePost(), 5000);
    return () => clearTimeout(timer);
  }, [liked]);

  const likePost = () => {
    if (liked !== initialLiked) {
      console.log(`Post ${liked ? "liked" : "unliked"}`);
      const postRef = db
        .collection("users")
        .doc(post.userUid)
        .collection("posts")
        .doc(post.id);
      const union = firebase.firestore.FieldValue.arrayUnion;
      const remove = firebase.firestore.FieldValue.arrayRemove;
      const increment = firebase.firestore.FieldValue.increment;
      postRef
        .update({
          likedBy: liked ? union(userID) : remove(userID),
          likeCount: increment(liked ? 1 : -1),
        })
        .then(() => setInitialLiked(liked))
        .catch(console.log);
    }
  };

  const toggleLiked = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((count) => count - 1);
    } else {
      setLiked(true);
      setLikeCount((count) => count + 1);
    }
  };

  function Labels({ slices }) {
    return slices.map((slice, index) => {
      const { labelCentroid, pieCentroid, data } = slice;
      const words = data.flavour.split(" ");
      for (let i = 0; i < words.length; i++) {
        if (words[i] === "") {
          words.splice(i, 1);
          i--;
        }
      }
      let line1;
      let line2;
      if (words.length % 2 != 0 && labelCentroid[1] < 25) {
        line1 = words.slice(0, words.length / 2 + 1);
        line2 = words.slice(words.length / 2 + 1);
      } else {
        line1 = words.slice(0, words.length / 2);
        line2 = words.slice(words.length / 2);
      }
      const textLine1 = line1.join(" ");
      const textLine2 = line2.join(" ");

      let textStartX =
        labelCentroid[0] < 0
          ? labelCentroid[0] - Math.min(data.flavour.length * 3, 50)
          : labelCentroid[0] + Math.min(data.flavour.length * 3, 50);

      return (
        <G key={index}>
          <Line
            x1={labelCentroid[0]}
            y1={labelCentroid[1]}
            x2={pieCentroid[0]}
            y2={pieCentroid[1]}
            stroke={data.svg.fill}
          />
          <Line
            x1={
              labelCentroid[0] < 0
                ? labelCentroid[0] - Math.min(data.flavour.length * 6, 90)
                : labelCentroid[0] + Math.min(data.flavour.length * 6, 90)
            }
            y1={labelCentroid[1]}
            x2={labelCentroid[0]}
            y2={labelCentroid[1]}
            stroke={data.svg.fill}
          />
          <SvgText
            key={index}
            x={textStartX}
            y={
              labelCentroid[1] < 0
                ? labelCentroid[1] - 10
                : labelCentroid[1] + 10
            }
            fill={data.svg.fill}
            textAnchor={"middle"}
            alignmentBaseline={"middle"}
            fontSize={14}
            strokeWidth={0.2}
          >
            <TSpan
              x={textStartX}
              y={
                labelCentroid[1] < 0
                  ? labelCentroid[1] - 10
                  : labelCentroid[1] - 10
              }
            >
              {textLine1}
            </TSpan>
            <TSpan
              x={textStartX}
              y={
                labelCentroid[1] < 0
                  ? labelCentroid[1] + 10
                  : labelCentroid[1] + 10
              }
            >
              {textLine2}
            </TSpan>
          </SvgText>
          <SvgText
            key={index + 0.5}
            x={pieCentroid[0]}
            y={pieCentroid[1]}
            fill={data.svg.fill}
            textAnchor={"middle"}
            alignmentBaseline={"middle"}
            fontSize={12}
            stroke={colors.background}
            strokeWidth={0.7}
          >
            {data.value}
          </SvgText>
        </G>
      );
    });
  }

  function GoBack() {
    console.log("Back pressed");
    if (!goingBack) {
      navigation.goBack();
      setGoingBack(true);
    }
  }

  function Close() {
    setModalVisible(false);
  }

  function DeletePost() {
    db.collection("users")
      .doc(userID)
      .collection("posts")
      .doc(post.id)
      .delete()
      .then(async () => {
        const followedRef = db.collection("followed").doc(userID);
        const snap = await followedRef.get();
        const recentPosts = snap.data().recentPosts;
        for (let i = 0; i < recentPosts.length; i++) {
          if (recentPosts[i].id === post.id) {
            recentPosts.splice(i, 1);
            return followedRef.update({
              recentPosts,
              lastPost: recentPosts[0] != null ? recentPosts[0].created : "",
            });
          }
        }
      })
      .then(refresh)
      .then(Close)
      .catch(console.log)
      .finally(GoBack);
  }

  function UpdatePost() {
    const postRef = db
      .collection("users")
      .doc(post.userUid)
      .collection("posts")
      .doc(post.id);
    postRef
      .update({
        comment,
        strength,
        taste,
        clouds,
        bowlUsed,
        sessionLength: seshLength,
      })
      .then(console.log("Updated"))
      .catch(console.log);
  }

  function CancelEdit() {
    setEditMode(false);
    setStrength(post.strength);
    setTaste(post.taste);
    setClouds(post.clouds);
    setBowlUsed(post.bowlUsed);
    setSeshLength(post.sessionLength);
  }

  function MenuItem({ title, modalState, selectionState, last }) {
    return (
      <View>
        <Menu.Item
          onPress={() => {
            selectionState(title);
            modalState(false);
            console.log("Bowl used: " + title);
          }}
          title={title}
          style={styles.menuItem}
          titleStyle={styles.menuItemTitle}
        />
        {!last && <Divider style={styles.menuDivider} />}
      </View>
    );
  }

  function MenuItems({ toIterate, modalState, selectionState }) {
    let itemArray = [...toIterate];
    let lastItem = itemArray.pop();
    return (
      <View>
        {itemArray.map((title, key) => (
          <MenuItem
            key={key}
            title={title}
            modalState={modalState}
            selectionState={selectionState}
          />
        ))}
        <MenuItem
          key={lastItem.key}
          title={lastItem}
          modalState={modalState}
          selectionState={selectionState}
          last
        />
      </View>
    );
  }

  const sheetRef = useRef(null);
  const bottomSheetHeight = 101 + (postOwner ? 51 : 0);
  const bottomSheetItemHeight = 50;
  const bottomSheetFontSize = 16;

  const sheetContent = () => (
    <View
      style={{
        backgroundColor: colors.background_transparent,
        height: bottomSheetHeight,
      }}
    >
      {postOwner ? (
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
            sheetRef.current.snapTo(1);
            setSheetOpen(false);
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: bottomSheetItemHeight,
            }}
          >
            <Text
              style={{
                color: colors.red,
                fontSize: bottomSheetFontSize,
              }}
            >
              Delete
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            console.log("Reported");
            sheetRef.current.snapTo(1);
            setSheetOpen(false);
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: bottomSheetItemHeight,
            }}
          >
            <Text
              style={{
                color: colors.red,
                fontSize: bottomSheetFontSize,
              }}
            >
              Report
            </Text>
          </View>
        </TouchableOpacity>
      )}
      {postOwner && (
        <View>
          <Divider style={{ backgroundColor: colors.background }} />
          <TouchableOpacity
            onPress={() => {
              sheetRef.current.snapTo(1);
              setSheetOpen(false);
              setEditMode(true);
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: bottomSheetItemHeight,
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontSize: bottomSheetFontSize,
                }}
              >
                Edit Post
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <Divider style={{ backgroundColor: colors.background }} />
      <TouchableOpacity
        onPress={() => {
          sheetRef.current.snapTo(1);
          setSheetOpen(false);
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: bottomSheetItemHeight,
          }}
        >
          <Text
            style={{
              color: colors.white,
              fontSize: bottomSheetFontSize,
            }}
          >
            Cancel
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  /* #endregion */

  return (
    <TouchableWithoutFeedback
      disabled={!sheetOpen}
      onPress={() => {
        sheetRef.current.snapTo(1);
        setSheetOpen(false);
      }}
    >
      <Container>
        <Header
          iosBarStyle="light-content"
          androidStatusBarColor={colors.background}
          transparent
          style={{ backgroundColor: colors.background }}
        >
          <Left>
            <TouchableOpacity
              onPress={() => {
                editMode ? CancelEdit() : GoBack();
                likePost();
              }}
              style={{
                width: hp(7),
                height: hp(5),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {editMode ? (
                Platform.OS === "ios" ? (
                  <Text style={{ color: colors.white, fontSize: 18 }}>
                    Cancel
                  </Text>
                ) : (
                  <MaterialIcons
                    name="close"
                    size={hp(4)}
                    color={colors.white}
                  />
                )
              ) : (
                <MaterialIcons
                  name={Platform.OS === "ios" ? "arrow-back-ios" : "arrow-back"}
                  size={hp(4)}
                  color={colors.white}
                  style={{ marginStart: Platform.OS === "ios" ? wp(2) : 0 }}
                />
              )}
            </TouchableOpacity>
          </Left>
          <Body>
            {editMode ? (
              <Text style={styles.header}>Edit Post</Text>
            ) : (
              <View style={styles.userContainer}>
                {user == null || user.imageUrl === "" ? null : (
                  <Image
                    source={{ uri: user.imageUrl }}
                    style={{
                      width: hp(4),
                      height: hp(4),
                      borderRadius: hp(100),
                      marginEnd: wp(2),
                    }}
                    resizeMode="contain"
                  />
                )}
                <Text style={styles.username}>
                  {user == null ? "" : user.username}
                </Text>
              </View>
            )}
          </Body>
          <Right>
            <TouchableOpacity
              onPress={() => {
                if (editMode) {
                  UpdatePost();
                  setEditMode(false);
                } else {
                  sheetRef.current.snapTo(0);
                  setSheetOpen(true);
                }
              }}
              style={{
                width: hp(7),
                height: hp(5),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {editMode ? (
                Platform.OS === "ios" ? (
                  <Text style={{ color: colors.pink, fontSize: 18 }}>Done</Text>
                ) : (
                  <MaterialIcons name="done" size={hp(3)} color={colors.pink} />
                )
              ) : (
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={hp(4)}
                  color={colors.white}
                />
              )}
            </TouchableOpacity>
          </Right>
        </Header>
        <View style={styles.background}>
          <FlatList
            data={pieData}
            renderItem={({ item }) => (
              <List.Item
                style={{ marginEnd: wp(5), marginStart: wp(2) }}
                title={item.flavour}
                titleStyle={{ color: colors.white }}
                description={item.brand}
                descriptionStyle={{ color: colors.grey }}
                left={() => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: item.svg.fill,
                        marginEnd: wp(2),
                        fontWeight: "bold",
                      }}
                    >
                      {item.value}%
                    </Text>
                    <MaterialCommunityIcons
                      name="chart-arc"
                      size={hp(3)}
                      color={item.svg.fill}
                    />
                  </View>
                )}
              />
            )}
            ListHeaderComponent={
              <View>
                {post.imageUrl !== "" ? (
                  <Image
                    source={{ uri: post.imageUrl }}
                    style={{
                      width: wp(100),
                      height: wp(75),
                    }}
                  />
                ) : (
                  pieData != null && (
                    <PieChart
                      style={{
                        backgroundColor: colors.background,
                        height: hp(26),
                      }}
                      data={pieData}
                      innerRadius={wp(5)}
                      outerRadius={wp(13)}
                      labelRadius={wp(17)}
                      startAngle={pieData.length == 1 ? -2 : 0}
                      endAngle={
                        pieData.length == 1 ? Math.PI * 2 - 2 : Math.PI * 2
                      }
                    >
                      <Labels />
                    </PieChart>
                  )
                )}

                {!editMode && (
                  <View
                    style={{
                      marginTop: 2,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        paddingStart: wp(2),
                        paddingEnd: 5,
                        paddingVertical: 2,
                      }}
                      onPress={toggleLiked}
                    >
                      <Ionicons
                        name={liked ? "md-cube" : "md-cube-outline"}
                        size={24}
                        color={colors.pink}
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        color: colors.white,
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      {likeCount}
                      {likeCount == 1 ? " like" : " likes"}
                    </Text>
                  </View>
                )}

                {editMode ? (
                  <TextInputPaper
                    keyboardType={Platform.OS === "ios" ? "twitter" : "default"}
                    keyboardAppearance="dark"
                    placeholder="Write a caption..."
                    placeholderTextColor={colors.grey}
                    multiline
                    value={comment}
                    onChangeText={setComment}
                    maxLength={200}
                    height={hp(10)}
                    style={{
                      paddingHorizontal: wp(1),
                      paddingVertical: wp(1),
                    }}
                    theme={{
                      colors: {
                        primary: colors.grey,
                        background: "transparent",
                        text: colors.white,
                      },
                    }}
                  />
                ) : (
                  post.comment.length > 0 && (
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: colors.white,
                        marginTop: hp(1),
                        marginHorizontal: wp(2),
                      }}
                    >
                      {user == null ? "" : user.username + " "}
                      <Text style={{ fontWeight: "normal" }}>{comment}</Text>
                    </Text>
                  )
                )}

                {pieData?.length != 0 && (
                  <Text style={{ ...styles.h2, marginTop: 10 }}>Tobaccos</Text>
                )}
              </View>
            }
            ListFooterComponent={
              <View
                style={{
                  marginHorizontal: wp(5),
                }}
              >
                {editMode ? (
                  <View
                    style={{
                      marginTop: hp(4.2),
                      width: wp(90),
                      borderWidth: 1,
                      borderRadius: 25,
                      borderColor: colors.pink,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {strength < 6 ? (
                        <Entypo
                          name="feather"
                          size={hp(3)}
                          color={colors.pink}
                        />
                      ) : (
                        <AntDesign
                          name="dashboard"
                          size={hp(3)}
                          color={colors.pink}
                        />
                      )}
                      <Text
                        style={{
                          color: colors.pink,
                          fontSize: 15,
                          fontWeight: "bold",
                          textAlign: "center",
                          marginVertical: hp(2),
                          marginStart: wp(1),
                        }}
                      >
                        {strength == -1
                          ? "Select Strength"
                          : strength == 11
                          ? "Strength: 10+"
                          : `Strength: ${strength}`}
                      </Text>
                    </View>
                    <Slider
                      style={{ marginBottom: hp(1), marginHorizontal: wp(2) }}
                      minimumValue={0}
                      maximumValue={11}
                      minimumTrackTintColor={colors.pink}
                      maximumTrackTintColor={colors.pink_darker}
                      thumbTintColor={colors.white}
                      step={1}
                      value={strength}
                      onValueChange={setStrength}
                      onSlidingStart={setStrength}
                      onSlidingComplete={(value) => {
                        console.log("Strength: " + value);
                      }}
                    />
                  </View>
                ) : (
                  <View style={styles.infoContainer}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {strength < 6 ? (
                        <Entypo name="feather" size={20} color={colors.pink} />
                      ) : (
                        <AntDesign
                          name="dashboard"
                          size={20}
                          color={colors.pink}
                        />
                      )}
                      <Text style={styles.infoText}>
                        {`Strength: ${strength < 11 ? strength : "10+"}`}
                      </Text>
                    </View>
                  </View>
                )}

                {editMode ? (
                  <View
                    style={{
                      marginTop: hp(4.2),
                      width: wp(90),
                      borderWidth: 1,
                      borderRadius: 20,
                      borderColor: colors.pink,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name={taste < 6 ? "flask-outline" : "flask"}
                        size={hp(3)}
                        color={colors.pink}
                      />
                      <Text
                        style={{
                          color: colors.pink,
                          fontSize: 15,
                          fontWeight: "bold",
                          textAlign: "center",
                          marginVertical: hp(2),
                          marginStart: wp(1),
                        }}
                      >
                        {taste == 0 ? "Select Flavour" : `Flavour: ${taste}`}
                      </Text>
                    </View>
                    <Slider
                      style={{ marginBottom: hp(1), marginHorizontal: wp(2) }}
                      minimumValue={1}
                      maximumValue={10}
                      minimumTrackTintColor={colors.pink}
                      maximumTrackTintColor={colors.pink_darker}
                      thumbTintColor={colors.white}
                      step={1}
                      value={taste}
                      onValueChange={setTaste}
                      onSlidingStart={setTaste}
                      onSlidingComplete={(value) => {
                        console.log("Flavour: " + value);
                      }}
                    />
                  </View>
                ) : (
                  <View style={styles.infoContainer}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name={taste < 6 ? "flask-outline" : "flask"}
                        size={20}
                        color={colors.pink}
                      />
                      <Text style={styles.infoText}>{`Flavour: ${taste}`}</Text>
                    </View>
                  </View>
                )}

                {editMode ? (
                  <View
                    style={{
                      marginTop: hp(4.2),
                      width: wp(90),
                      borderWidth: 1,
                      borderRadius: 20,
                      borderColor: colors.pink,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name={clouds < 6 ? "cloud-outline" : "cloud"}
                        size={hp(3)}
                        color={colors.pink}
                      />
                      <Text
                        style={{
                          color: colors.pink,
                          fontSize: 15,
                          fontWeight: "bold",
                          textAlign: "center",
                          marginVertical: hp(2),
                          marginStart: wp(1),
                        }}
                      >
                        {clouds == 0
                          ? "Select cloud output"
                          : `Clouds: ${clouds}`}
                      </Text>
                    </View>
                    <Slider
                      style={{ marginBottom: hp(1), marginHorizontal: wp(2) }}
                      minimumValue={1}
                      maximumValue={10}
                      minimumTrackTintColor={colors.pink}
                      maximumTrackTintColor={colors.pink_darker}
                      thumbTintColor={colors.white}
                      step={1}
                      value={clouds}
                      onValueChange={setClouds}
                      onSlidingStart={setClouds}
                      onSlidingComplete={(value) => {
                        console.log("Clouds: " + value);
                      }}
                    />
                  </View>
                ) : (
                  <View style={styles.infoContainer}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name={clouds < 6 ? "cloud-outline" : "cloud"}
                        size={20}
                        color={colors.pink}
                      />
                      <Text style={styles.infoText}>{`Clouds: ${clouds}`}</Text>
                    </View>
                  </View>
                )}

                {editMode ? (
                  <View
                    style={{
                      marginTop: hp(4.2),
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Menu
                      visible={selectBowl}
                      onDismiss={() => setSelectBowl(false)}
                      anchor={
                        <AwesomeButton
                          width={wp(42)}
                          borderRadius={10}
                          borderWidth={1}
                          borderColor={colors.pink}
                          height={wp(10)}
                          backgroundColor={colors.background}
                          backgroundDarker={colors.pink_darker}
                          raiseLevel={3}
                          onPress={() => setSelectBowl(true)}
                        >
                          <MaterialCommunityIcons
                            name="menu"
                            size={hp(3)}
                            color={colors.pink}
                            style={{ marginEnd: wp(1) }}
                          />
                          <Text
                            style={{ color: colors.pink, fontWeight: "bold" }}
                          >
                            {bowlUsed === "" ? "Select Bowl" : bowlUsed}
                          </Text>
                        </AwesomeButton>
                      }
                      contentStyle={{
                        backgroundColor: colors.background_transparent,
                      }}
                    >
                      <MenuItems
                        toIterate={bowlTypes}
                        modalState={setSelectBowl}
                        selectionState={setBowlUsed}
                      />
                    </Menu>
                    <Menu
                      visible={selectLength}
                      onDismiss={() => setSelectLength(false)}
                      anchor={
                        <AwesomeButton
                          width={wp(42)}
                          borderRadius={10}
                          borderWidth={1}
                          borderColor={colors.pink}
                          height={wp(10)}
                          backgroundColor={colors.background}
                          backgroundDarker={colors.pink_darker}
                          raiseLevel={3}
                          onPress={() => setSelectLength(true)}
                        >
                          <MaterialCommunityIcons
                            name="clock-time-eight-outline"
                            size={hp(3)}
                            color={colors.pink}
                            style={{ marginEnd: wp(1) }}
                          />
                          <Text
                            style={{ color: colors.pink, fontWeight: "bold" }}
                          >
                            {seshLength === "" ? "Select Length" : seshLength}
                          </Text>
                        </AwesomeButton>
                      }
                      contentStyle={{
                        backgroundColor: colors.background_transparent,
                      }}
                    >
                      <MenuItems
                        toIterate={lengths}
                        modalState={setSelectLength}
                        selectionState={setSeshLength}
                      />
                    </Menu>
                  </View>
                ) : (
                  <View
                    style={{
                      marginTop: 20,
                      height: 45,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        width: wp(42),
                        borderWidth: 1,
                        borderRadius: hp(100),
                        borderColor: colors.pink,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name="menu"
                        size={20}
                        color={colors.pink}
                        style={{ marginEnd: wp(1) }}
                      />
                      <Text style={{ color: colors.pink, fontWeight: "bold" }}>
                        {bowlUsed}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: wp(42),
                        borderWidth: 1,
                        borderRadius: hp(100),
                        borderColor: colors.pink,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name="clock-time-eight-outline"
                        size={20}
                        color={colors.pink}
                        style={{ marginEnd: wp(1) }}
                      />
                      <Text style={{ color: colors.pink, fontWeight: "bold" }}>
                        {seshLength}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            }
          />
        </View>
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
            <View style={styles.modalView}>
              <Text style={{ color: colors.white }}>
                Are you sure you want to delete the post?
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
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
                  onPress={DeletePost}
                  style={{
                    marginTop: hp(1.4),
                    marginHorizontal: wp(1.25),
                  }}
                  width={wp(30)}
                  borderRadius={hp(100)}
                  height={wp(11)}
                  backgroundColor={colors.pink}
                  backgroundDarker={colors.pink_darker}
                  raiseLevel={3}
                >
                  <Text style={{ color: colors.background }}>Delete</Text>
                </AwesomeButton>
              </View>
            </View>
          </PaperModal>
        </Portal>
        <Portal>
          <BottomSheet
            ref={sheetRef}
            initialSnap={1}
            snapPoints={[bottomSheetHeight, 0, 0]}
            borderRadius={20}
            renderContent={sheetContent}
            enabledContentTapInteraction={false}
          />
        </Portal>
      </Container>
    </TouchableWithoutFeedback>
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
  infoContainer: {
    marginTop: 20,
    width: wp(90),
    borderWidth: 1,
    borderRadius: hp(100),
    borderColor: colors.pink,
  },
  infoText: {
    color: colors.pink,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    marginStart: wp(1),
  },
  image: {
    width: wp(100),
    height: hp(30),
    backgroundColor: colors.pink,
  },
  username: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.white,
    marginStart: wp(1),
  },
  text: {
    color: colors.pink,
    fontSize: 30,
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    borderRadius: 15,
    borderColor: colors.grey,
    borderWidth: 1,
    backgroundColor: colors.background,
    paddingVertical: hp(3),
    paddingHorizontal: wp(3.75),
  },
  hintText: {
    color: colors.white,
    fontSize: 10,
    paddingTop: hp(0.7),
    alignSelf: "center",
  },
  textInput: {
    color: colors.pink,
    paddingStart: wp(5),
    height: hp(6.3),
    flex: 1,
    marginStart: hp(-1.5),
  },
  modalButton: {
    backgroundColor: colors.grey,
    borderRadius: 20,
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(5),
    elevation: 2,
    marginTop: hp(1.4),
    marginHorizontal: wp(1.25),
  },
  buttonText: {
    color: colors.background,
    textAlign: "center",
  },
  container: {
    width: wp(50),
    height: hp(4.9),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  penContainer: {
    marginEnd: wp(-0.5),
  },
  h2: {
    color: colors.white,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    // marginBottom: hp(1.3),
  },
  h3: {
    color: colors.white,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItem: {
    width: wp(50),
    alignItems: "center",
  },
  menuItemTitle: {
    color: colors.white,
    marginStart: wp(5),
  },
  menuDivider: {
    backgroundColor: "black",
  },
});
