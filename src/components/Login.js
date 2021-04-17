import React, { useState } from "react";
import MMKVStorage from "react-native-mmkv-storage";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";

import {
  StyleSheet,
  TextInput,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { color } from "../constants";

import { Icon } from "react-native-elements";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState();
  const [pw, setPW] = useState();
  const MMKV = new MMKVStorage.Loader().initialize();
  return (
    <>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.loginView}>
            <Text style={styles.titleText}>Login</Text>
            <View style={styles.emailView}>
              <Icon
                name="email-outline"
                type="material-community"
                size={30}
                color={"grey"}
              />
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
              <Icon
                name="eye"
                type="material-community"
                size={30}
                color={"grey"}
              />
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
                    .then((authData) =>
                      database()
                        .ref("users/" + authData.user.uid)
                        .once("value")
                    )
                    .then((value) => {
                      MMKV.setStringAsync("user.name", value.val().username);
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
              <Text>SignUp?</Text>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.primaryDark,
    flex: 1,
    justifyContent: "flex-end",
  },
  loginView: {
    backgroundColor: "white",
    justifyContent: "space-between",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingLeft: "15%",
    paddingRight: "15%",
    paddingBottom: 120,
    paddingTop: "17%",
    minHeight: 500,
    maxHeight: "95%",
  },
  titleText: {
    fontFamily: "Poppins-Bold",
    fontSize: 32,
    lineHeight: 36,
    height: 64,
  },
  emailView: {
    backgroundColor: color.greyBackgorund,
    borderRadius: 10,
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: "5%",
    paddingVertical: 5,
  },
  pwView: {
    backgroundColor: color.offWhite,
    borderRadius: 10,
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: "5%",
  },
  loginButtonView: {
    height: 64,
    borderRadius: 16,
  },
  loginButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.primary,
    borderRadius: 16,
    height: 64,
  },
  loginButtonText: {
    color: "#F7F7FC",
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
    lineHeight: 24,
    color: color.darkGrey,
    flex: 0.5,
  },
  inputText: {
    flex: 0.5,
  },
});

export default Login;
