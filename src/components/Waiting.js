import React from "react";
import { SafeAreaView, Text } from "react-native";
import { Button } from "react-native-elements";
import database from "@react-native-firebase/database";

import { color } from "../constants.json";
import { getData } from "./Helper/async";
export default Waiting = () => {
  let gameID, gameName;
  getData("user.game.id", (val) => (gameID = val));
  getData("user.game.name", (val) => (gameName = val));
  const cancelGame = () => {
    database().ref(`games/${gameID}`).set(null);
  };
  return (
    <SafeAreaView>
      <Text>{gameID}</Text>
      <Text>{gameName}</Text>
      <Button title={"Cancel"} onPress={cancelGame}></Button>
    </SafeAreaView>
  );
};
