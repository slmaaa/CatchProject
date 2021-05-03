/*
HomeScreen:
Shown nearby player location and route player to screens
*/
import React, { useEffect, useState } from "react";
import { Text, SafeAreaView, Button } from "react-native";
import { Overlay, Input } from "react-native-elements";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import MMKVStorage from "react-native-mmkv-storage";

import { join } from "./joinGame";
import { URL } from "../constants.json";
import { wsSend } from "../App";

const MMKV = new MMKVStorage.Loader().initialize();

const Home = ({ navigation }) => {
  const [joinOverlayVisible, setJoinOverlayVisible] = useState(false);
  const [roomID, setRoomID] = useState();
  const userName = MMKV.getString("userName");
  const userID = MMKV.getString("userID");

  const handleOnPressJoin = () => {
    let game;
    wsSend(
      JSON.stringify({
        header: "JOIN",
        content: {
          player: {
            pid: MMKV.getString("userID"),
            name: MMKV.getString("userName"),
            avatar: "None",
          },
          gid: roomID,
        },
      })
    ).then(() => {
      let interval = setInterval(() => {
        game = MMKV.getMap("joinedGame");
        if (game == null) return;
        clearInterval(interval);
        MMKV.setString("gameID", roomID);
        MMKV.setString("gameName", game.gname);
        database()
          .ref("users/" + MMKV.getString("userID"))
          .update({ gameID: roomID, status: "PREPARE" });
        MMKV.setString("userStatus", "PREPARE");
        navigation.replace("Waiting", {
          gameName: game.gname,
        });
      }, 100);
    });
  };
  return (
    <SafeAreaView>
      <Overlay
        isVisible={joinOverlayVisible}
        onBackdropPress={() => setJoinOverlayVisible(false)}
        overlayStyle={{ width: "80%" }}
      >
        <Input placeholder="Enter room ID" onChangeText={setRoomID}></Input>
        <Button title={"Join"} onPress={handleOnPressJoin} />
      </Overlay>
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
          setJoinOverlayVisible(true);
        }}
      ></Button>
      <Button
        title={"SetMap Test"}
        onPress={() => {
          navigation.navigate("setmap");
        }}
      ></Button>
      <Button
        title={"Real SetMap Test"}
        onPress={() => {
          navigation.navigate("rsetmap");
        }}
      ></Button>
      <Button
        title={"Run History"}
        onPress={() => {
          navigation.navigate("history");
        }}
      ></Button>
      <Button
        title={"InGame Test"}
        onPress={() => {
          navigation.navigate("InGame");
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