import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SHADOWS, COLORS, SIZES } from "../constants";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";

const Favorites = ({ navigation }) => {
  const [favData, setFavData] = useState([]);
  useEffect(() => {
    checkFavorites();
  }, []);

  const checkFavorites = async () => {
    const id = await AsyncStorage.getItem("id");
    const favoritesId = `favorites${JSON.parse(id)}`;

    console.log(favoritesId);

    try {
      const favoritesObj = await AsyncStorage.getItem(favoritesId);
      if (favoritesObj !== null) {
        const favorites = JSON.parse(favoritesObj);
        const favList = Object.values(favorites);

        setFavData(favList);
        console.log(favList.length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteFavorites = async (product) => {
    const id = await AsyncStorage.getItem("id");
    const favoritesId = `favorites${JSON.parse(id)}`;

    let productId = product;

    try {
      const existingItem = await AsyncStorage.getItem(favoritesId);
      let favoritesObj = existingItem ? JSON.parse(existingItem) : {};

      if (favoritesObj[productId]) {
        delete favoritesObj[productId];

        checkFavorites();
      }
      await AsyncStorage.setItem(favoritesId, JSON.stringify(favoritesObj));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back-circle"
            size={30}
            color={COLORS.primary}
          />
        </TouchableOpacity>
        <Text style={styles.titleText}>Favorites</Text>
      </View>
      <FlatList
        data={favData}
        renderItem={({ item }) => (
          <View style={styles.favContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.image}
                onError={() => {
                  console.log("Image loading error:", item.imageUrl);
                }}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.fav}>{item.title}</Text>
              <Text style={styles.supplier}>{item.supplier}</Text>
              <Text style={styles.price}>$ {item.price}</Text>
            </View>

            <SimpleLineIcons
              onPress={() => deleteFavorites(item.id)}
              name="trash"
              size={24}
              color={COLORS.red}
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    marginTop: 45,
    marginHorizontal: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: SIZES.width - 50,
    marginBottom: 12,
  },
  titleText: {
    fontFamily: "bold",
    fontSize: SIZES.xLarge,
    letterSpacing: 4,
    marginLeft: SIZES.small,
  },
  favContainer: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: SIZES.xSmall,
    padding: SIZES.medium,
    backgroundColor: "#fff",
    ...SHADOWS.medium,
    shadowColor: COLORS.secondary,
  },
  imageContainer: {
    width: 70,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 65,
    borderRadius: SIZES.small,
    resizeMode: "cover",
  },
  textContainer: {
    flex: 1,
    marginHorizontal: SIZES.medium,
  },
  fav: {
    fontFamily: "bold",
    color: COLORS.primary,
    fontSize: SIZES.medium,
  },
  supplier: {
    fontFamily: "regular",
    color: COLORS.gray,
    fontSize: 14,
  },
});
