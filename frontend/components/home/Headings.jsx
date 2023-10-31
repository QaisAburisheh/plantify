import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS,SIZES } from "../../constants";
import {useNavigation} from '@react-navigation/native'
const Headings = () => {
  const navigation =useNavigation()
  return (
<View style={styles.container}>
<View style={styles.header}>
<Text style={styles.headerTitle}>
New Rivals
</Text>
<TouchableOpacity onPress={()=>navigation.navigate("ProductList")}>
    <Ionicons name="ios-grid" size={24} color={COLORS.primary} />
</TouchableOpacity>
</View>
</View>
  );
};

export default Headings;

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.large,
    // marginBottom: -SIZES.xSmall,
    marginHorizontal: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle:{
    fontFamily:'semibold',
    fontSize:SIZES.xLarge-2,

  }
});

