/* eslint-disable quotes */
import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  Text,
  ScrollView,
  StyleSheet,
  View,
  Image,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Avatar, Button, Icon } from "react-native-elements";
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
let link = `https://picsum.photos/200?t=${Date.now()}`;

export default Waiting = ({ navigation }) => {
  const MMKV = new MMKVStorage.Loader().initialize();
  const [game, setGame] = useState(MMKV.getMap("joinedGame"));
  const [assigningTeam, setAssigningTeam] = useState(false);
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

  useFocusEffect(
    useCallback(() => {
      if (roomInfo == null) return;
      MMKV.setMap("roomInfo", null);
      setRoomInfo(null);
      status = roomInfo.status;
      let game = MMKV.getMap("joinedGame");
      game.players = roomInfo.players;
      game.status = roomInfo.status;
      MMKV.setMap("joinedGame", game);
      let list = [];
      roomInfo.players.map((value) => {
        list.push(value.name);
        if (value.team != null) {
          if (value.pid === MMKV.getString("userID")) {
            MMKV.setString("team", value.team);
            MMKV.setInt("key", value.key);
          }
        }
      });
      playerList = list;
      setPlayersView(renderPlayersList());
      if (status === "PREPARE") {
        MMKV.setMap("roomInfo", null);
        navigation.replace("PrepareRoom");
      }
    }, [roomInfo])
  );

  const renderPlayersList = () => {
    if (playerList.length === 0) return;
    let list = [],
      i;
    for (i = 0; i + 1 < playerList.length; i += 2) {
      list.push(
        <View style={styles.playerListRowConatiner} key={i % 2}>
          <View style={styles.LeftPlayer} key={i}>
            <Text style={[styles.PlayerName, { paddingLeft: 20 }]}>
              {playerList[i]}
            </Text>
            <Image style={styles.playerAvatar} source={{ uri: link }} />
          </View>
          <View style={styles.RightPlayer} key={i + 1}>
            <Image style={styles.playerAvatar} source={{ uri: link }} />
            <Text style={[styles.PlayerName, { marginLeft: -40 }]}>
              {playerList[i + 1]}
            </Text>
          </View>
        </View>
      );
    }
    if (i < playerList.length) {
      list.push(
        <View style={styles.playerListRowConatiner} key={i % 2}>
          <View style={styles.LeftPlayer} key={i}>
            <Text style={[styles.PlayerName, { paddingLeft: 20 }]}>
              {playerList[i]}
            </Text>
            <Image style={styles.playerAvatar} source={{ uri: link }} />
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
              {/* <Icon
                iconStyle={styles.Icon}
                name="back"
                type="Entypo"
                alignSelf="center"
              ></Icon> */}
            </View>
          </View>
        </View>
      );
    } else {
      list.push(
        <View style={styles.playerListRowConatiner} key={i % 2}>
          <View style={styles.LeftPlayer} key={i}>
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
        <Image style={styles.playerAvatar} source={{ uri: link }} />
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
    width: width * 0.45,
    height: height * 0.1,
    flexDirection: "row",
    marginTop: height * 0.03,
    paddingRight: 40,
    marginBottom: height * 0.05,
    borderBottomRightRadius: height / 20,
    borderTopRightRadius: height / 20,
    backgroundColor: "#00000080",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "700",
    paddingLeft: 10,
    textAlign: "left",
    marginRight: 10,
  },
  playerAvatar: {
    borderRadius: height / 30,
    height: height / 15,
    width: height / 15,
    marginHorizontal: height / 80,
  },
  playersListContainer: { height: "50%" },
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
    // justifyContent: 'space-between',
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
    right: width / 12,
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
  // Icon: {
  //   // backgroundColor: "#00000080",
  //   color: "black",
  //   width: height * 0.1,
  //   height: height * 0.1,
  //   // justifyContent: "center"
  // }
});
