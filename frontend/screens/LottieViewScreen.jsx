import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React, { useEffect } from "react";
import GifImage from "@lowkey/react-native-gif";
import { COLORS } from "../constants";
import { useNavigation } from "@react-navigation/native";

const LottieViewScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Bottom Navigation");
    }, 4500);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centeredContent}>
        <GifImage
          source={require("../assets/animation.gif")}
          style={styles.gifImage}
        />
        <Text style={styles.text}>Your checkout was successful</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredContent: {
    alignItems: "center",
  },
  gifImage: {
    width: 150,
    height: 150,
  },
  text: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: "600",
    textAlign: "center",
    color: COLORS.primary,
  },
});

export default LottieViewScreen;
