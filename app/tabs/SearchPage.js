import * as React from "react";
import { useState, useEffect } from "react";
import colors from "../config/colours";
import { db } from "../config/firebase";
import {
  Text,
  StatusBar,
  StyleSheet,
  FlatList,
  Platform,
  View,
  Animated,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import algoliasearch from "algoliasearch";
import {
  InstantSearch,
  connectInfiniteHits,
  connectSearchBox,
} from "react-instantsearch-dom";
import UserSelector from "../components/UserSelector";
import {
  Searchbar,
  List,
  Modal as PaperModal,
  Portal,
} from "react-native-paper";
import VisitedUser from "../components/VisitedUser";
import VisitedPost from "../components/VisitedPost";
import AwesomeButton from "@umangmaurya/react-native-really-awesome-button";
import DropDownPicker from "react-native-dropdown-picker";
import { Indicator } from "../components/LoadingIndicator";
import { tobaccoList, brandList } from "../config/tobaccoList";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import ItemSelector from "../components/ItemSelector";

const searchClient = algoliasearch(
  "R7MIEAGGX6",
  "4d66998e9edee53af3de2817e0ec3bdc"
);

const UserSearch = ({ navigation }) => {
  const SearchBox = (props) => {
    return (
      <Searchbar
        placeholder="Search for users"
        onChangeText={props.refine}
        style={{ backgroundColor: colors.background_transparent }}
        inputStyle={{ color: colors.pink }}
        placeholderTextColor={colors.grey}
        iconColor={colors.grey}
        autoCapitalize={"none"}
        autoCorrect={false}
        spellCheck={false}
        clearButtonMode={"always"}
      />
    );
  };

  const ConnectedSearchBox = connectSearchBox(SearchBox);

  const ConnectedHits = connectInfiniteHits(({ hits, hasMore, refineNext }) => (
    <FlatList
      data={hits}
      keyExtractor={(item) => item.objectID}
      onEndReached={() => hasMore && refineNext()}
      renderItem={({ item }) => <UserSelector user={item} nav={navigation} />}
    />
  ));

  return (
    <View style={styles.background}>
      <InstantSearch searchClient={searchClient} indexName="user_search">
        <ConnectedSearchBox />
        <ConnectedHits />
      </InstantSearch>
    </View>
  );
};

const MixSearch = ({ navigation }) => {
  /* #region Modal tobacco variables */
  const [modalVisible, setModalVisible] = useState(false);
  const [isFlavourOpen, setFlavourOpen] = useState(false);
  const [brand, setBrand] = useState("");
  const [flavour, setFlavour] = useState("");
  const [brandToAdd, setBrandToAdd] = useState("");
  const [brandsList, setBrandsList] = useState(
    brandList.map((brand) => ({ label: brand, value: brand }))
  );
  const [flavourToAdd, setFlavourToAdd] = useState("");
  const [flavoursList, setFlavoursList] = useState([]);
  let brandController;
  let flavourController;
  /* #endregion */

  const limit = 9;
  const [searchList, setSearchList] = useState([]);
  const [searchFilter, setSearchFilter] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [endOfList, setEndOfList] = useState(false);
  const [documentData, setDocumentData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);

  const Close = () => {
    setModalVisible(false);
    setBrand("");
    setFlavour("");
    setFlavoursList([]);
  };

  useEffect(() => {
    console.log("Search Filter: " + searchFilter);
    if (searchFilter.length > 0) {
      setDocumentData([]);
    }
  }, [searchFilter]);

  useEffect(() => {
    if (searchFilter.length > 0) {
      retrieveData();
    }
  }, [documentData]);

  const CheckAdd = () => {
    if (brand !== "" && flavour !== "") {
      if (!searchFilter.includes(brand + flavour)) {
        setSearchFilter((prev) => [...prev, brand + flavour]);
        setSearchList((prev) => [
          ...prev,
          { brand, flavour, key: prev.length.toString() },
        ]);
      }
      Close();
    } else return;
  };

  const removeFromSearch = (toRemove) => {
    let newList = [...searchList];
    let index = newList.indexOf(toRemove);
    if (index !== -1) {
      newList.splice(index, 1);
      setSearchList(newList);
    }

    newList = [...searchFilter];
    index = newList.indexOf(toRemove.brand + toRemove.flavour);
    if (index !== -1) {
      newList.splice(index, 1);
      setSearchFilter(newList);
    }
  };

  const retrieveData = async () => {
    if (refreshing) return;
    setRefreshing(true);
    console.log("Retrieving Data");
    db.collectionGroup("posts")
      .where("flavours", "array-contains", searchFilter.sort().join())
      .orderBy("created", "desc")
      .limit(limit)
      .get()
      .then((docSnaps) => {
        let docData = docSnaps.docs.map((document) => document.data());
        if (docData.length == 0) {
          setDocumentData([]);
          setLastVisible(null);
          setEndOfList(true);
          setRefreshing(false);
          return;
        }
        setDocumentData(docData);
        setEndOfList(docData.length < limit);
        setLastVisible(docData[docData.length - 1].created);
        setRefreshing(false);
      })
      .catch(console.log);
  };

  const retrieveMore = async () => {
    if (endOfList || refreshing) return;
    setRefreshing(true);
    console.log("Retrieving additional Data");
    db.collectionGroup("posts")
      .orderBy("created", "desc")
      .startAfter(lastVisible)
      .limit(limit)
      .get()
      .then((docSnaps) => {
        let docData = docSnaps.docs.map((document) => document.data());
        if (docData.length == 0) {
          setEndOfList(true);
          setRefreshing(false);
          return;
        }
        setDocumentData((prevData) => [...prevData, ...docData]);
        setEndOfList(docData.length < limit);
        setLastVisible(docData[docData.length - 1].created);
        setRefreshing(false);
      })
      .catch(console.log);
  };

  const addBrandToList = () => {
    console.log("New Brand: " + brandToAdd);
    setBrandsList((prev) => [
      { label: brandToAdd, value: brandToAdd },
      ...prev,
    ]);
    setBrand(brandToAdd);
    setFlavour("");
    brandController.close();
  };

  const addFlavourTolist = () => {
    console.log("New Flavour: " + flavourToAdd);
    setFlavoursList((prev) => [
      { label: flavourToAdd, value: flavourToAdd },
      ...prev,
    ]);
    setFlavour(flavourToAdd);
    flavourController.close();
  };

  const selectItem = (post) => {
    try {
      const { created, ...rest } = post;
      navigation.navigate("VisitedPost", { post: rest });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.background}>
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
                  Search Tobacco
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
                    setFlavour("");
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
                    onOpen={() => setFlavourOpen(true)}
                    onClose={() => setFlavourOpen(false)}
                    items={flavoursList}
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.pink,
                    }}
                    containerStyle={{
                      height: hp(5.5),
                      width: wp(71),
                      marginBottom:
                        Platform.OS === "ios"
                          ? hp(2)
                          : isFlavourOpen
                          ? hp(7)
                          : hp(2),
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
                    onPress={CheckAdd}
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
                    <Text style={{ color: colors.background }}>Add</Text>
                  </AwesomeButton>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </PaperModal>
      </Portal>

      <View style={{ alignItems: "center", marginTop: 5 }}>
        <AwesomeButton
          onPress={() => setModalVisible(true)}
          width={wp(90)}
          borderRadius={hp(100)}
          height={45}
          backgroundColor={colors.background}
          backgroundDarker={colors.pink_darker}
          borderWidth={1}
          borderColor={colors.pink}
          raiseLevel={3}
        >
          <Text
            style={{
              color: colors.pink,
              fontWeight: "bold",
              fontSize: 13,
            }}
          >
            {searchList.length == 0 ? "Search Tobacco" : "Add to search"}
          </Text>
        </AwesomeButton>
      </View>
      {searchList.length != 0 && (
        <Text style={{ ...styles.h2, marginTop: hp(1) }}>Tobaccos</Text>
      )}
      <View style={{ height: Math.min(hp(searchList.length * 8), hp(16)) }}>
        <FlatList
          data={searchList}
          renderItem={({ item }) => (
            <List.Item
              style={{ marginEnd: wp(5), marginStart: wp(2), width: wp(90) }}
              title={item.flavour}
              titleStyle={{ color: colors.white }}
              description={item.brand}
              descriptionStyle={{ color: colors.grey }}
              left={() => (
                <MaterialCommunityIcons
                  name="chart-arc"
                  size={hp(3)}
                  color={colors.pink}
                  style={{ alignSelf: "center" }}
                />
              )}
              right={() => (
                <TouchableOpacity
                  style={{ alignSelf: "center" }}
                  onPress={() => {
                    removeFromSearch(item);
                  }}
                >
                  <Feather name="delete" size={hp(3.5)} color={colors.pink} />
                </TouchableOpacity>
              )}
            />
          )}
        />
      </View>
      {documentData.length > 0 && (
        <FlatList
          style={{
            marginBottom: Platform.OS === "android" ? wp(12) + 50 : wp(12) + 60,
          }}
          data={documentData}
          renderItem={({ item }) => (
            <ItemSelector
              item={item}
              onPress={() => selectItem(item)}
              screen="feed"
            />
          )}
          keyExtractor={(_, index) => String(index)}
          ListFooterComponent={refreshing ? <ActivityIndicator /> : null}
          onEndReached={retrieveMore}
          onEndReachedThreshold={0}
          refreshing={refreshing}
        />
      )}
    </View>
  );
};

const SearchTab = () => {
  const Tab = createMaterialTopTabNavigator();

  const Tabs = () => {
    return (
      <View style={{ height: hp(100) }}>
        <Tab.Navigator
          tabBarOptions={{
            style: {
              backgroundColor: colors.background,
            },
            indicatorStyle: {
              backgroundColor: colors.pink,
            },
          }}
          initialRouteName="Users"
          backBehavior="none"
        >
          <Tab.Screen
            name="Users"
            component={UserSearch}
            options={{
              tabBarLabel: (props) => (
                <Text
                  style={{
                    ...styles.tabText,
                    color: props.focused ? colors.pink : colors.grey,
                  }}
                >
                  Users
                </Text>
              ),
            }}
          />
          <Tab.Screen
            name="Mixes"
            component={MixSearch}
            options={{
              tabBarLabel: (props) => (
                <Text
                  style={{
                    ...styles.tabText,
                    color: props.focused ? colors.pink : colors.grey,
                  }}
                >
                  Mixes
                </Text>
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    );
  };

  const Header = () => {
    return (
      <View
        style={{
          backgroundColor: colors.background,
          paddingTop:
            Platform.OS === "android" ? StatusBar.currentHeight + hp(1) : hp(4),
          alignItems: "center",
        }}
      >
        <Text style={styles.headerText}>Search</Text>
      </View>
    );
  };

  return (
    <View>
      {Header()}
      {Tabs()}
    </View>
  );
};

export default function SearchPage() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="SearchTab"
      screenOptions={navigatorOptions}
    >
      <Stack.Screen name="SearchTab" component={SearchTab} />
      <Stack.Screen name="VisitedUser" component={VisitedUser} />
      <Stack.Screen name="VisitedPost" component={VisitedPost} />
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
    color: colors.white,
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
    marginStart: wp(4),
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
  h2: {
    color: colors.white,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: hp(1.3),
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
