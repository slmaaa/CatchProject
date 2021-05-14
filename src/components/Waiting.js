/* eslint-disable quotes */
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Text,
  ScrollView,
  StyleSheet,
  View,
  Image,
  Alert,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import database from "@react-native-firebase/database";
import MMKVStorage from "react-native-mmkv-storage";
import MapboxGL from "@react-native-mapbox-gl/maps";
MapboxGL.setAccessToken(
  "pk.eyJ1IjoiaGVjdG9yY2hjaCIsImEiOiJja205YmhldXUwdHQ1Mm9xbGw4N2RodndhIn0.yX90QKE2jcgG-7V5wOGXeQ"
);

import { color } from "../constants.json";
import { deleteGame, getGame } from "./Helper/server";
import useInterval from "./Helper/useInterval";
import { wsSend } from "../App";
import { useFocusEffect } from "@react-navigation/core";

const { height, width } = Dimensions.get("window");

export default Waiting = ({ navigation }) => {
  const MMKV = new MMKVStorage.Loader().initialize();
  const [game, setGame] = useState(MMKV.getMap("joinedGame"));
  const [assigningTeam, setAssigningTeam] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  const [playerView, setPlayersView] = useState([]);
  const gameID = MMKV.getString("gameID");
  const userID = MMKV.getString("userID");
  const status = useRef();

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
    setPlayersView(renderPlayersList());
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (roomInfo === null) return;
      let game = MMKV.getMap("joinedGame");
      game.players = roomInfo.players;
      game.status = roomInfo.status;
      status.current = roomInfo.status;
      setGame(game);
      game.setMap("joinedGame", game);
      roomInfo.players.map((value) => {
        if (value.team !== null) {
          if (value.pid === MMKV.getString("userID")) {
            MMKV.setString("team", value.team);
            MMKV.setInt("key", value.key);
          }
        }
      });
      setPlayersView(renderPlayersList());
      if (roomInfo.status === "PREPARE") {
        MMKV.setMap("roomInfo", null);
        roomInfo.current = null;
        navigation.replace("PrepareRoom");
      }
    }, [roomInfo])
  );
  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        // Prevent default behavior of leaving the screen
        console.log(status.current);
        if (status.current === "PREPARE") {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert("Leave game?", "Are you sure tou want to leave the game?", [
          { text: "Don't leave", style: "cancel", onPress: () => {} },
          {
            text: "Leave",
            style: "destructive",
            // If the user confirmed, then we dispatch the action we blocked earlier
            // This will continue the action that had triggered the removal of the screen
            onPress: () => navigation.dispatch(e.data.action),
          },
        ]);
      }),
    [navigation]
  );

  const renderPlayersList = () => {
    if (game.players.length === 0) return;
    let list = [],
      i;
    for (i = 0; i + 1 < game.players.length; i += 2) {
      list.push(
        <View style={styles.playerListRowConatiner} key={i}>
          <View style={styles.LeftPlayer}>
            <Text style={[styles.PlayerName, { paddingLeft: 20 }]}>
              {game.players[i].name}
            </Text>
            <Image
              style={styles.playerAvatar}
              source={{ uri: game.players[i].avatar }}
            />
          </View>
          <View style={styles.RightPlayer}>
            <Image
              style={styles.playerAvatar}
              source={{ uri: game.players[i + 1].avatar }}
            />
            <Text style={[styles.PlayerName, { marginLeft: -40 }]}>
              {game.players[i + 1].name}
            </Text>
          </View>
        </View>
      );
    }
    if (i < game.players.length) {
      list.push(
        <View style={styles.playerListRowConatiner} key={i}>
          <View style={styles.LeftPlayer}>
            <Text style={[styles.PlayerName, { paddingLeft: 20 }]}>
              {game.players[i].name}
            </Text>
            <Image
              style={styles.playerAvatar}
              source={{ uri: game.players[i].avatar }}
            />
          </View>
          <View style={styles.RightPlayer}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <TouchableOpacity style={styles.AddButton}>
                <Icon
                  name="plus"
                  type={"material-community"}
                  size={height / 16}
                  color={"white"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else {
      list.push(
        <View style={styles.playerListRowConatiner} key={i}>
          <View style={styles.LeftPlayer}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <TouchableOpacity style={styles.AddButton}>
                <Icon
                  name="plus"
                  type={"material-community"}
                  size={height / 16}
                  color={"white"}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.RightPlayer}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <TouchableOpacity style={styles.AddButton}>
                <Icon
                  name="plus"
                  type={"material-community"}
                  size={height / 16}
                  color={"white"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
    return list;
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        style={styles.map}
        pitchEnabled={false}
        scrollEnabled={false}
        rotateEnabled={false}
        compassEnabled={false}
        zoomLevel={16}
      >
        <MapboxGL.Camera
          defaultSettings={{
            zoomLevel: 17,
          }}
          followUserLocation={true}
          followUserMode={"course"}
          zoomLevel={17}
        />
        <MapboxGL.UserLocation />
      </MapboxGL.MapView>
      <Button
        containerStyle={styles.backButtonContainer}
        buttonStyle={styles.backButton}
        onPress={() => navigation.goBack()}
        icon={<Icon name="arrow-back" type={"material"} color={"white"} />}
      />
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {`${game.hostName}'s Room`}
          {`\nRoom ID: ${game.gid}`}
        </Text>
        <Image style={styles.playerAvatar} source={{ uri: game.hostAvatar }} />
      </View>
      <View style={styles.playersListContainer}>
        <ScrollView>{playerView}</ScrollView>
      </View>
      {MMKV.getString("userStatus") === "PREPARE_HOST" && (
        <Button
          title={"Confirm"}
          containerStyle={styles.button}
          titleStyle={{ color: "white", fontSize: 24, height: height * 0.05 }}
          buttonStyle={{ backgroundColor: color.brown }}
          onPress={() => {
            wsSend(JSON.stringify({ header: "CONFIRM", content: gameID }));
          }}
        ></Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.offWhite,
    flex: 1,
  },
  headerContainer: {
    position: "absolute",
    width: width * 0.45,
    height: height * 0.1,
    flexDirection: "row",
    marginTop: height * 0.03,
    paddingRight: height / 60,
    borderBottomRightRadius: height / 20,
    borderTopRightRadius: height / 20,
    backgroundColor: "#00000080",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 12,
    color: "white",
    fontWeight: "700",
    textAlign: "left",
    marginLeft: height / 60,
  },
  playerAvatar: {
    borderRadius: height / 30,
    height: height / 15,
    width: height / 15,
    backgroundColor: "white",
  },
  playersListContainer: { marginTop: height * 0.2, height: "50%" },
  playerListRowConatiner: {
    height: height / 8,
    flexDirection: "row",
    justifyContent: "space-between",
    // marginBottom: 5,
  },
  LeftPlayer: {
    width: width * 0.4,
    height: height * 0.1,
    flexDirection: "row",
    backgroundColor: "#00000080",
    paddingRight: height / 60,
    justifyContent: "flex-end",
    alignItems: "center",
    borderBottomRightRadius: height * 0.05,
    borderTopRightRadius: height * 0.05,
  },
  RightPlayer: {
    width: width * 0.4,
    height: height * 0.1,
    flexDirection: "row",
    backgroundColor: "#00000080",
    // justifyContent: 'space-between',
    paddingLeft: height / 60,
    justifyContent: "flex-start",
    alignItems: "center",
    borderBottomLeftRadius: height * 0.05,
    borderTopLeftRadius: height * 0.05,
  },
  PlayerName: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    textAlignVertical: "center",
    flex: 3,
    marginHorizontal: 5,
  },
  button: {
    position: "absolute",
    height: 50,
    top: height * 0.9,
    width: "40%",
    alignSelf: "center",
    color: color.brown,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.37,
    shadowRadius: 15,
    elevation: 5,
  },
  backButtonContainer: {
    position: "absolute",
    top: height * 0.06,
    left: width * 0.8,
    color: color.brown,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  backButton: {
    backgroundColor: color.brown,
    borderRadius: height / 60,
    width: height / 15,
    height: height / 15,
  },
  AddButton: {
    borderRadius: height / 30,
    height: height / 15,
    width: height / 15,
    borderWidth: 2,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: height / 80,
  },
  IconReplacementText: {
    fontSize: 30,
    color: "white",
    textAlignVertical: "center",
    justifyContent: "center",
  },
  map: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
});
