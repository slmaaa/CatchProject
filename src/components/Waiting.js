import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, ScrollView, StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import database from "@react-native-firebase/database";
import MMKVStorage from "react-native-mmkv-storage";

import { color } from "../constants.json";
import { deleteGame, getGame } from "./Helper/server";
import useInterval from "./Helper/useInterval";
import { wsSend } from "../App";

export default Waiting = ({ navigation }) => {
  const MMKV = new MMKVStorage.Loader().initialize();

  const [game, setGame] = useState(MMKV.getMap("joinedGame"));
  const [roomInfo, setRoomInfo] = useState(null);
  const [playerView, setPlayersView] = useState([]);
  const gameID = MMKV.getString("gameID");
  const userID = MMKV.getString("userID");
  let status;
  let playerList = [];

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
  }, 100);

  useEffect(() => {
    let list = [];
    game.players.map((value) => list.push(value.name));
    playerList = list;
    setPlayersView(renderPlayersList());
  }, []);

  useEffect(() => {
    if (roomInfo == null) return;
    status = roomInfo.status;
    let game = MMKV.getMap("joinedGame");
    game[players] = roomInfo.players;
    let list = [];
    roomInfo.players.map((value) => {
      list.push(value.name);
      if (value.team != None) {
        if (value.pid == MMKV.getString("userID"))
          MMKV.setString("team", value.team);
      }
    });
    playerList = list;
    setPlayersView(renderPlayersList());
    if (status == "RUNNING") {
      navigation.replace("InGame");
      return;
    }
  }, [roomInfo]);

  const renderPlayersList = () => {
    if (playerList.length == 0) return;
    let list = [],
      i;
    for (i = 0; i + 1 < playerList.length; i += 2) {
      list.push(
        <View
          style={{
            height: "18%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          key={i % 2}
        >
          <View style={styles.leftPlayer} key={i}>
            <Text style={styles.headerText} key={i}>
              {playerList[i]}
            </Text>
          </View>
          <View style={styles.rightPlayer} key={i + 1}>
            <Text style={styles.headerText} key={i + 1}>
              {playerList[i + 1]}
            </Text>
          </View>
        </View>
      );
    }
    if (i < playerList.length) {
      list.push(
        <View
          style={{
            height: "18%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          key={i % 2}
        >
          <View style={styles.leftPlayer} key={i}>
            <Text style={styles.headerText} key={i}>
              {playerList[i]}
            </Text>
          </View>
        </View>
      );
    }
    return list;
  };

  const renderButton = () => {
    if (MMKV.getString == "PREPARE_HOST") {
      return <Button containerstyle={styles.button} title={"Confirm"}></Button>;
    }
  };

  const handleOnPressStart = () => {
    wsSend("header: ");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {`${game.hostName}'s Room`}
          {`\nRoom ID: ${game.gid}`}
        </Text>
      </View>
      <View style={styles.playersListContainer}>{playerView}</View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "grey",
    flex: 1,
  },
  headerContainer: {
    marginTop: 30,
    marginBottom: 70,
    flex: 0.09,
    backgroundColor: "#00000080",
    width: "48%",
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    alignContent: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFFFF",
    textAlign: "center",
    textAlignVertical: "center",
  },
  playersListContainer: { flex: 0.6, borderWidth: 1 },
  button: {
    flex: 0.1,
    marginTop: 140,
    marginBottom: 90,
  },
  leftPlayer: {
    flex: 0.36,
    height: "100%",
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    backgroundColor: "#00000080",
    alignContent: "center",
    justifyContent: "center",
  },
  rightPlayer: {
    flex: 0.36,
    height: "100%",
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    backgroundColor: "#00000080",
    alignContent: "center",
    justifyContent: "center",
  },
});
