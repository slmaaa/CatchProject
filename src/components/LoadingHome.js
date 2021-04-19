import React from "react";
import { SafeAreaView, Text } from "react-native";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";

import MMKVStorage from "react-native-mmkv-storage";

export default LoadingHome = ({ navigation }) => {
  const MMKV = new MMKVStorage.Loader().initialize();
  let userID, userName, userStatus, gameID;
  async function test() {
    userID = auth().currentUser.uid;
    database()
      .ref(`users/${userID}`)
      .once("value")
      .then((snapshot) => {
        userName = snapshot.child("username").val();
        userStatus = snapshot.child("status").val();
        gameID = snapshot.child("gameID").val();
      })
      .then(() => {
        setLocal();
      })
      .then()
      .catch((e) => {
        console.log(e);
      });
  }
  async function setLocal() {
    await MMKV.setStringAsync("userID", userID);
    let a = await MMKV.getStringAsync("userID");
    console.log(a);
    await MMKV.setStringAsync("userName", userName);
    let b = await MMKV.getStringAsync("userName");
    console.log(b);
    await MMKV.setStringAsync("userStatus", userStatus);
    let c = await MMKV.getStringAsync("userStatus");
    console.log(c);
    if (gameID != null) {
      MMKV.setString("userGameID", gameID);
    }
    await navigation.replace("Home");
  }
  const temp = async () => {
    await test();
  };
  temp();

  return (
    <SafeAreaView>
      <Text>Loading</Text>
    </SafeAreaView>
  );
};
