/*
HomeScreen:
Shown nearby player location and route player to screens
*/
import React, { useEffect, useState } from "react";
import { Text, SafeAreaView, Button } from "react-native";
import { Overlay, Input } from "react-native-elements";
import auth from "@react-native-firebase/auth";
import MMKVStorage from "react-native-mmkv-storage";

import { join } from "./joinGame";
import { URL } from "../constants.json";

const MMKV = new MMKVStorage.Loader().initialize();

const Home = ({ navigation }) => {
  const [joinOverlayVisible, setJoinOverlayVisible] = useState(false);
  const [roomID, setRoomID] = useState();
  const userName = MMKV.getString("userName");
  const userID = MMKV.getString("userID");
  const ws = new WebSocket("ws://192.168.29.243:8765");

  useEffect(() => {
    ws.onopen = () => {
      // connection opened
      console.log("WebSocket Client Connected");
    };
    ws.onmessage = (e) => {
      // a message was received
      console.log(e.data);
    };
  });

  return (
    <SafeAreaView>
      <Overlay
        isVisible={joinOverlayVisible}
        onBackdropPress={() => setJoinOverlayVisible(false)}
        overlayStyle={{ width: "80%" }}
      >
        <Input placeholder="Enter room ID" onChangeText={setRoomID}></Input>
        <Button
          title={"Join"}
          onPress={() => {
            join(roomID, userID, userName).then((gameName) => {
              if (gameName != null) {
                navigation.navigate("Waiting", { gameName: gameName });
              }
            });
          }}
        />
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
        title={"InGame Test"}
        onPress={() => {
          navigation.navigate("InGame");
        }}
      ></Button>
      <Button
        title={"websocket test"}
        onPress={() => {
          const object = { Type: "Create", Content: "dummy" };
          ws.send(JSON.stringify(object));
        }}
      />
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
