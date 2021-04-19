/*
HomeScreen:
Shown nearby player location and route player to screens
*/
import React, { useEffect, useState } from "react";
import { Text, SafeAreaView, Button } from "react-native";
import auth from "@react-native-firebase/auth";
import MMKVStorage from "react-native-mmkv-storage";
const MMKV = new MMKVStorage.Loader().initialize();

const Home = ({ navigation }) => {
  return (
    <SafeAreaView>
      <Text>{"Welcome " + MMKV.getString("userName")}</Text>
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
