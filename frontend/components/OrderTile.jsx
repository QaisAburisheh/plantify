import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { COLORS, SIZES, SHADOWS } from "../constants";
const OrderTile = ({ item }) => {
  return (
    <TouchableOpacity style={styles.favContainer(COLORS.secondary)}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      </View>
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.productTxt}>
          {item.productId.title}
        </Text>
        <Text numberOfLines={1} style={styles.supplier}>
          {item.productId.supplier}
        </Text>
        <Text numberOfLines={1} style={styles.supplier}>
          {item.productId.price}
        </Text>
      </View>
      <View
        style={{
          paddingBottom: 20,
          paddingLeft: 30,
          backgroundColor: COLORS.lightWhite,
          borderRadius: 12,
        }}
      >
        <Text> {item.payment_status} </Text>
      </View>
    </TouchableOpacity>
  );
};

export default OrderTile;

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
  favContainer: (color) => ({
    flex: 1,
    justifyContent: "flex-start",
    flexDirection: "row",
    marginBottom: SIZES.xSmall,
    padding: SIZES.medium,
    backgroundColor: color,
    ...SHADOWS.medium,
    shadowColor: COLORS.secondary,
  }),
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
  productTxt: {
    fontSize: SIZES.medium,
    fontFamily: "bold",
    color: COLORS.primary,
  },
  supplier: {
    fontSize: SIZES.small + 2,
    fontFamily: "regular",
    color: COLORS.gray,
    marginTop: 3,
    textTransform: "capitalize",
  },
});
