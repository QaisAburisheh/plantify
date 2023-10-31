import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect, useId } from "react";
import { COLORS, SIZES } from "../constants";
import { StatusBar } from "expo-status-bar";
import { Colors } from "react-native/Libraries/NewAppScreen";
import {
  AntDesign,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [userLogin, setUserLogin] = useState(false);

  useEffect(() => {
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    const id = await AsyncStorage.getItem("id");
    const useId = `user${JSON.parse(id)}`;

    try {
      const currentUser = await AsyncStorage.getItem(useId);

      if (currentUser !== null) {
        const parsedData = JSON.parse(currentUser);
        setUserData(parsedData);
        setUserLogin(true);
      } else {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.log("Error retrieving the data:", error);
    }
  };

  const logout = () => {
    Alert.alert("Logout", "Are You Sure You Want To Logout", [
      { text: "Cancel", onPress: () => console.log("cancel pressed") },
      { text: "Yes", onPress: () => userLogout() },
    ]);
  };

  const userLogout = async () => {
    const id = await AsyncStorage.getItem("id");
    const useId = `user${JSON.parse(id)}`;
    try {
      // we dont use remove item cause we have multiple things to remove
      await AsyncStorage.multiRemove([useId, "id"]);
      navigation.replace("Bottom Navigation");
    } catch (error) {
      console.log("Error logging out the user", error);
    }
  };

  const cacheClear = async () => {
    const id = await AsyncStorage.getItem("id");
    const userId = `favorites${JSON.parse(id)}`;
    try {
      // we dont use remove item cause we have multiple things to remove
      await AsyncStorage.removeItem(userId);
      navigation.replace("Bottom Navigation");
    } catch (error) {
      console.log("Error logging out the user", error);
    }
  };

  const clearCache = () => {
    Alert.alert(
      "Clear Cache",
      "Are You Sure You Want To delete all saved data on your device",
      [
        { text: "Cancel", onPress: () => console.log("cancel clear cache") },
        { text: "Yes", onPress: () => cacheClear() },
      ]
    );
  };

  const deleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are You Sure You Want To Delete Your Account",
      [
        { text: "Cancel", onPress: () => console.log("cancel pressed") },
        { text: "Continue", onPress: () => console.log("Delete pressed") },
        { defaultIndex: 1 },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <StatusBar backgroundColor={COLORS.gray} />
        <View style={{ width: "100%" }}>
          <Image
            source={require("../assets/images/background-image.jpg")}
            style={styles.cover}
          />
        </View>
        <View style={styles.profileContainer}>
          <Image
            source={require("../assets/images/userDefault.png")}
            style={styles.profile}
          />
          <Text style={styles.name}>
            {userLogin === true ? (
              <Text> {userData.username} </Text>
            ) : (
              "Please login into your account"
            )}
          </Text>
          {userLogin === false ? (
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <View style={styles.loginBtn}>
                <Text style={styles.loginText}>Login</Text>
              </View>
            </TouchableOpacity>
          ) : (
            ""
          )}
          {userLogin === false ? (
            <View></View>
          ) : (
            <View style={styles.menuWrapper}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Favorites")}
              >
                <View style={styles.menuItem(0.2)}>
                  <MaterialCommunityIcons
                    name="heart-outline"
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text style={styles.menuText}>Favorites</Text>
                </View>
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => navigation.navigate("Orders")}>
                <View style={styles.menuItem(0.2)}>
                  <MaterialCommunityIcons
                    name="truck-delivery-outline"
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text style={styles.menuText}>Orders</Text>
                </View>
              </TouchableOpacity> */}
              <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
                <View style={styles.menuItem(0.2)}>
                  <SimpleLineIcons
                    name="bag"
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text style={styles.menuText}>Cart</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => clearCache()}>
                <View style={styles.menuItem(0.2)}>
                  <MaterialCommunityIcons
                    name="cached"
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text style={styles.menuText}>Clear cache</Text>
                </View>
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => deleteAccount()}>
                <View style={styles.menuItem(0.2)}>
                  <AntDesign
                    name="deleteuser"
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text style={styles.menuText}>Delete Account</Text>
                </View>
              </TouchableOpacity> */}
              <TouchableOpacity onPress={() => logout()}>
                <View style={styles.menuItem(0.2)}>
                  <AntDesign name="logout" size={24} color={COLORS.primary} />
                  <Text style={styles.menuText}>Logout</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightWhite },
  cover: {
    height: 290,
    width: "100%",
    resizeMode: "cover",
  },
  profileContainer: {
    flex: 1,
    alignItems: "center",
  },
  profile: {
    height: 155,
    width: 155,
    borderRadius: 999,
    borderColor: COLORS.primary,
    borderWidth: 2,
    resizeMode: "cover",
    marginTop: -90,
  },
  name: {
    fontFamily: "bold",
    color: COLORS.primary,
    marginVertical: 5,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    padding: 2,
    borderWidth: 0.4,
    borderColor: COLORS.primary,
    borderRadius: SIZES.xxLarge,
  },
  menuText: {
    fontFamily: "regular",
    color: COLORS.primary,
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 26,
    padding: 2,
    marginRight: 20,
  },
  loginText: {
    fontFamily: "regular",
    color: COLORS.white,
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 26,
    padding: 2,
    marginRight: 20,
  },
  menuWrapper: {
    marginTop: SIZES.xLarge,
    width: SIZES.width - SIZES.large,
    borderRadius: 12,
  },
  menuItem: (borderBottomWidth) => ({
    borderBottomWidth: borderBottomWidth,
    flexDirection: "row",
    paddingVertical: 25,
    paddingHorizontal: 30,
    borderColor: COLORS.gray,
  }),
});
