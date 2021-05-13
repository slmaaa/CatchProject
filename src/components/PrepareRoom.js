/* eslint-disable quotes */
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  SafeAreaView,
  Text,
  ScrollView,
  StyleSheet,
  View,
  Image,
  Dimensions,
  Alert,
} from "react-native";

import { Button, Icon } from "react-native-elements";
import database from "@react-native-firebase/database";
import MMKVStorage from "react-native-mmkv-storage";
import { useFocusEffect } from "@react-navigation/core";
import { color } from "../constants.json";
import { deleteGame } from "./Helper/server";
import useInterval from "./Helper/useInterval";
import { wsSend } from "../App";
import MapboxGL from "@react-native-mapbox-gl/maps";
MapboxGL.setAccessToken(
  "pk.eyJ1IjoiaGVjdG9yY2hjaCIsImEiOiJja205YmhldXUwdHQ1Mm9xbGw4N2RodndhIn0.yX90QKE2jcgG-7V5wOGXeQ"
);
const { height, width } = Dimensions.get("window");
export default PrepareRoom = ({ navigation }) => {
  const MMKV = new MMKVStorage.Loader().initialize();
  const [roomInfo, setRoomInfo] = useState(null);
  const [playerView, setPlayersView] = useState([]);
  const [checkpoints, setCheckpoints] = useState([]);
  const gameID = MMKV.getString("gameID");
  const userID = MMKV.getString("userID");
  const gameRef = useRef(MMKV.getMap("joinedGame"));

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
    gameRef.current.players.map((value) => {
      list.push({ name: value.name, team: value.team, avatar: value.avatar });
    });
    setPlayersView(renderPlayersList(list));
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (roomInfo === null || roomInfo === undefined) return;
      MMKV.setMap("roomInfo", null);
      let game = MMKV.getMap("joinedGame");
      game["status"] = roomInfo.status;
      if (roomInfo.checkpoints !== undefined && roomInfo.checkpoints.length > 0)
        game["checkpoints"] = roomInfo.checkpoints;
      MMKV.setMap("joinedGame", game);
      if (roomInfo.checkpoints !== undefined) {
        let list = [];
        roomInfo.checkpoints.map((val) => {
          list.push(val.area.center);
        });
        setCheckpoints(list);
      }
      gameRef.current = game;
      setRoomInfo(null);
      if (gameRef.current.status === "RUNNING") {
        navigation.replace("InGame");
      }
    }, [roomInfo])
  );
  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (gameRef.current.status === "RUNNING") {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }

        // Prevent default behavior of leaving the screen
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
  const RenderCheckpointsOnMap = () => {
    if (checkpoints.length > 0) {
      let list = [];
      for (let i = 0; i < checkpoints.length; ++i) {
        list.push(
          <MapboxGL.PointAnnotation
            key={i}
            id={i.toString()}
            coordinate={[checkpoints[i].lng, checkpoints[i].lat]}
          />
        );
      }
      return list;
    }
    return null;
  };
  const renderPlayersList = (playerList = []) => {
    if (playerList.length === 0) return;
    let list = [],
      i;
    for (i = 0; i < playerList.length; ++i) {
      const link = playerList[i].avatar;
      list.push(
        playerList[i].team === "BLUE" ? (
          <View style={styles.playerListRowConatiner} key={i}>
            <View style={styles.BluePlayer} key={i}>
              <Image style={styles.listPlayerAvatar} source={{ uri: link }} />
            </View>
          </View>
        ) : (
          <View style={styles.playerListRowConatiner} key={i}>
            <View style={styles.OrangePlayer} key={i}>
              <Image style={styles.listPlayerAvatar} source={{ uri: link }} />
            </View>
          </View>
        )
      );
    }
    return list;
  };
  return (
    <SafeAreaView style={styles.container}>
      <MapboxGL.MapView style={styles.map} pitchEnabled={false}>
        <MapboxGL.Camera
          defaultSettings={{
            zoomLevel: 17,
          }}
          followUserLocation={true}
          followUserMode={"course"}
          zoomLevel={17}
        />
        <MapboxGL.UserLocation />
        <RenderCheckpointsOnMap />
      </MapboxGL.MapView>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {`${gameRef.current.hostName}'s Room`}
          {`\nRoom ID: ${gameRef.current.gid}`}
        </Text>
        <Image
          style={styles.headerPlayerAvatar}
          source={{ uri: gameRef.current.hostAvatar }}
        />
      </View>
      <View style={styles.playersListContainer}>
        <ScrollView>{playerView}</ScrollView>
      </View>
      {MMKV.getString("userStatus") === "PREPARE_HOST" && (
        <>
          <Button
            containerStyle={styles.setCPButton}
            titleStyle={{ color: "white", fontSize: 24 }}
            buttonStyle={{ backgroundColor: color.brown, borderRadius: 100 }}
            onPress={() => {
              navigation.navigate("CheckPointSetting");
            }}
            icon={
              <Icon
                name="map-marker-plus"
                type={"material-community"}
                color={"white"}
                size={height * 0.05}
              />
            }
          ></Button>
          <Button
            title={"Start"}
            containerStyle={styles.startButton}
            titleStyle={{
              color: "white",
              fontSize: 24,
              height: height * 0.05,
            }}
            buttonStyle={{ backgroundColor: color.brown }}
            onPress={() => {
              wsSend(JSON.stringify({ header: "START", content: gameID }));
            }}
          ></Button>
        </>
      )}
    </SafeAreaView>
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
  headerPlayerAvatar: {
    borderRadius: height / 30,
    height: height / 15,
    width: height / 15,
  },
  listPlayerAvatar: {
    borderRadius: height / 30,
    height: height / 15,
    width: height / 15,
  },
  playersListContainer: {
    marginTop: height * 0.2,
    height: height * 0.5,
    width: width * 0.2,
  },
  playerListRowConatiner: {
    height: height / 8,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  BluePlayer: {
    width: width * 0.2,
    height: height * 0.1,
    flexDirection: "row",
    backgroundColor: "#00000080",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: height / 60,
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: height * 0.05,
    borderTopRightRadius: height * 0.05,
    borderColor: "#98E7FD",
  },
  OrangePlayer: {
    width: width * 0.2,
    height: height * 0.1,
    flexDirection: "row",
    backgroundColor: "#00000080",
    paddingRight: height / 60,
    justifyContent: "flex-end",
    alignItems: "center",
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: height * 0.05,
    borderTopRightRadius: height * 0.05,
    borderColor: "#FF8F62",
  },
  PlayerName: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
    textAlignVertical: "center",
    flex: 3,
  },
  startButton: {
    position: "absolute",
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
  setCPButton: {
    position: "absolute",
    width: 80,
    borderRadius: 10,
    top: height * 0.9,
    right: width * 0.05,
    color: color.brown,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.37,
    shadowRadius: 100,
    elevation: 5,
  },
  backButton: {
    marginLeft: height / 6,
    borderRadius: height / 60,
    height: height / 15,
    width: height / 15,
    // borderWidth: 2,
    // borderColor: "black",
    backgroundColor: color.brown,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginHorizontal: height / 80,
  },
  map: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
});
