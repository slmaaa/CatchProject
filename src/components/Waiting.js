import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, ScrollView } from "react-native";
import { Button } from "react-native-elements";
import database from "@react-native-firebase/database";
import MMKVStorage from "react-native-mmkv-storage";

import { color } from "../constants.json";
import { deleteGame, getGame } from "./Helper/server";
import useInterval from "./Helper/useInterval";
import { set } from "core-js/core/dict";

export default Waiting = ({ navigation }) => {
  const MMKV = new MMKVStorage.Loader().initialize();

  const [game, setGame] = useState(MMKV.getMap("joinedGame"));
  const [roomInfo, setRoomInfo] = useState(null);
  const [playerList, setPlayerList] = useState(null);
  const [status, setStatus] = useState();
  const gameID = MMKV.getString("gameID");
  const gameName = MMKV.getString("gameName");
  const userID = MMKV.getString("userID");
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

  useInterval(() => {
    setRoomInfo(MMKV.getMap("roomInfo"));
    console.log("setRoominfo");
  }, 100);

  useEffect(() => {
    let list = [];
    game.players.map((value) => list.push(value.name));
    setPlayerList(list);
  }, []);

  useEffect(() => {
    if (roomInfo == null) return;
    setStatus(roomInfo.status);
    let list = [];
    roomInfo.players.map((value) => list.push(value.name));
    setPlayerList(list);
    console.log(list);
  }, [roomInfo]);

  if (playerList != null)
    return (
      <SafeAreaView>
        <Text>{game.hostName + "'s Room"}</Text>
        <Text>{"Room ID: " + game.gid}</Text>
        <ScrollView>
          <Text>{playerList}</Text>
        </ScrollView>
        <Button title={"Cancel"} onPress={deleteRoom}></Button>
      </SafeAreaView>
    );
  return (
    <SafeAreaView>
      <Text>Loading</Text>
    </SafeAreaView>
  );
};
