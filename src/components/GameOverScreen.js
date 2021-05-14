/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  ScrollView,
  StyleSheet,
  View,
  Image,
  StatusBar,
  Dimensions,
  ImageBackground,
} from "react-native";
import { Avatar, Button } from "react-native-elements";
import MMKVStorage from "react-native-mmkv-storage";

import MapboxGL from "@react-native-mapbox-gl/maps";
MapboxGL.setAccessToken(
  "pk.eyJ1IjoiaGVjdG9yY2hjaCIsImEiOiJja205YmhldXUwdHQ1Mm9xbGw4N2RodndhIn0.yX90QKE2jcgG-7V5wOGXeQ"
);
import { color } from "../constants.json";

const { height, width } = Dimensions.get("window");

export default GameOverScreen = ({ navigation }) => {
  const MMKV = new MMKVStorage.Loader().initialize();
  const [playerView, setPlayersView] = useState([]);
  const [initializing, setInitializing] = useState(true);
  const [game, setGame] = useState(MMKV.getMap("joinedGame"));
  let status,
    distMVP,
    pointMVP,
    blueTeam = [],
    redTeam = [];

  useEffect(() => {
    if (!initializing) return;
    game.players.map((player) => {
      player.team === "BLUE" ? blueTeam.push(player) : redTeam.push(player);
    });
    distMVP = MMKV.getString("distMVP");
    pointMVP = MMKV.getString("pointMVP");
    setPlayersView(renderPlayersList());
    setInitializing(false);
  }, []);

  const renderPlayersList = () => {
    if (game.players.length === 0) return;
    let list = [],
      length = game.players.length / 2,
      i;
    for (i = 0; i < length; ++i) {
      list.push(
        game.winTeam === "BLUE" ? (
          <View style={styles.playerListRowConatiner} key={i % 2}>
            <View style={styles.LeftPlayerWin} key={i}>
              <View style={{ marginStart: 20, marginEnd: 10 }}>
                <Text style={[styles.WinText, { color: "#98E7FD" }]}>
                  {"WIN"}
                </Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignContent: "space-around",
                }}
              >
                <Text style={[styles.PlayerName]}>
                  {blueTeam[i].name + "\n"}
                  {blueTeam[i].dist > 1000
                    ? blueTeam[i].dist / 1000 + "km"
                    : blueTeam[i].dist + "m"}{" "}
                  | {blueTeam[i].points} pts
                </Text>
              </View>
              <Image
                style={styles.PlayerAvatar}
                source={{ uri: game.players[i].avatar }}
              />
              {/* With Crown start*/}
              {blueTeam[i].key.toString() === distMVP && (
                <View
                  style={{ top: -20, paddingStart: 5, position: "absolute" }}
                >
                  <View style={{ top: 28, right: 5, bottom: 0 }}>
                    <Image
                      style={styles.PlayerAvatar}
                      source={{ uri: game.players[i].avatar }}
                    />
                  </View>
                  <View style={{ top: -43, left: 25, width: 40, height: 40 }}>
                    <Image
                      style={styles.Crown}
                      source={require("./image/PurpleCrown.png")}
                    />
                  </View>
                </View>
              )}
              {blueTeam[i].key.toString() === pointMVP && (
                <View
                  style={{ top: -20, paddingStart: 5, position: "absolute" }}
                >
                  <View style={{ top: 28, right: 5, bottom: 0 }}>
                    <Image
                      style={styles.PlayerAvatar}
                      source={{ uri: game.players[i].avatar }}
                    />
                  </View>
                  <View style={{ top: -43, left: 65, width: 40, height: 40 }}>
                    <Image
                      style={styles.Crown}
                      source={require("./image/RedCrown.png")}
                    />
                  </View>
                </View>
              )}
              {/* With Crown end*/}
            </View>
            <View style={styles.RightPlayer} key={i + 1}>
              <Image
                style={styles.PlayerAvatar}
                source={{ uri: game.players[i].avatar }}
              />
              {/* With Crown start*/}
              {redTeam[i].key.toString() === distMVP && (
                <View
                  style={{ top: -20, paddingStart: 5, position: "absolute" }}
                >
                  <View style={{ top: 28, right: 5, bottom: 0 }}>
                    <Image
                      style={styles.PlayerAvatar}
                      source={{ uri: game.players[i].avatar }}
                    />
                  </View>
                  <View style={{ top: -43, left: 25, width: 40, height: 40 }}>
                    <Image
                      style={styles.Crown}
                      source={require("./image/PurpleCrown.png")}
                    />
                  </View>
                </View>
              )}
              {redTeam[i].key.toString() === pointMVP && (
                <View
                  style={{ top: -20, paddingStart: 5, position: "absolute" }}
                >
                  <View style={{ top: 28, right: 5, bottom: 0 }}>
                    <Image
                      style={styles.PlayerAvatar}
                      source={{ uri: game.players[i].avatar }}
                    />
                  </View>
                  <View style={{ top: -43, left: 65, width: 40, height: 40 }}>
                    <Image
                      style={styles.Crown}
                      source={require("./image/RedCrown.png")}
                    />
                  </View>
                </View>
              )}

              {/* With Crown end*/}
              <Text style={[styles.PlayerName, { marginLeft: 0 }]}>
                {redTeam[i].name + "\n"}
                {redTeam[i].dist > 1000
                  ? redTeam[i].dist / 1000 + "km"
                  : redTeam[i].dist + "m"}{" "}
                | {redTeam[i].points} pts
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.playerListRowConatiner} key={i % 2}>
            <View style={styles.LeftPlayer} key={i}>
              <View
                style={{
                  justifyContent: "center",
                  alignContent: "space-around",
                }}
              >
                <Text style={[styles.PlayerName]}>
                  {blueTeam[i].name + "\n"}
                  {blueTeam[i].dist > 1000
                    ? blueTeam[i].dist / 1000 + "km"
                    : blueTeam[i].dist + "m"}{" "}
                  | {blueTeam[i].points} pts
                </Text>
              </View>
              <Image
                style={styles.PlayerAvatar}
                source={{ uri: game.players[i].avatar }}
              />
              {/* With Crown start*/}
              {blueTeam[i].key.toString() === distMVP && (
                <View
                  style={{ top: -20, paddingStart: 5, position: "absolute" }}
                >
                  <View style={{ top: 28, right: 5, bottom: 0 }}>
                    <Image
                      style={styles.PlayerAvatar}
                      source={{ uri: game.players[i].avatar }}
                    />
                  </View>
                  <View style={{ top: -43, left: 25, width: 40, height: 40 }}>
                    <Image
                      style={styles.Crown}
                      source={require("./image/PurpleCrown.png")}
                    />
                  </View>
                </View>
              )}
              {blueTeam[i].key.toString() === pointMVP && (
                <View
                  style={{ top: -20, paddingStart: 5, position: "absolute" }}
                >
                  <View style={{ top: 28, right: 5, bottom: 0 }}>
                    <Image
                      style={styles.PlayerAvatar}
                      source={{ uri: game.players[i].avatar }}
                    />
                  </View>
                  <View style={{ top: -43, left: 65, width: 40, height: 40 }}>
                    <Image
                      style={styles.Crown}
                      source={require("./image/RedCrown.png")}
                    />
                  </View>
                </View>
              )}
              {/* With Crown end*/}
            </View>
            <View style={styles.RightPlayerWin} key={i + 1}>
              <Image
                style={styles.PlayerAvatar}
                source={{ uri: game.players[i].avatar }}
              />
              {/* With Crown start*/}
              {redTeam[i].key.toString() === distMVP && (
                <View
                  style={{ top: -20, paddingStart: 5, position: "absolute" }}
                >
                  <View style={{ top: 28, right: 5, bottom: 0 }}>
                    <Image
                      style={styles.PlayerAvatar}
                      source={{ uri: game.players[i].avatar }}
                    />
                  </View>
                  <View style={{ top: -43, left: 25, width: 40, height: 40 }}>
                    <Image
                      style={styles.Crown}
                      source={require("./image/PurpleCrown.png")}
                    />
                  </View>
                </View>
              )}
              {redTeam[i].key.toString() === pointMVP && (
                <View
                  style={{ top: -20, paddingStart: 5, position: "absolute" }}
                >
                  <View style={{ top: 28, right: 5, bottom: 0 }}>
                    <Image
                      style={styles.PlayerAvatar}
                      source={{ uri: game.players[i].avatar }}
                    />
                  </View>
                  <View style={{ top: -43, left: 65, width: 40, height: 40 }}>
                    <Image
                      style={styles.Crown}
                      source={require("./image/RedCrown.png")}
                    />
                  </View>
                </View>
              )}

              {/* With Crown end*/}
              <Text style={[styles.PlayerName, { marginLeft: 0 }]}>
                {redTeam[i].name + "\n"}
                {redTeam[i].dist > 1000
                  ? redTeam[i].dist / 1000 + "km"
                  : redTeam[i].dist + "m"}{" "}
                | {redTeam[i].points} pts
              </Text>
              <View style={{ marginStart: 10, marginEnd: 10 }}>
                <Text style={[styles.WinText, { color: "#FF8F62" }]}>
                  {"WIN"}
                </Text>
              </View>
            </View>
          </View>
        )
      );
    }
    return list;
  };

  if (!initializing)
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
        <>
          <View style={styles.headerContainer2}>
            <Text style={styles.headerText}>
              {`${game.hostName}'s Room`}
              {`\nRoom ID: ${game.gid}`}
            </Text>
            <Image
              style={styles.PlayerAvatar}
              source={{ uri: game.hostAvatar }}
            />
          </View>
          <View style={styles.playersListContainer}>
            <ScrollView>{playerView}</ScrollView>
          </View>
          <Button
            title={"Home"}
            containerStyle={styles.button}
            titleStyle={{ color: "white", fontSize: 24 }}
            buttonStyle={{ backgroundColor: color.brown }}
            onPress={() => {
              navigation.replace("Home");
            }}
          ></Button>
        </>
      </View>
    );
  else return null;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.offWhite,
    flex: 1,
  },
  headerContainer2: {
    width: width * 0.45,
    height: height * 0.1,
    flexDirection: "row",
    marginTop: height * 0.08,
    paddingRight: 40,
    marginBottom: height * 0.1,
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
  PlayerAvatar: {
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
  },
  LeftPlayer: {
    width: width * 0.4,
    height: height * 0.1,
    flexDirection: "row",
    backgroundColor: "#00000080",
    justifyContent: "flex-end",
    alignItems: "center",
    borderWidth: 3,
    borderLeftWidth: 0,
    borderBottomRightRadius: height * 0.05,
    borderTopRightRadius: height * 0.05,
    borderColor: "#98E7FD",
  },
  LeftPlayerWin: {
    width: width * 0.55,
    height: height * 0.1,
    flexDirection: "row",
    backgroundColor: "#00000080",
    justifyContent: "flex-end",
    alignItems: "center",
    borderWidth: 3,
    borderLeftWidth: 0,
    borderBottomRightRadius: height * 0.05,
    borderTopRightRadius: height * 0.05,
    borderColor: "#98E7FD",
  },
  RightPlayer: {
    width: width * 0.4,
    height: height * 0.1,
    flexDirection: "row",
    backgroundColor: "#00000080",
    justifyContent: "flex-start",
    alignItems: "center",
    borderWidth: 3,
    borderRightWidth: 0,
    borderBottomLeftRadius: height * 0.05,
    borderTopLeftRadius: height * 0.05,
    borderColor: "#FF8F62",
  },
  RightPlayerWin: {
    width: width * 0.55,
    height: height * 0.1,
    flexDirection: "row",
    backgroundColor: "#00000080",
    justifyContent: "flex-start",
    alignItems: "center",
    borderWidth: 3,
    borderRightWidth: 0,
    borderBottomLeftRadius: height * 0.05,
    borderTopLeftRadius: height * 0.05,
    borderColor: "#FF8F62",
  },
  PlayerName: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
    textAlign: "left",
    textAlignVertical: "center",
    flex: 3,
  },
  WinText: {
    fontFamily: "Arial",
    fontSize: 24,
    fontStyle: "normal",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
  },
  button: {
    height: 50,
    width: "50%",
    marginVertical: 50,
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
  backButton: {
    marginLeft: height / 6,
    borderRadius: height / 60,
    height: height / 15,
    width: height / 15,
    backgroundColor: color.brown,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginHorizontal: height / 80,
  },
  AddButton: {
    borderRadius: height / 30,
    height: height / 15,
    width: height / 15,
    borderWidth: 2,
    borderColor: "white",
    alignItems: "center",
    marginHorizontal: height / 80,
  },
  IconReplacementText: {
    fontSize: 30,
    color: "white",
    textAlignVertical: "center",
    justifyContent: "center",
  },
  Crown: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover",
  },
  map: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
});
