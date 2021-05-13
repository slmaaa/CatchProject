/*
HomeScreen:
Shown nearby player location and route player to screens
*/
import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  Button,
  StyleSheet,
  View,
  Image,
} from "react-native";
import { Overlay, Input } from "react-native-elements";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import MMKVStorage from "react-native-mmkv-storage";

import { Icon, InlineIcon } from "@iconify/react";
import { join } from "./joinOrCreate";
import { URL } from "../constants.json";
import { wsSend } from "../App";
import { color } from "../constants";

const MMKV = new MMKVStorage.Loader().initialize();

const RealHome = ({ navigation }) => {
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
        <Input placeholder="Enter room ID" onChangeText={setRoomID} />
        <Button title={"Join"} onPress={handleOnPressJoin} />
      </Overlay>

      <Text>{"Welcome " + MMKV.getString("userName")}</Text>
      <Button
        title={"Game"}
        onPress={() => {
          navigation.navigate("CreateGame");
        }}
      />
      <Button
        title={"Create game room"}
        onPress={() => {
          navigation.navigate("CreateGame");
        }}
      />
      <Button
        title={"Join game"}
        onPress={() => {
          setJoinOverlayVisible(true);
        }}
      />
      <Button
        title={"SetMap Test"}
        onPress={() => {
          navigation.navigate("setmap");
        }}
      />
      <Button
        title={"Real SetMap Test"}
        onPress={() => {
          navigation.navigate("rsetmap");
        }}
      />
      <Button
        title={"Run History"}
        onPress={() => {
          navigation.navigate("history");
        }}
      />
      <Button
        title={"InGame Test"}
        onPress={() => {
          navigation.navigate("InGame");
        }}
      />
      <Button
        title={"Logout"}
        onPress={() => {
          auth().signOut();
        }}
      />
      <Button
        title={"Back"}
        onPress={() => {
          navigation.navigate("Home");
        }}
      />
    </SafeAreaView>
  );
};

const stylesImage = StyleSheet.create({
  container: {
    flex: 0.001,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  tinyLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  logo: {
    width: 66,
    height: 58,
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.greyBackgorund,
    flex: 1,
    justifyContent: "flex-end",
  },
  loginView: {
    backgroundColor: color.greyBackgorund,
    justifyContent: "space-between",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingLeft: "15%",
    paddingRight: "15%",
    paddingBottom: 120,
    paddingTop: "45%",
    minHeight: 600,
    maxHeight: "100%",
  },
  emailView: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: "5%",
    paddingVertical: 5,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  pwView: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: "5%",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  loginButtonView: {
    height: 50,
    borderRadius: 10,
  },
  loginButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.primary,
    borderRadius: 10,
    height: 50,
    width: 130,
    marginHorizontal: 75,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
  },
  emailInputView: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: "5%",
  },
  pwInputView: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: "5%",
  },
  inputTitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    lineHeight: 15,
    color: color.black,
    flex: 0.5,
    marginHorizontal: -20,
  },
  inputText: {
    flex: 1,
    marginHorizontal: -20,
  },
  signUp: {
    flex: 0.2,
    fontSize: 14,
    lineHeight: 24,
    color: color.signUpBlue,
    marginHorizontal: 110,
  },
});
export default RealHome;
