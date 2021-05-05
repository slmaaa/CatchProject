/* eslint-disable quotes */
import React, { useState } from "react";
import { Text, SafeAreaView, StyleSheet, Switch, View } from "react-native";
import { Input, CheckBox, Button, ThemeProvider } from "react-native-elements";
import database from "@react-native-firebase/database";
import MMKVStorage from "react-native-mmkv-storage";

import { color } from "../constants.json";
import { wsSend } from "../App";
import useInterval from "./Helper/useInterval";
import Home from "./Home";

export default CreateGame = ({ navigation }) => {
  const MMKV = new MMKVStorage.Loader().initialize();

  const [isHost, setIsHost] = useState(false);
  const [usePresetCP, setUsePresetCP] = useState(false);
  let customCPs = null;
  let cps;
  let game;
  const [gameName, setGameName] = useState("");
  async function getPresetCP() {
    if (usePresetCP) {
      database()
        .ref("defalutUSTCps")
        .once("value")
        .then((val) => {
          cps = val.val();
        })
        .then(() => setGame())
        .catch((e) => console.log(e));
    } else {
      cps = customCPs;
      setGame();
    }
  }
  async function setGame() {
    game = {
      gid: "None",
      gname: gameName,
      status: "PREPARE",
      hostID: MMKV.getString("userID"),
      hostName: MMKV.getString("userName"),
      checkpoints: cps,
      players: [
        {
          pid: MMKV.getString("userID"),
          name: MMKV.getString("userName"),
          avatar: "None",
        },
      ],
      teams: ["RED", "BLUE"],
    };

    let createdGame = null;
    wsSend(JSON.stringify({ header: "CREATE", content: game }))
      .then(async () => {
        console.log("====================================");
        console.log(game);
        console.log("====================================");
        let interval = setInterval(() => {
          createdGame = MMKV.getMap("joinedGame");
          if (createdGame == null) return;
          clearInterval(interval);
          MMKV.setString("gameID", createdGame.gid.toString());
          MMKV.setString("gameName", gameName);
          database()
            .ref("users/" + MMKV.getString("userID"))
            .update({
              gameID: createdGame.gid.toString(),
              status: "PREPARE_HOST",
            });
          MMKV.setString("userStatus", "PREPARE_HOST");
          navigation.replace("Waiting", { gameName: gameName });
        }, 100);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  const createGame = async () => {
    await getPresetCP();
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={{color: "white"}}>CreateAndJoin</Text>

      <Button
        containerStyle={{ margin: 10 }}
        titleStyle={{ color: color.lightGreen }}
        buttonStyle={{
          borderColor: color.lightGreen,
          borderWidth: 1.5,
        }}
        onPress={createGame}
        title="Create"
        type={"outline"}
      />
      <Button
        containerStyle={{ margin: 10 }}
        titleStyle={{ color: color.lightPurple }}
        buttonStyle={{
          borderColor: color.lightGreen,
          borderWidth: 1.5,
        }}
        onPress={() => {
          navigation.navigate("Home");
        }}
        title="Back"
        type={"outline"}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    borderWidth: 0,
    flex: 1,
    padding: 15,
  },
  nameInputContainer: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "grey",
    padding: 5,
  },
  switchContainer: {
    flexDirection: "row",
    backgroundColor: "black",
    justifyContent: "space-between",
  },
  switchText: {
    fontFamily: "Poppins-Medium",
    textAlign: "left",
    fontSize: 18,
    color: color.blueOnBlack,
    padding: 10,
  },
});
