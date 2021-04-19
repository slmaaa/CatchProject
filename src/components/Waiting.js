import React from "react";
import { SafeAreaView, Text } from "react-native";
import { Button } from "react-native-elements";
import database from "@react-native-firebase/database";
import MMKVStorage from "react-native-mmkv-storage";

import { color } from "../constants.json";

export default Waiting = () => {
  const MMKV = new MMKVStorage.Loader().initialize();
  const gameID = MMKV.getString("gameID");
  const gameName = MMKV.getString("gameName");

  const cancelGame = () => {
    MMKV.removeItem("gameID");
    database().ref(`games/${gameID}`).set(null);
  };
  return (
    <SafeAreaView>
      <Text>{"Game ID: " + gameID}</Text>
      <Text>{gameName}</Text>
      <Button title={"Cancel"} onPress={cancelGame}></Button>
    </SafeAreaView>
  );
};
