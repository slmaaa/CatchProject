/*
HomeScreen:
Shown nearby player location and route player to screens
*/
import React, { useState } from "react";
import { Text, SafeAreaView, Button } from "react-native";
import MMKVStorage from "react-native-mmkv-storage";
import auth from "@react-native-firebase/auth";

const Home = ({ navigation }) => {
  const MMKV = new MMKVStorage.Loader().initialize();

  return (
    <SafeAreaView>
      <Text>{"Welcome " + MMKV.getString("user.name")}</Text>
      <Button
        title={"Create game room"}
        onPress={() => {
          navigation.navigate("CreateGame");
        }}
      ></Button>
      <Button
        title={"Join game"}
        onPress={() => {
          //navigation.navigate("CreateGame");
        }}
      ></Button>
      <Button
        title={"Logout"}
        onPress={() => {
          auth().signOut();
        }}
      ></Button>
    </SafeAreaView>
  );
};
export default Home;
