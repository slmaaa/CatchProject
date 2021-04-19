import React, { useState, useEffect } from "react";
import { SafeAreaView, Text } from "react-native";
import { Button } from "react-native-elements";
import database from "@react-native-firebase/database";
import MMKVStorage from "react-native-mmkv-storage";

import { color } from "../constants.json";
import { deleteGame, getGame } from "./Helper/server";

export default Waiting = ({ navigation }) => {
  const MMKV = new MMKVStorage.Loader().initialize();

  const [game, setGame] = useState(null);

  const gameID = MMKV.getString("gameID");
  const gameName = MMKV.getString("gameName");
  const userID = MMKV.getString("userID");

  const getGameInfo = () => [
    getGame(gameID).then((value) => {
      if (value != null) {
        setGame(value);
      }
    }),
  ];
  const deleteRoom = () => {
    deleteGame.then(() => {
      MMKV.removeItem("gameID");
      database().ref(`games/${gameID}`).set(null);
      database()
        .ref("users/" + userID)
        .update({ status: "ONLINE" });
    });
    navigation.replace("Home");
  };

  useEffect(() => {
    getGameInfo();
  }, []);
  if (game != null)
    return (
      <SafeAreaView>
        <Text>{game.hostName + "'s Room"}</Text>
        <Text>{"Room ID: " + game.gid}</Text>
        <Text>{JSON.stringify(game.players)}</Text>
        <Button title={"Cancel"} onPress={deleteRoom}></Button>
      </SafeAreaView>
    );
  return (
    <SafeAreaView>
      <Text>Loading</Text>
    </SafeAreaView>
  );
};
