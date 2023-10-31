import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { COLORS } from "../../constants";
import axios from "axios";
import { IPV4 } from "@env";


const CartTile = ({ item, onPress, isSelected, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://${IPV4}:3000/api/cart/${item._id}`);
      onDelete(item._id);
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        justifyContent: "space-between",
        flexDirection: "row",
        marginBottom: 8,
        padding: 16,
        backgroundColor: isSelected ? COLORS.secondary : "#fff",
      }}
      onPress={onPress}
    >
      <View
        style={{
          width: 70,
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: item.cartItem.imageUrl }}
          style={{ width: "100%", height: 65, borderRadius: 4 }}
        />
      </View>
      <View style={{ flex: 1, marginLeft: 16 }}>
        <Text numberOfLines={1} style={{ fontSize: 16, fontWeight: "bold" }}>
          {item.cartItem.title}
        </Text>
        <Text numberOfLines={1} style={{ fontSize: 14 }}>
          {item.cartItem.supplier}
        </Text>
        <Text numberOfLines={1} style={{ fontSize: 14 }}>
          {item.cartItem.price} * {item.quantity}
        </Text>
      </View>
      <TouchableOpacity
        style={{ paddingBottom: 20, paddingLeft: 16 }}
        onPress={handleDelete}
      >
        <Text>
          {isDeleting ? (
            <ActivityIndicator size="small" color={COLORS.red} />
          ) : (
            <AntDesign name="delete" size={18} color={COLORS.red} />
          )}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default CartTile;
