import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Button,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import fetchCart from "../hook/fetchCart";
import { CartTile } from "../components";
import LottieView from "./LottieViewScreen";
import { COLORS, SIZES, SHADOWS } from "../constants";
import LottieViewScreen from "./LottieViewScreen";
import { useNavigation } from "@react-navigation/native";

const Cart = ({ navigation }) => {
  const navigationLottie = useNavigation();
  const { data, loading, error, refetch } = fetchCart();
  const [selected, setSelected] = useState([]);

  const isCheckoutEnabled = selected.length > 0;

  const handleDeleteItem = (itemId) => {
    setSelected((prevSelected) => prevSelected.filter((id) => id !== itemId));
    refetch();
  };

  const calculateTotalAmount = () => {
    let totalAmount = 0;

    for (const item of data) {
      if (selected.includes(item._id)) {
        totalAmount += item.cartItem.price * item.quantity;
      }
    }

    return totalAmount;
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
        <Text style={styles.titleText}>Cart</Text>
      </View>
      {loading ? (
        <ActivityIndicator />
      ) : error ? (
        <Text style={{ marginBottom: 10 }}>Your cart is empty</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <CartTile
              item={item}
              onPress={() => {
                const isSelected = selected.includes(item._id);
                setSelected((prevSelected) =>
                  isSelected
                    ? prevSelected.filter((id) => id !== item._id)
                    : [...prevSelected, item._id]
                );
              }}
              isSelected={selected.includes(item._id)}
              onDelete={() => handleDeleteItem(item._id)}
            />
          )}
        />
      )}

      <Button
        title="Checkout"
        disabled={!isCheckoutEnabled}
        onPress={() => {
          const totalAmount = calculateTotalAmount();
          Alert.alert("Checkout", `Total amount: $${totalAmount.toFixed(2)}`, [
            { text: "Cancel", onPress: () => navigation.navigate("Cart") },
            {
              text: "Proceed",
              onPress: () => navigationLottie.navigate("LottieViewScreen"),
            },
          ]);
          setSelected([]);
        }}
      />
    </SafeAreaView>
  );
};

export default Cart;

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
});
