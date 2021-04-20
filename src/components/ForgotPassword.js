import React, { useState } from "react";
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

export default ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState();
  const [pw, setPW] = useState();
  const [username, setUsername] = useState();
  return (
    <>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.loginView}>
            <Text style={styles.titleText}>Reset Password</Text>
            <View style={styles.emailView}>
              <Icon
                name="account"
                type="material-community"
                size={30}
                color={"grey"}
              />
              <View style={styles.emailInputView}>
                <Text style={styles.inputTitle}>Username</Text>
                <TextInput
                  style={styles.inputText}
                  autoCompleteType={"name"}
                  clearTextOnFocus={true}
                  keyboardType={"default"}
                  placeholder={"Username"}
                  autoCapitalize={"none"}
                  onChangeText={setUsername}
                ></TextInput>
              </View>
            </View>
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
                  clearTextOnFocus={true}
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
                  onChangeText={setPW}
                  autoCapitalize={"none"}
                ></TextInput>
              </View>
            </View>
            <View style={styles.loginButtonView}>
              <TouchableOpacity
                onPress={() => {
                  auth()
                    .createUserWithEmailAndPassword(email, pw)
                    .then((authData) => {
                      database()
                        .ref("users/" + authData.user.uid)
                        .set({
                          username: username,
                          email: email,
                          status: "ONLINE",
                        });
                      console.log("User account created & signed in!");
                    })
                    .catch((error) => {
                      if (error.code === "auth/email-already-in-use") {
                        console.log("That email address is already in use!");
                      }

                      if (error.code === "auth/invalid-email") {
                        console.log("That email address is invalid!");
                      }

                      console.error(error);
                    });
                }}
              >
                <View style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>Login</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.blueOnBlack,
    flex: 1,
    justifyContent: "flex-end",
  },
  loginView: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
    paddingLeft: "15%",
    paddingRight: "15%",
    paddingBottom: 80,
    paddingTop: "17%",
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
