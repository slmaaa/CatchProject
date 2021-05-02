import React, { useState } from "react";
import { Text, SafeAreaView, StyleSheet, Switch, View } from "react-native";
import { Input, CheckBox, Button, ThemeProvider } from "react-native-elements";
import database from "@react-native-firebase/database";
import MMKVStorage from "react-native-mmkv-storage";

import { color } from "../constants.json";
import { wsSend } from "../App";
import useInterval from "./Helper/useInterval";

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

    let gameID = null;
    wsSend(JSON.stringify({ header: "CREATE", content: game }))
      .then(async () => {
        console.log("====================================");
        console.log(game);
        console.log("====================================");
        let interval = setInterval(() => {
          gameID = MMKV.getString("createdGameID");
          if (gameID == null) return;
          clearInterval(interval);
          console.log(gameID);
          MMKV.setString("gameID", gameID);
          MMKV.setString("gameName", gameName);
          database()
            .ref("users/" + MMKV.getString("userID"))
            .update({ gameID: gameID, status: "PREPARE_HOST" });
          MMKV.setString("userStatus", "PREPARE_HOST");
          game.gid = gameID;
          MMKV.setMap("joinedGame", game);
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
      <Input
        placeholder="Game name"
        onChangeText={setGameName}
        style={{ color: "white" }}
      ></Input>
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Join as host</Text>
        <Switch
          trackColor={{ true: "green", false: "grey" }}
          thumbColor={isHost ? color.lightGreen : "white"}
          value={isHost}
          onValueChange={() => setIsHost((previous) => !previous)}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Use preset checkpoints</Text>
        <Switch
          trackColor={{ true: "green", false: "grey" }}
          thumbColor={usePresetCP ? color.lightGreen : "white"}
          value={usePresetCP}
          onValueChange={() => setUsePresetCP((previous) => !previous)}
        />
      </View>
      <Button
        containerStyle={{ margin: 10 }}
        titleStyle={{ color: color.blueOnBlack }}
        buttonStyle={{ borderColor: color.blueOnBlack, borderWidth: 1.5 }}
        title="Checkpoints setup"
        disabled={usePresetCP}
        type={"outline"}
      ></Button>
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
      ></Button>
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
