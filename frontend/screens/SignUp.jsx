import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import BackBtn from "../components/BackBtn";
import { COLORS, SIZES } from "../constants";
import { Button } from "../components";
import { Formik } from "formik";
import * as Yup from "yup";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import {IPV4} from '@env'


const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be 8 characters")
    .required("Required"),
  retypePassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
  email: Yup.string().email("Provide a email address").required("Required"),
  location: Yup.string().min(3, "Provide a location").required("Required"),
  username: Yup.string().min(3, "Provide a username").required("Required"),
});
const SignUp = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const [obsecureText, setobsecureText] = useState(false);

  const inValidForm = () => {
    Alert.alert("InValid Form", "Please provide all required fields", [
      { text: "Cancel", onPress: () => {} },
      { text: "Ok", onPress: () => {} },
    ]);
  };

  const RegisterUser = async (values) => {
    setLoader(true);

    try {
      const endpoint = `http://${IPV4}:3000/api/register`;
      const data = values;
      const response = await axios.post(endpoint, data);
      if (response.status === 201) {
        // change this later
        navigation.replace("Login");
      }
    } catch (error) {
      console.log(error);
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
            initialValues={{
              email: "",
              password: "",
              location: "",
              username: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => RegisterUser(values)}
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
                  <Text style={styles.label}>Username:</Text>
                  <View
                    style={styles.inputWrapper(
                      touched.username ? COLORS.secondary : COLORS.offwhite
                    )}
                  >
                    <MaterialCommunityIcons
                      name="face-man-profile"
                      size={20}
                      color={COLORS.gray}
                      style={styles.iconStyle}
                    />
                    <TextInput
                      placeholder="Enter username"
                      onFocus={() => {
                        setFieldTouched("username");
                      }}
                      onBlur={() => setFieldTouched("username", "")}
                      value={values.username}
                      onChangeText={handleChange("username")}
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={{ flex: 1 }}
                    />
                  </View>
                  {touched.username && errors.username && (
                    <Text style={styles.errorMessage}>{errors.username}</Text>
                  )}
                </View>
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
                      onFocus={() => {
                        setFieldTouched("email");
                      }}
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
                  <Text style={styles.label}>Location:</Text>
                  <View
                    style={styles.inputWrapper(
                      touched.location ? COLORS.secondary : COLORS.offwhite
                    )}
                  >
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color={COLORS.gray}
                      style={styles.iconStyle}
                    />
                    <TextInput
                      placeholder="Enter location"
                      onFocus={() => {
                        setFieldTouched("location");
                      }}
                      onBlur={() => setFieldTouched("location", "")}
                      value={values.location}
                      onChangeText={handleChange("location")}
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={{ flex: 1 }}
                    />
                  </View>
                  {touched.location && errors.location && (
                    <Text style={styles.errorMessage}>{errors.location}</Text>
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
                      onFocus={() => {
                        setFieldTouched("password");
                      }}
                      onBlur={() => setFieldTouched("password", "")}
                      value={values.password}
                      onChangeText={handleChange("password")}
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={{ flex: 1 }}
                    />
                    <TouchableOpacity
                      onPress={() => setobsecureText(!obsecureText)}
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
                <View style={styles.wrapper}>
                  <Text style={styles.label}>Retype Password:</Text>
                  <View
                    style={styles.inputWrapper(
                      touched.retypePassword
                        ? COLORS.secondary
                        : COLORS.offwhite
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
                      placeholder="Retype Password"
                      onFocus={() => {
                        setFieldTouched("retypePassword");
                      }}
                      onBlur={() => setFieldTouched("retypePassword", "")}
                      value={values.retypePassword}
                      onChangeText={handleChange("retypePassword")}
                      autoCapitalize="none"
                      autoCorrect={false}
                      style={{ flex: 1 }}
                    />
                    <TouchableOpacity
                      onPress={() => setobsecureText(!obsecureText)}
                    >
                      <MaterialCommunityIcons
                        name={obsecureText ? "eye-outline" : "eye-off-outline"}
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.retypePassword && errors.retypePassword && (
                    <Text style={styles.errorMessage}>
                      {errors.retypePassword}
                    </Text>
                  )}
                </View>

                <Button
                  title={"S I G N U P"}
                  onPress={isValid ? handleSubmit : inValidForm}
                  isValid={isValid}
                  loader={loader}
                />
                <Text style={{ textAlign: "center" }}>
                  Already have an account ?{" "}
                  <Text
                    style={styles.registration}
                    onPress={() => navigation.goBack()}
                  >
                    Login
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

export default SignUp;

const styles = StyleSheet.create({
  cover: {
    height: SIZES.height / 6,
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
    // marginHorizontal: 20,
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
