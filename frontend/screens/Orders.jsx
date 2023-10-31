import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES, SHADOWS } from "../constants";
import fetchOrders from "../hook/fetchOrders";
import { OrderTile } from "../components";
const Orders = ({ navigation }) => {
  const { data, loading, error, refetch } = fetchOrders();
  console.log(data);
  console.log(error);
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
        <Text style={styles.titleText}>Orders</Text>
      </View>
      {loading ? (
        <ActivityIndicator />
      ) : error ? (
        <Text>Error loading Orders data</Text>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            <OrderTile item={item} />;
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default Orders;

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
