import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SIZES } from "../constants";

const BackBtn = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Ionicons
        name="chevron-back-circle"
        size={30}
        color={COLORS.primary}
        style={styles.backBtn}
      />
    </TouchableOpacity>
  );
};

export default BackBtn;

const styles = StyleSheet.create({
  backBtn: {
    alignItems: "center",

    marginTop: 35,
  },
});
