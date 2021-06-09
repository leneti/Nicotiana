import * as React from "react";
import colors from "../config/colours";
import { db, firebase } from "../config/firebase";
import { device } from "../config/device";
import { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { G, Line, Text as SvgText, TSpan } from "react-native-svg";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  FlatList,
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
  LogBox,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { PieChart } from "react-native-svg-charts";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Feather,
  Ionicons,
  AntDesign,
  Entypo,
} from "@expo/vector-icons";
import AwesomeButton from "@umangmaurya/react-native-really-awesome-button";
import {
  TextInput as TextInputPaper,
  List,
  Menu,
  Modal as PaperModal,
  Portal,
  Divider,
  Snackbar,
} from "react-native-paper";
import Slider from "@react-native-community/slider";
import { uploadImage } from "../components/ImageUpload";
import { Container, Header, Left, Right, Body } from "native-base";
import DropDownPicker from "react-native-dropdown-picker";
import { Indicator } from "../components/LoadingIndicator";
import { tobaccoList, brandList } from "../config/tobaccoList";
import { pickImage, takePicture } from "../components/ImagePicking";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
  "source.uri should not be an empty string",
]);
const numberOfChartColours = 6;

let nav = null;

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
            labelCentroid[1] < 0 ? labelCentroid[1] - 10 : labelCentroid[1] + 10
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
};

const PostFirstScreen = ({ navigation }) => {
  const userID = firebase.auth().currentUser.uid;
  const [snackAlert, setSnackAlert] = useState("");

  /* #region Modal tobacco variables */
  const [modalVisible, setModalVisible] = useState(false);
  const [brand, setBrand] = useState("");
  const [flavour, setFlavour] = useState("");
  const [percentage, setPercentage] = useState("");
  const [brandToAdd, setBrandToAdd] = useState("");
  const [brandsList, setBrandsList] = useState(
    brandList.map((brand) => ({ label: brand, value: brand }))
  );
  const [flavourToAdd, setFlavourToAdd] = useState("");
  const [flavoursList, setFlavoursList] = useState([]);
  let brandController;
  let flavourController;
  /* #endregion */

  /* #region Rating variables */
  const [strength, setStrength] = useState(-1);
  const [taste, setTaste] = useState(0);
  const [clouds, setClouds] = useState(0);
  const [bowlUsed, setBowlUsed] = useState("");
  const [seshLength, setSeshLength] = useState("");
  /* #endregion */

  /* #region Pie chart data variables */
  const [pieData, setPieData] = useState([]);
  const [colourArray, setColourArray] = useState([]);
  const [openTobacco, setOpenTobacco] = useState(null);
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
  const [imageUri, setImageUri] = useState("");

  const [usedIDs, setUsedIDs] = useState([]);
  function addTobacco() {
    let id = openTobacco == null ? "" : openTobacco.key;
    if (id === "") {
      do {
        id = Math.random().toString(36).substring(2, 15);
      } while (usedIDs.indexOf(id) > -1);
      setUsedIDs((prevIDs) => [...prevIDs, id]);
    }

    const tobaccoToAdd = {
      brand: brand,
      flavour: flavour,
      value: parseInt(percentage),
      svg: {
        fill: openTobacco == null ? randomPastelColour() : openTobacco.svg.fill,
        onPress: () => {
          setBrand(brand);
          setFlavoursList(tobaccoList[brand]);
          setFlavour(flavour);
          setPercentage(percentage);
          setOpenTobacco(tobaccoToAdd);
          setModalVisible(true);
        },
      },
      key: id,
    };

    removeTobacco(openTobacco);
    setPieData((prevData) => [...prevData, tobaccoToAdd]);
    Close();
  }

  function removeTobacco(toRemove) {
    let newList = [...pieData];
    let index = newList.indexOf(toRemove);
    if (index !== -1) {
      newList.splice(index, 1);
      setPieData(newList);
    }
  }

  function everythingSet(totalSum) {
    if (totalSum == 0) {
      setSnackAlert("Please select at least one tobacco for the review");
      return false;
    } else if (totalSum > 100) {
      setSnackAlert(
        "Total sum of tobacco quantity cannot be over 100%. Current sum: " +
          totalSum
      );
      return false;
    } else if (bowlUsed === "") {
      setSnackAlert("Please select a bowl");
      return false;
    } else if (seshLength === "") {
      setSnackAlert("Please select how long the session lasted");
      return false;
    } else if (strength === -1) {
      setSnackAlert("Please rate the strength felt");
      return false;
    } else if (taste === 0) {
      setSnackAlert("Please rate the taste");
      return false;
    } else if (clouds === 0) {
      setSnackAlert("Please rate the clouds produced");
      return false;
    }

    return true;
  }

  function randomPastelColour() {
    let hue = Math.floor(Math.random() * numberOfChartColours);
    while (
      colourArray.includes(hue) &&
      colourArray.length < numberOfChartColours
    ) {
      hue = Math.floor(Math.random() * numberOfChartColours);
    }
    setColourArray((prevColours) => [...prevColours, hue]);
    return `hsl(${hue * (360 / numberOfChartColours)}, 70%, 80%)`;
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

  function Reset() {
    setUsedIDs([]);
    setColourArray([]);
    setPieData([]);
    setImageUri("");
    setStrength(-1);
    setTaste(0);
    setClouds(0);
    setBowlUsed("");
    setSeshLength("");
  }

  function Next() {
    let totalSum = 0;
    const tobaccoList = pieData.map((tobacco) => {
      totalSum += tobacco.value;
      return {
        brand: tobacco.brand,
        flavour: tobacco.flavour,
        key: tobacco.key,
        percentage: tobacco.value,
        colour: tobacco.svg.fill,
      };
    });

    if (!everythingSet(totalSum)) return;

    const post = {
      bowlUsed: bowlUsed,
      clouds: clouds,
      imageUrl: imageUri,
      sessionLength: seshLength,
      strength: strength,
      taste: taste,
      tobaccos: tobaccoList,
      userUid: userID,
    };

    navigation.navigate("PostSecondScreen", { post, Reset });
  }

  function Close() {
    setModalVisible(false);
    setBrand("");
    setFlavour("");
    setPercentage("");
    setFlavoursList([]);
    setOpenTobacco(null);
  }

  function toggleSnack() {
    setSnackAlert("");
  }

  function checkValid() {
    let add = true;
    if (!brand.trim() || !flavour.trim() || !percentage.trim()) {
      add = false;
    } else if (percentage.match(/[^0-9]/g) !== null) {
      alert("Percentage can only contain digits");
      add = false;
    } else if (parseInt(percentage) > 100) {
      alert("Percentage cannot be over 100%");
      add = false;
    } else if (parseInt(percentage) <= 0) {
      alert("Percentage cannot be negative or 0%");
      add = false;
    }

    if (add) {
      addTobacco();
    } else return;
  }

  function addBrandToList() {
    console.log("New Brand: " + brandToAdd);
    setBrandsList((prev) => [
      { label: brandToAdd, value: brandToAdd },
      ...prev,
    ]);
    setBrand(brandToAdd);
    brandController.close();
  }

  function addFlavourTolist() {
    console.log("New Flavour: " + flavourToAdd);
    setFlavoursList((prev) => [
      { label: flavourToAdd, value: flavourToAdd },
      ...prev,
    ]);
    setFlavour(flavourToAdd);
    flavourController.close();
  }

  function maxSlider() {
    let totalSum = 0;
    if (pieData.length > 0) {
      pieData.forEach((tob) => {
        if (tob !== openTobacco) {
          totalSum += tob.value;
        }
      });
    }
    return 100 - totalSum;
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
        <Left style={{ flex: 1 }}>
          {(pieData.length > 0 ||
            imageUri !== "" ||
            strength != -1 ||
            taste != 0 ||
            clouds != 0 ||
            bowlUsed !== "" ||
            seshLength !== "") && (
            <TouchableOpacity
              onPress={Reset}
              style={{
                width: hp(6),
                height: hp(5),
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons
                name="close"
                size={device === "phone" ? hp(4) : 36}
                color={colors.white}
              />
            </TouchableOpacity>
          )}
        </Left>
        <Body style={{ flex: 1 }}>
          <Text style={styles.header}>Review</Text>
        </Body>
        <Right style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={Next}
            style={{
              width: hp(6),
              height: hp(5),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {Platform.OS === "ios" ? (
              <Text style={{ color: colors.pink, fontSize: 18 }}>Next</Text>
            ) : (
              <MaterialIcons
                name="arrow-forward"
                size={device === "phone" ? hp(4) : 36}
                color={colors.pink}
              />
            )}
          </TouchableOpacity>
        </Right>
      </Header>
      <View
        style={{
          ...styles.chartArea,
          justifyContent: pieData.length == 0 ? "center" : "flex-start",
        }}
      >
        {pieData.length == 0 && (
          <View
            style={{
              position: "absolute",
              alignItems: "center",
              top: hp(21),
              end: wp(3),
            }}
          >
            <Text
              style={{
                color: colors.white,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Add tobaccos
            </Text>
            {/* <Feather name="chevrons-down" size={hp(4)} color={colors.white} /> */}
          </View>
        )}
        {pieData.length > 0 && (
          <PieChart
            style={{
              height: hp(28),
              backgroundColor: colors.background_transparent,
              width: wp(100),
            }}
            data={pieData}
            innerRadius={wp(5)}
            outerRadius={wp(13)}
            labelRadius={wp(17)}
            startAngle={pieData.length == 1 ? -2 : 0}
            endAngle={pieData.length == 1 ? Math.PI * 2 - 2 : Math.PI * 2}
          >
            <Labels />
          </PieChart>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: -25,
        }}
      >
        {imageUri === "" && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginEnd: wp(3),
            }}
          >
            <AwesomeButton
              style={{ marginEnd: wp(3) }}
              onPress={async () => {
                const result = await pickImage();
                if (result !== null && !result.cancelled)
                  setImageUri(result.uri);
              }}
              width={50}
              height={50}
              borderRadius={hp(100)}
              borderWidth={1}
              borderColor={colors.pink}
              backgroundColor={colors.background}
              backgroundDarker={colors.background}
              raiseLevel={3}
            >
              <Ionicons name="images-outline" size={24} color={colors.pink} />
            </AwesomeButton>
            <AwesomeButton
              onPress={async () => {
                const result = await takePicture();
                if (result !== null && !result.cancelled)
                  setImageUri(result.uri);
              }}
              width={50}
              borderRadius={hp(100)}
              borderWidth={1}
              borderColor={colors.pink}
              height={50}
              backgroundColor={colors.background}
              backgroundDarker={colors.background}
              raiseLevel={3}
            >
              <Ionicons name="camera-outline" size={24} color={colors.pink} />
            </AwesomeButton>
          </View>
        )}
        <AwesomeButton
          style={{ marginEnd: wp(3) + 25 }}
          onPress={() => {
            setModalVisible(true);
          }}
          width={50}
          borderRadius={hp(100)}
          borderWidth={1}
          borderColor={colors.pink}
          height={50}
          backgroundColor={colors.pink}
          backgroundDarker={colors.pink_darker}
          raiseLevel={3}
        >
          <MaterialIcons name="add" size={24} color={colors.background} />
        </AwesomeButton>
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
          <KeyboardAvoidingView behavior="position">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalView}>
                <Text
                  style={{
                    color: colors.pink,
                    fontSize: 18,
                    textAlign: "center",
                    marginBottom: hp(1),
                  }}
                >
                  Add Tobacco
                </Text>
                <DropDownPicker
                  defaultValue={brand !== "" ? brand : null}
                  controller={(instance) => (brandController = instance)}
                  items={brandsList}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.pink,
                  }}
                  containerStyle={{
                    height: hp(5.5),
                    width: wp(71),
                    marginBottom: hp(2),
                  }}
                  dropDownStyle={{
                    backgroundColor: colors.background,
                    borderColor: colors.pink,
                  }}
                  arrowColor={colors.pink}
                  itemStyle={{ justifyContent: "flex-start" }}
                  labelStyle={{ color: colors.pink, fontSize: 16 }}
                  searchableStyle={{ color: colors.white }}
                  placeholder="Brand"
                  onChangeItem={(item) => {
                    setBrand(item.value);
                    setFlavoursList(tobaccoList[item.value]);
                  }}
                  searchable
                  searchablePlaceholder="Search for a brand"
                  searchableError={() => (
                    <TouchableOpacity onPress={addBrandToList}>
                      <View>
                        <Text
                          style={{ color: colors.pink, fontWeight: "bold" }}
                        >
                          Add a new brand?
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  onSearch={setBrandToAdd}
                />

                <View
                  style={
                    Platform.OS !== "android" && {
                      zIndex: brandController?.isOpen() ? -1 : 999,
                    }
                  }
                >
                  <DropDownPicker
                    defaultValue={null}
                    controller={(instance) => (flavourController = instance)}
                    items={flavoursList}
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.pink,
                    }}
                    containerStyle={{
                      height: hp(5.5),
                      width: wp(71),
                      marginBottom: hp(2),
                    }}
                    dropDownStyle={{
                      backgroundColor: colors.background,
                      borderColor: colors.pink,
                    }}
                    arrowColor={colors.pink}
                    itemStyle={{ justifyContent: "flex-start" }}
                    labelStyle={{ color: colors.pink, fontSize: 16 }}
                    searchableStyle={{ color: colors.white }}
                    placeholder={flavour !== "" ? flavour : "Flavour"}
                    onChangeItem={(item) => setFlavour(item.value)}
                    searchable
                    searchablePlaceholder="Search for a flavour"
                    searchableError={() => (
                      <TouchableOpacity onPress={addFlavourTolist}>
                        <View>
                          <Text
                            style={{ color: colors.pink, fontWeight: "bold" }}
                          >
                            Add a new flavour?
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )}
                    onSearch={setFlavourToAdd}
                  />
                </View>

                <View
                  style={{
                    width: wp(70),
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: colors.pink,
                    marginBottom: hp(1),
                  }}
                >
                  <Text
                    style={{
                      color: colors.pink,
                      fontSize: 15,
                      fontWeight: "bold",
                      textAlign: "center",
                      marginVertical: hp(1),
                    }}
                  >
                    {percentage == 0 ? "Amount" : `${percentage}%`}
                  </Text>
                  <Slider
                    style={{ marginBottom: hp(1), marginHorizontal: wp(2) }}
                    minimumValue={1}
                    maximumValue={maxSlider()}
                    minimumTrackTintColor={colors.pink}
                    maximumTrackTintColor={colors.pink_darker}
                    thumbTintColor={colors.white}
                    step={1}
                    value={openTobacco == null ? 50 : openTobacco.value}
                    onValueChange={(val) => setPercentage(val.toString())}
                    onSlidingStart={(val) => setPercentage(val.toString())}
                    onSlidingComplete={(value) => {
                      console.log("Percentage: " + value);
                    }}
                  />
                </View>

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
                    onPress={checkValid}
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
                    <Text style={{ color: colors.background }}>
                      {openTobacco == null ? "Add" : "Update"}
                    </Text>
                  </AwesomeButton>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </PaperModal>
      </Portal>
      <FlatList
        data={pieData}
        renderItem={({ item }) => (
          <List.Item
            style={{ marginEnd: wp(5), marginStart: wp(2) }}
            title={item.flavour}
            titleStyle={{ color: colors.white }}
            description={item.brand}
            descriptionStyle={{ color: colors.grey }}
            onPress={() => {
              setBrand(item.brand);
              setFlavour(item.flavour);
              setPercentage(item.value.toString());
              setOpenTobacco(item);
              setModalVisible(true);
            }}
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
            right={() => (
              <TouchableOpacity
                style={{ marginTop: hp(2) }}
                onPress={() => {
                  removeTobacco(item);
                }}
              >
                <Feather name="delete" size={hp(3.5)} color={item.svg.fill} />
              </TouchableOpacity>
            )}
          />
        )}
        ListHeaderComponent={
          <View>
            {pieData.length != 0 && (
              <Text style={{ ...styles.h2, marginTop: hp(1) }}>Tobaccos</Text>
            )}
          </View>
        }
        ListFooterComponent={
          <View
            style={{
              marginHorizontal: wp(5),
            }}
          >
            {imageUri !== "" && (
              <Image source={{ uri: imageUri }} style={styles.image} />
            )}
            {imageUri !== "" && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: -wp(6),
                  marginEnd: wp(5),
                }}
              >
                <AwesomeButton
                  style={{ marginEnd: wp(3) }}
                  onPress={async () => {
                    const result = await pickImage();
                    if (result !== null && !result.cancelled)
                      setImageUri(result.uri);
                  }}
                  width={wp(12)}
                  borderRadius={hp(100)}
                  borderWidth={1}
                  borderColor={colors.pink}
                  height={wp(12)}
                  backgroundColor={colors.background}
                  backgroundDarker={colors.background}
                  raiseLevel={3}
                >
                  <Ionicons
                    name="images-outline"
                    size={24}
                    color={colors.pink}
                  />
                </AwesomeButton>
                <AwesomeButton
                  onPress={async () => {
                    const result = await takePicture();
                    if (result !== null && !result.cancelled)
                      setImageUri(result.uri);
                  }}
                  width={wp(12)}
                  borderRadius={hp(100)}
                  borderWidth={1}
                  borderColor={colors.pink}
                  height={wp(12)}
                  backgroundColor={colors.background}
                  backgroundDarker={colors.background}
                  raiseLevel={3}
                >
                  <Ionicons
                    name="camera-outline"
                    size={24}
                    color={colors.pink}
                  />
                </AwesomeButton>
              </View>
            )}
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
                {strength < 6 ? (
                  <Entypo name="feather" size={hp(3)} color={colors.pink} />
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
                value={5}
                onValueChange={setStrength}
                onSlidingStart={setStrength}
                onSlidingComplete={(value) => {
                  console.log("Strength: " + value);
                }}
              />
            </View>

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
                value={5}
                onValueChange={setTaste}
                onSlidingStart={setTaste}
                onSlidingComplete={(value) => {
                  console.log("Flavour: " + value);
                }}
              />
            </View>

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
                  {clouds == 0 ? "Select cloud output" : `Clouds: ${clouds}`}
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
                value={5}
                onValueChange={setClouds}
                onSlidingStart={setClouds}
                onSlidingComplete={(value) => {
                  console.log("Clouds: " + value);
                }}
              />
            </View>

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
                    <Text style={{ color: colors.pink, fontWeight: "bold" }}>
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
                    <Text style={{ color: colors.pink, fontWeight: "bold" }}>
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
          </View>
        }
      />
      <Snackbar
        visible={snackAlert !== ""}
        onDismiss={toggleSnack}
        duration={2000}
        style={{ backgroundColor: colors.background_transparent }}
      >
        {snackAlert}
      </Snackbar>
    </Container>
  );
};

const PostSecondScreen = ({
  navigation,
  route: {
    params: { post, Reset },
  },
}) => {
  const [pieData, setPieData] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loadingView, setLoadingView] = useState(false);
  const [snackAlert, setSnackAlert] = useState("");
  let posted = false;

  useEffect(() => {
    const timeout = setTimeout(() => Posted(true), 5000);
    return () => clearTimeout(timeout);
  }, [loadingView]);

  function Posted(timedOut) {
    if (loadingView && !posted) {
      Reset();
      setLoadingView(false);
      posted = true;
      if (timedOut) setSnackAlert("Unstable connection. Review upload delayed");
      setComment("");
      setPieData([]);
      navigation.goBack();
      nav.navigate("Feed");
    }
  }

  useEffect(() => {
    const data = post.tobaccos.map((tobacco) => ({
      brand: tobacco.brand,
      flavour: tobacco.flavour,
      value: tobacco.percentage,
      svg: { fill: tobacco.colour, onPress: null },
      key: tobacco.key,
    }));
    setPieData(data);
    setRating(Math.trunc((post.taste + post.clouds) / 2));
  }, []);

  function GoBack() {
    navigation.goBack();
  }

  function toggleSnack() {
    setSnackAlert("");
  }

  function recursiveRemoval(callCount, tobaccos, tags) {
    if (callCount == 0) return tags;
    for (let i = 0; i < tobaccos.length; i++) {
      let nTobaccos = [...tobaccos];
      nTobaccos.splice(i, 1);
      tags = recursiveRemoval(callCount - 1, nTobaccos, tags);
      let toAdd = nTobaccos.join();
      if (!tags.includes(toAdd)) tags = [...tags, toAdd];
    }
    return tags;
  }

  function createTags(tobaccos) {
    if (tobaccos.length == 1) return tobaccos;
    tobaccos.sort();
    // Each tobacco
    let tags = tobaccos;
    // All tobaccos
    tags = [...tags, tobaccos.join()];
    // *** Tobacco combinations ***
    tags = recursiveRemoval(tobaccos.length - 2, tobaccos, tags);
    return tags.sort();
  }

  function SubmitPost() {
    setLoadingView(true);
    const userRef = db.collection("users").doc(post.userUid);
    const postRef = userRef.collection("posts").doc();
    const flavours = createTags(
      post.tobaccos.map((tob) => tob.brand + tob.flavour)
    );

    post = {
      ...post,
      comment: comment,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      id: postRef.id,
      overallRating: rating,
      flavours,
      likedBy: [],
      likeCount: 0,
    };

    uploadImage(post.userUid, post.imageUrl, "post", post.id)
      .then((imageUrl) => {
        post.imageUrl = imageUrl;
        return postRef.set(post);
      })
      .then(() => {
        return userRef.update({
          postCount: firebase.firestore.FieldValue.increment(1),
        });
      })
      .then(() => console.log("Post saved"))
      .catch((err) => {
        console.log(err);
        alert(
          "Unsuccessful",
          "Post was not published. Check your internet connection and try again."
        );
      })
      .finally(() => Posted(false));
  }

  return (
    <Container style={styles.background}>
      <Portal>
        <PaperModal
          contentContainerStyle={styles.centeredView}
          visible={loadingView}
        >
          <StatusBar
            translucent
            backgroundColor="#1C1C1C"
            barStyle="light-content"
          />
          <Indicator />
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
                    width: hp(5),
                    height: hp(5),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons
                    name={
                      Platform.OS === "ios" ? "arrow-back-ios" : "arrow-back"
                    }
                    size={hp(3)}
                    color={colors.white}
                    style={{ marginStart: Platform.OS === "ios" ? wp(2) : 0 }}
                  />
                </TouchableOpacity>
              </Left>
              <Body style={{ flex: 1 }}>
                <Text style={styles.header}>Review</Text>
              </Body>
              <Right style={{ flex: 1 }}>
                <TouchableOpacity
                  onPress={SubmitPost}
                  style={{
                    width: hp(6),
                    height: hp(5),
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {Platform.OS === "ios" ? (
                    <Text style={{ color: colors.pink, fontSize: 18 }}>
                      Share
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
            <ImageBackground
              source={{ uri: post.imageUrl }}
              style={{
                width: wp(100),
                height: wp(75),
                backgroundColor:
                  post.imageUrl === ""
                    ? colors.background_transparent
                    : colors.background,
              }}
              imageStyle={{ opacity: 0.5 }}
              blurRadius={Platform.OS === "ios" ? 15 : 3}
            >
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
            </ImageBackground>
            <TextInputPaper
              keyboardType={Platform.OS === "ios" ? "twitter" : "default"}
              keyboardAppearance="dark"
              placeholder="Write a caption..."
              placeholderTextColor={colors.grey}
              multiline
              value={comment}
              onChangeText={setComment}
              maxLength={400}
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
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View
        style={{
          marginTop: hp(3),
          width: wp(90),
          marginHorizontal: wp(5),
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
          <MaterialIcons
            name={rating < 6 ? "star-outline" : "star"}
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
            {rating == 0 ? "Overall rating" : `Rating: ${rating}`}
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
          value={rating}
          onValueChange={setRating}
          onSlidingStart={setRating}
          onSlidingComplete={(value) => {
            console.log("Rating: " + value);
          }}
        />
      </View>
      <Snackbar
        visible={snackAlert !== ""}
        onDismiss={toggleSnack}
        duration={2000}
        style={{ backgroundColor: colors.background_transparent }}
      >
        {snackAlert}
      </Snackbar>
    </Container>
  );
};

export default function PostPage({ navigation }) {
  const Stack = createStackNavigator();
  useEffect(() => {
    nav = navigation;
  }, []);
  return (
    <Stack.Navigator
      initialRouteName="PostFirstScreen"
      screenOptions={navigatorOptions}
    >
      <Stack.Screen name="PostFirstScreen" component={PostFirstScreen} />
      <Stack.Screen name="PostSecondScreen" component={PostSecondScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
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

  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    color: colors.white,
    fontSize: 26,
    alignSelf: "center",
  },
  chartArea: {
    backgroundColor: colors.background_transparent,
    flexDirection: "row",
    alignItems: "center",
    height: hp(28),
  },
  h2: {
    color: colors.white,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: hp(1.3),
  },
  h3: {
    color: colors.white,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  textAndXContainer: {
    flexDirection: "row",
    marginVertical: hp(0.7),
    alignItems: "center",
    justifyContent: "space-between",
    marginStart: wp(5),
    marginEnd: wp(5),
    paddingEnd: wp(2.5),
    height: hp(5),
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
  modalButton: {
    backgroundColor: colors.pink,
    borderRadius: 20,
    paddingVertical: hp(1.4),
    paddingHorizontal: wp(5),
    elevation: 2,
    marginTop: hp(1.4),
    marginHorizontal: wp(1.25),
  },
  hintText: {
    color: colors.white,
    fontSize: 10,
    paddingTop: hp(0.7),
    alignSelf: "flex-start",
  },
  textInput: {
    color: colors.pink,
    paddingStart: wp(5),
    height: hp(6.3),
    flex: 1,
    marginStart: hp(-1.5),
  },
  container: {
    width: wp(71),
    height: hp(4.9),
    flexDirection: "row",
    alignItems: "center",
  },
  penContainer: {
    marginEnd: wp(-0.5),
  },

  dropDownButton: {
    backgroundColor: colors.background,
    width: wp(30),
    height: hp(4),
    borderWidth: 1,
    borderRadius: 2,
    borderColor: colors.white,
    justifyContent: "flex-end",
    flexDirection: "row",
    alignItems: "center",
  },
  dropDownText: {
    color: colors.white,
    paddingHorizontal: wp(3.1),
    fontSize: 13,
  },
  dropDownMenu: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.white,
    height: hp(15),
    width: wp(40),
    marginTop: -58,
    marginEnd: -1,
    flexDirection: "row",
  },
  dropDownMenuText: {
    backgroundColor: colors.background,
    color: colors.white,
    textAlign: "right",
  },
  commentContainer: {
    height: hp(14),
  },
  commentText: {
    color: colors.pink,
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.35),
    height: hp(14),
    textAlignVertical: "top",
    fontSize: 12,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: colors.white,
    backgroundColor: colors.background,
  },
  submitText: {
    color: colors.background,
    alignSelf: "center",
    paddingTop: Platform.OS === "android" ? 5 : 11,
    fontSize: 15,
  },
  image: {
    width: wp(100),
    height: wp(75),
    marginTop: hp(1),
    marginHorizontal: -wp(5),
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
