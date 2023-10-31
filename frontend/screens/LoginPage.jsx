import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {IPV4} from '@env'


import BackBtn from "../components/BackBtn";
import { COLORS, SIZES } from "../constants";
import { Button } from "../components";
import AsyncStorage from "@react-native-async-storage/async-storage";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be 8 characters")
    .required("Required"),
  email: Yup.string().email("Provide an email address").required("Required"),
});

const LoginPage = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const [obsecureText, setObsecureText] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const inValidForm = () => {
    Alert.alert("Invalid Form", "Please provide all required fields", [
      { text: "Cancel", onPress: () => {} },
      { text: "Ok", onPress: () => {} },
    ]);
  };

  const login = async (values) => {
    setLoader(true);
    try {
      const endpoint = `http://${IPV4}:3000/api/login`;
      const data = values;
      const response = await axios.post(endpoint, data);

      if (response.status === 200) {
        setLoader(false);
        const responseData = response.data; // Assign response.data to a variable
        // setResponseData(response.data)
        await AsyncStorage.setItem(
          `user${responseData._id}`,
          JSON.stringify(responseData)
        );
        await AsyncStorage.setItem("id", JSON.stringify(responseData._id));
        await AsyncStorage.setItem("token", JSON.stringify(responseData.token));

        navigation.replace("Bottom Navigation");
      } else {
        // Check if the response status code indicates an error
        if (response.status === 401) {
          Alert.alert("Error logging in", "Please provide valid credentials", [
            { text: "Cancel", onPress: () => {} },
            { text: "Ok", onPress: () => {} },
          ]);
        } else {
          // Handle other status codes as needed
          // For example, you can display a different error message for other status codes
          Alert.alert("Error", "Oops, Something went wrong, please try again", [
            { text: "Cancel", onPress: () => {} },
            { text: "Ok", onPress: () => {} },
          ]);
        }
      }
    } catch (error) {
      // Handle network errors or other exceptions here
      console.error(error);
      Alert.alert("Error", "Oops, Error logging in, please try again", [
        { text: "Cancel", onPress: () => {} },
        { text: "Ok", onPress: () => {} },
      ]);
    } finally {
      setLoader(false);
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={{ marginHorizontal: 20 }}>
        <View>
          <BackBtn onPress={() => navigation.goBack()} />
          <Image
            source={require("../assets/images/Logo.png")}
            style={styles.cover}
          />
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => login(values)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              isValid,
              touched,
              setFieldTouched,
            }) => (
              <View>
                <View style={styles.wrapper}>
                  <Text style={styles.label}>Email:</Text>
                  <View
                    style={styles.inputWrapper(
                      touched.email ? COLORS.secondary : COLORS.offwhite
                    )}
                  >
                    <MaterialCommunityIcons
                      name="email-outline"
                      size={20}
                      color={COLORS.gray}
                      style={styles.iconStyle}
                    />
                    <TextInput
                      placeholder="Enter Email"
                      onFocus={() => setFieldTouched("email")}
                      onBlur={() => setFieldTouched("email", "")}
                      value={values.email}
                      onChangeText={handleChange("email")}
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={{ flex: 1 }}
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text style={styles.errorMessage}>{errors.email}</Text>
                  )}
                </View>

                <View style={styles.wrapper}>
                  <Text style={styles.label}>Password:</Text>
                  <View
                    style={styles.inputWrapper(
                      touched.password ? COLORS.secondary : COLORS.offwhite
                    )}
                  >
                    <MaterialCommunityIcons
                      name="lock-outline"
                      size={20}
                      color={COLORS.gray}
                      style={styles.iconStyle}
                    />
                    <TextInput
                      secureTextEntry={obsecureText}
                      placeholder="Password"
                      onFocus={() => setFieldTouched("password")}
                      onBlur={() => setFieldTouched("password", "")}
                      value={values.password}
                      onChangeText={handleChange("password")}
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={{ flex: 1 }}
                    />
                    <TouchableOpacity
                      onPress={() => setObsecureText(!obsecureText)}
                    >
                      <MaterialCommunityIcons
                        name={obsecureText ? "eye-outline" : "eye-off-outline"}
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text style={styles.errorMessage}>{errors.password}</Text>
                  )}
                </View>
                <Button
                  loader={loader}
                  title={"L O G I N"}
                  onPress={isValid ? handleSubmit : inValidForm}
                  isValid={isValid}
                />
                <Text style={{ textAlign: "center" }}>
                  Don't have an account?{" "}
                  <Text
                    style={styles.registration}
                    onPress={() => navigation.navigate("SignUp")}
                  >
                    Register
                  </Text>
                </Text>
              </View>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cover: {
    height: SIZES.height / 2.7,
    width: SIZES.width - 60,
    resizeMode: "contain",
    marginBottom: SIZES.xxLarge,
  },
  title: {
    fontFamily: "bold",
    fontSize: SIZES.large,
    color: COLORS.primary,
    marginBottom: SIZES.xxLarge,
  },
  wrapper: {
    marginTop: 20,
  },
  label: {
    fontFamily: "regular",
    fontSize: SIZES.medium,
    marginBottom: 5,
    marginEnd: 5,
    textAlign: "left",
  },
  inputWrapper: (borderColor) => ({
    borderColor: borderColor,
    backgroundColor: COLORS.lightWhite,
    borderWidth: 1,
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
  }),
  iconStyle: {
    marginRight: 10,
  },
  errorMessage: {
    color: COLORS.red,
    fontFamily: "regular",
    marginTop: 5,
    marginLeft: 5,
    fontSize: SIZES.xSmall,
  },
  registration: {
    marginTop: 20,
    fontSize: 18,
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
});

export default LoginPage;
