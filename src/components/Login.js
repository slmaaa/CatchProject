import React, { useState } from "react";
import auth from "@react-native-firebase/auth";

import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import logoImage from "./image/IMG_4059.jpg";
import { color } from "../constants";
import { Icon } from "react-native-elements";

const exampleImageUri = Image.resolveAssetSource(logoImage).uri;
const Login = ({ navigation }) => {
  const [email, setEmail] = useState();
  const [pw, setPW] = useState();
  return (
    <>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.loginView}>
            <View style={stylesImage.container}>
              <Image
                style={stylesImage.tinyLogo}
                source={{ uri: exampleImageUri }}
              ></Image>
            </View>

            <View style={styles.emailView}>
              <View style={styles.emailInputView}>
                <Text style={styles.inputTitle}>Email</Text>
                <TextInput
                  style={styles.inputText}
                  autoCompleteType={"email"}
                  keyboardType={"email-address"}
                  placeholder={"example@abcmail.com"}
                  autoCapitalize={"none"}
                  onChangeText={setEmail}
                ></TextInput>
              </View>
            </View>

            <View style={styles.pwView}>
              <View style={styles.pwInputView}>
                <Text style={styles.inputTitle}>Password</Text>
                <TextInput
                  style={styles.inputText}
                  autoCompleteType={"password"}
                  keyboardType={"email-address"}
                  placeholder={"*********"}
                  autoCapitalize={"none"}
                  onChangeText={setPW}
                ></TextInput>
              </View>
            </View>

            <View style={styles.loginButtonView}>
              <TouchableOpacity
                onPress={() => {
                  auth()
                    .signInWithEmailAndPassword(email, pw)
                    .catch((e) => {
                      `Error ${e}`;
                    });
                }}
              >
                <View style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>Login</Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate("SignUp")}
            >
              <Text style={styles.signUp}>SignUp?</Text>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

const stylesImage = StyleSheet.create({
  container: {
    flex: 0.001,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  tinyLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  logo: {
    width: 66,
    height: 58,
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.greyBackgorund,
    flex: 1,
    justifyContent: "flex-end",
  },
  loginView: {
    backgroundColor: color.greyBackgorund,
    justifyContent: "space-between",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingLeft: "15%",
    paddingRight: "15%",
    paddingBottom: 120,
    paddingTop: "45%",
    minHeight: 600,
    maxHeight: "100%",
  },
  emailView: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: "5%",
    paddingVertical: 5,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  pwView: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: "5%",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  loginButtonView: {
    height: 50,
    borderRadius: 10,
  },
  loginButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.primary,
    borderRadius: 10,
    height: 50,
    width: 160,
    marginHorizontal: 60,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
  },
  emailInputView: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: "5%",
  },
  pwInputView: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: "5%",
  },
  inputTitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    lineHeight: 15,
    color: color.black,
    flex: 0.5,
    marginHorizontal: -20,
  },
  inputText: {
    flex: 1,
    marginHorizontal: -20,
  },
  signUp: {
    flex: 0.2,
    fontSize: 14,
    lineHeight: 24,
    color: color.signUpBlue,
    marginHorizontal: 110,
  },
});

export default Login;
