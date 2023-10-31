import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants";
import addToCart from "../hook/addToCart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WebView from "react-native-webview";

const ProductDetails = ({ navigation }) => {
  const route = useRoute();
  const { item } = route.params;
  const [count, setCount] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [favorites, setFavorites] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(false);

  useEffect(() => {
    checkUser();
    checkFavorites();
  }, []);

  const checkUser = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      if (id !== null) {
        setIsLoggedIn(true);
        console.log("User logged in");
      } else {
        setIsLoggedIn(false);
        console.log("User not logged in");
      }
    } catch (error) {
      console.error("Error checking user:", error);
    }
  };

  const createCheckOut = async () => {
    const id = await AsyncStorage.getItem("id");

    const response = await fetch(
      "https://stripe-production-850c.up.railway.app/stripe/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: JSON.parse(id),
          cartItems: [
            {
              name: item.title,
              id: item._id,
              cartQuantity: count,
              price: item.price,
            },
          ],
        }),
      }
    );
    const { url } = await response.json();
    setPaymentUrl(url);
  };

  const onNavigationStateChange = (webViewState) => {
    const { url } = webViewState;

    if (url && url.includes("checkout-success")) {
      navigation.navigate("Orders");
    } else if (url && url.includes("cancel")) {
      navigation.goBack();
    }
  };

  const handleBuy = () => {
    if (isLoggedIn === false) {
      navigation.navigate("Login");
    } else {
      createCheckOut();
    }
  };

  const handleCart = () => {
    if (isLoggedIn === false) {
      navigation.navigate("Login");
    } else {
      addToCart(item._id, count);
      console.log(item);
      alert(`${item.title} added to cart`);
    }
  };

  const addToFavorites = async () => {
    const id = await AsyncStorage.getItem("id");
    const favoritesId = `favorites${JSON.parse(id)}`;

    let productId = item._id;
    let productObj = {
      title: item.title,
      id: item._id,
      supplier: item.supplier,
      price: item.price,
      imageUrl: item.imageUrl,
      product_location: item.product_location,
    };

    try {
      const existingItem = await AsyncStorage.getItem(favoritesId);
      let favoritesObj = existingItem ? JSON.parse(existingItem) : {};

      if (favoritesObj[productId]) {
        delete favoritesObj[productId];
        setFavorites(false);
      } else {
        favoritesObj[productId] = productObj;
        setFavorites(true);
      }
      await AsyncStorage.setItem(favoritesId, JSON.stringify(favoritesObj));
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  const handlePress = () => {
    if (isLoggedIn === false) {
      navigation.navigate("Login");
    } else {
      addToFavorites();
    }
  };

  const checkFavorites = async () => {
    const id = await AsyncStorage.getItem("id");
    const favoritesId = `favorites${JSON.parse(id)}`;

    try {
      const favoritesObj = await AsyncStorage.getItem(favoritesId);
      if (favoritesObj !== null) {
        const favorites = JSON.parse(favoritesObj);

        if (favorites[item._id]) {
          console.log(item._id);
          setFavorites(true);
        }
      }
    } catch (error) {
      console.error("Error checking favorites:", error);
    }
  };

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    if (count > 1) setCount(count - 1);
  };

  return (
    <View style={styles.container}>
      {paymentUrl ? (
        <SafeAreaView style={{ backgroundColor: "white", flex: 1 }}>
          <WebView
            source={{ uri: paymentUrl }}
            onNavigationStateChange={onNavigationStateChange}
          />
        </SafeAreaView>
      ) : (
        <View style={styles.container}>
          <View style={styles.upperRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="chevron-back-circle"
                size={30}
                color={COLORS.red}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePress()}>
              <Ionicons
                name={favorites ? "heart" : "heart-outline"}
                size={30}
                color={COLORS.red}
              />
            </TouchableOpacity>
          </View>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <View style={styles.details}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.priceWrapper}>
                <Text style={styles.price}>$ {item.price}</Text>
              </View>
            </View>
            <View style={styles.ratingRow}>
              <View style={styles.rating}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <Ionicons key={index} name="star" size={24} color="gold" />
                ))}
                <Text style={styles.ratingText}>(4.9)</Text>
              </View>
              <View style={styles.rating}>
                <TouchableOpacity onPress={increment}>
                  <SimpleLineIcons name="plus" size={25} />
                </TouchableOpacity>
                <Text style={styles.ratingText}>{count}</Text>
                <TouchableOpacity onPress={decrement}>
                  <SimpleLineIcons name="minus" size={25} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.descriptionWrapper}>
              <Text style={styles.description}>Description</Text>
              <Text style={styles.descText}>{item.description}</Text>
            </View>
            {/* <View style={{ marginBottom: SIZES.small }}>
              <View style={styles.location}>
                <View style={{ flexDirection: "row" }}>
                  <Ionicons name="location-outline" size={20} />
                  <Text>{item.product_location}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <MaterialCommunityIcons
                    name="truck-delivery-outline"
                    size={20}
                  />
                  <Text>Free Delivery</Text>
                </View>
              </View>
            </View> */}
            <View style={styles.cartRow}>
              <TouchableOpacity
                onPress={() => handleCart()}
                style={styles.cartBtn}
              >
                <Fontisto
                  name="shopping-bag"
                  size={22}
                  color={COLORS.lightWhite}
                />
                <Text style={styles.cartTitle}>Add to Cart</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={() => handleCart()}
                style={styles.addCart}
              >
                <Fontisto
                  name="shopping-bag"
                  size={22}
                  color={COLORS.lightWhite}
                />
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  upperRow: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: SIZES.xxLarge,
    width: SIZES.width - 44,
    zIndex: 999,
  },
  image: {
    aspectRatio: 1,
    resizeMode: "cover",
  },
  details: {
    marginTop: -SIZES.large,
    backgroundColor: COLORS.lightWhite,
    width: SIZES.width,
    borderTopRightRadius: SIZES.medium,
    borderTopLeftRadius: SIZES.medium,
  },
  titleRow: {
    marginHorizontal: 20,
    paddingBottom: SIZES.small,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: SIZES.width - 44,
    top: 20,
  },
  ratingRow: {
    paddingBottom: SIZES.small,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: SIZES.width - 10,
    top: 5,
  },
  descriptionWrapper: {
    marginTop: SIZES.large * 2,
    marginHorizontal: SIZES.large,
  },
  descText: {
    fontFamily: "regular",
    fontSize: SIZES.small,
    textAlign: "justify",
    marginBottom: SIZES.large,
  },
  description: {
    fontFamily: "medium",
    fontSize: SIZES.large,
  },
  rating: {
    top: SIZES.large,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: SIZES.large,
  },
  ratingText: {
    color: SIZES.gray,
    fontFamily: "medium",
    paddingHorizontal: SIZES.medium,
  },
  title: {
    fontFamily: "bold",
    fontSize: SIZES.medium,
  },
  priceWrapper: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.large,
  },
  location: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    padding: 5,
    borderRadius: SIZES.large,
    marginHorizontal: 12,
  },
  price: {
    paddingHorizontal: 6,
    fontFamily: "semibold",
    fontSize: SIZES.large,
  },
  // cartRow: {
  //   paddingHorizontal: SIZES.small,
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   width: SIZES.width,
  // },
  cartBtn: {
    flexDirection: "row",
    width: SIZES.width * 0.7,
    backgroundColor: COLORS.primary,
    padding: SIZES.small / 2,
    borderRadius: SIZES.large,
    marginLeft: 50,
    marginTop: 25,
    justifyContent: "center",
  },
  cartTitle: {
    marginLeft: SIZES.small,
    fontFamily: "semibold",
    fontSize: SIZES.medium,
    color: COLORS.lightWhite,
    marginLeft: SIZES.small,
  },
  addCart: {
    width: 37,
    height: 37,
    borderRadius: 50,
    margin: SIZES.small,
    backgroundColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProductDetails;
