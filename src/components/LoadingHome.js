import React, { useEffect } from "react";
import { SafeAreaView, Text, PermissionsAndroid } from "react-native";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";

import MMKVStorage from "react-native-mmkv-storage";

export default LoadingHome = ({ navigation }) => {
  const MMKV = new MMKVStorage.Loader().initialize();
  MMKV.clearStore();
  let userID, userName, userStatus, gameID, avatar;
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location game access location permission",
          message: "Access to location is required to continue. ",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Permission granted");
      } else {
        requestLocationPermission();
      }
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(() => {
    requestLocationPermission();
  }, []);
  async function getDataFromDB() {
    userID = auth().currentUser.uid;
    database()
      .ref(`users/${userID}`)
      .once("value")
      .then((snapshot) => {
        userName = snapshot.child("username").val();
        userStatus = snapshot.child("status").val();
        gameID = snapshot.child("gameID").val();
        avatar = snapshot.child("avatar").val();
      })
      .then(() => {
        setLocal();
      })
      .catch((e) => {
        console.log(e);
      });
  }
  async function setLocal() {
    console.log(userID, userName);
    await MMKV.setStringAsync("userID", userID);
    await MMKV.setStringAsync("userName", userName);
    if (userStatus === "OFFLINE") {
      userStatus = "ONLINE";
      database().ref(`users/${userID}`).update({ status: "ONLINE" });
    }
    await MMKV.setStringAsync("userStatus", userStatus);
    if (avatar != null) {
      await MMKV.setStringAsync("userAvatar", avatar);
    }
    if (gameID != null) {
      MMKV.setString("userGameID", gameID);
    }
    await navigation.replace("Home");
  }
  const getData = async () => {
    await getDataFromDB();
  };
  getData();
  return (
    <SafeAreaView>
      <Text>Loading</Text>
    </SafeAreaView>
  );
};
