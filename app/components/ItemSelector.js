import React, { useEffect, useState } from "react";
import { db, firebase } from "../config/firebase";
import { device } from "../config/device";
import { View, StyleSheet, Text, Image, ImageBackground } from "react-native";
import colors from "../config/colours";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { G, Line, Text as SvgText, TSpan } from "react-native-svg";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-svg-charts";
import { TouchableOpacity } from "react-native-gesture-handler";
import ViewMoreText from "react-native-view-more-text";

export default function ItemSelector({ item, screen, onPress, userOnPress }) {
  const userID = firebase.auth().currentUser.uid;
  const [user, setUser] = useState(null);
  const [pieData, setPieData] = useState(null);
  const [liked, setLiked] = useState(item.likedBy.includes(userID));
  const [likeCount, setLikeCount] = useState(item.likeCount);
  const [initialLiked, setInitialLiked] = useState(
    item.likedBy.includes(userID)
  );

  useEffect(() => {
    db.collection("users")
      .doc(item.userUid)
      .get()
      .then((userSnap) => setUser(userSnap.data()))
      .catch(console.log);

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

    const pieData = item.tobaccos.map((tobacco, index) => ({
      brand: tobacco.brand,
      flavour: tobacco.flavour,
      value: tobacco.percentage,
      svg: {
        fill: tobacco.colour == null ? randomPastelColour() : tobacco.colour,
        onPress: () => null,
      },
      key: `pie-${index}`,
    }));

    setPieData(pieData);
  }, []);

  const Avatar = () => {
    return user == null ? (
      <FontAwesome
        style={{ margin: 5 }}
        name="user-circle-o"
        size={30}
        color={colors.grey}
      />
    ) : user.imageUrl != "" ? (
      <Image
        source={{ uri: user.imageUrl }}
        style={{
          width: 35,
          height: 35,
          borderRadius: hp(100),
          margin: 5,
        }}
        resizeMode="contain"
      />
    ) : (
      <FontAwesome
        name="user-circle-o"
        size={30}
        color={colors.grey}
        style={{ margin: 5 }}
      />
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (liked !== initialLiked) {
        console.log(`Post ${liked ? "liked" : "unliked"}`);
        const postRef = db
          .collection("users")
          .doc(item.userUid)
          .collection("posts")
          .doc(item.id);
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
    }, 5000);

    return () => clearTimeout(timer);
  }, [liked]);

  const toggleLiked = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((count) => count - 1);
    } else {
      setLiked(true);
      setLikeCount((count) => count + 1);
    }
  };

  const Labels = ({ slices }) => {
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
            fontSize={
              screen === "feed"
                ? device === "phone"
                  ? wp(4)
                  : 16
                : device === "phone"
                ? wp(3)
                : 12
            }
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
            fontSize={hp(1.3)}
            stroke={colors.background}
            strokeWidth={0.7}
          >
            {data.value}
          </SvgText>
        </G>
      );
    });
  };

  return screen === "feed" ? (
    <View style={{ marginBottom: 5 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={userOnPress}
        >
          <Avatar />
          <Text style={styles.username}>
            {user == null ? "" : user.username}
          </Text>
          {user != null && user.verified && (
            <FontAwesome
              name="graduation-cap"
              size={10}
              color={colors.pink}
              style={{ marginStart: wp(1.5) }}
            />
          )}
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={{
            width: hp(6),
            height: hp(7),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="dots-vertical"
            size={20}
            color={colors.white}
          />
        </TouchableOpacity> */}
      </View>
      <TouchableOpacity
        style={{ flexDirection: "row" }}
        onPress={() => onPress()}
      >
        <ImageBackground
          source={{ uri: item.imageUrl }}
          style={{
            width: wp(100),
            height: wp(75),
            backgroundColor:
              item.imageUrl === ""
                ? colors.background_transparent
                : colors.background,
          }}
          imageStyle={{ opacity: 0.5 }}
          blurRadius={Platform.OS === "ios" ? 5 : 3}
        >
          {pieData != null && (
            <PieChart
              style={{
                height: wp(75),
                width: wp(100),
              }}
              data={pieData}
              innerRadius={wp(6)}
              outerRadius={wp(16)}
              labelRadius={wp(22)}
              startAngle={pieData.length == 1 ? -2 : 0}
              endAngle={pieData.length == 1 ? Math.PI * 2 - 2 : Math.PI * 2}
            >
              <Labels />
            </PieChart>
          )}
        </ImageBackground>
      </TouchableOpacity>
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
          onPress={() => toggleLiked()}
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
      {item.comment.length > 0 && (
        <ViewMoreText
          numberOfLines={2}
          renderViewMore={(onPress) => (
            <Text
              style={{
                marginHorizontal: wp(2),
                color: colors.pink,
              }}
              onPress={onPress}
            >
              ...more
            </Text>
          )}
          renderViewLess={() => null}
          textStyle={{
            fontSize: 14,
            fontWeight: "bold",
            color: colors.white,
            marginTop: hp(1),
            marginHorizontal: wp(2),
          }}
        >
          <Text>
            {user == null ? "" : user.username + " "}
            <Text style={{ fontWeight: "normal" }}>{item.comment}</Text>
          </Text>
        </ViewMoreText>
      )}
    </View>
  ) : (
    <TouchableOpacity
      onPress={() => onPress()}
      style={{
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.white,
        marginBottom: hp(1),
      }}
    >
      <ImageBackground
        source={{ uri: item.imageUrl }}
        style={{
          borderRadius: 20,
          width: wp(75),
          height: wp(53.47),
          backgroundColor: colors.background,
        }}
        imageStyle={{
          opacity: 0.5,
          borderRadius: 20,
        }}
        blurRadius={Platform.OS === "ios" ? 5 : 3}
      >
        {pieData != null && (
          <PieChart
            style={{
              width: wp(75),
              height: wp(53.47),
            }}
            data={pieData}
            innerRadius={wp(2)}
            outerRadius={wp(10)}
            labelRadius={wp(14)}
            startAngle={pieData.length == 1 ? -2 : 0}
            endAngle={pieData.length == 1 ? Math.PI * 2 - 2 : Math.PI * 2}
          >
            <Labels />
          </PieChart>
        )}
        <View
          style={{
            marginTop: -34,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons
            style={{
              paddingStart: wp(2),
              paddingEnd: 5,
              paddingVertical: 2,
            }}
            name={liked ? "md-cube" : "md-cube-outline"}
            size={24}
            color={colors.pink}
          />
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
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  username: {
    fontSize: 13,
    color: colors.white,
    fontWeight: "bold",
  },
});
