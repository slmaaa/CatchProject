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
import { Avatar, Button, Card, ListItem, Icon } from "react-native-elements";
import MMKVStorage from "react-native-mmkv-storage";
import { color } from "../constants.json";

var { height, width } = Dimensions.get("window");
var link =
  "https://images-na.ssl-images-amazon.com/images/S/pv-target-images/7bbe5762c79ee0ad11c1267483b4a2d5e12868de779eaf751e8e86596e978bbb._V_SX1080_.jpg";

export default GameOverScreen = ({ navigation }) => {
  const MMKV = new MMKVStorage.Loader().initialize();
  //const [game, setGame] = useState(MMKV.getMap("joinedGame"));
  const [roomInfo, setRoomInfo] = useState(null);
  const [playerView, setPlayersView] = useState([]);
  //   const gameID = MMKV.getString("gameID");
  //   const userID = MMKV.getString("userID");
  const gameID = "gameID";
  const userID = "userID";
  let game, status, distMVP, pointMVP;

  useEffect(() => {
    game = MMKV.getMap("joinedGame");
    distMVP = MMKV.getString("distMVP");
    pointMVP = MMKV.getString("pointMVP");
    setPlayersView(renderPlayersList());
    if (status === "RUNNING") {
      navigation.replace("InGame");
      return;
    }
  }, []);

  const renderPlayersList = () => {
    if (game.players.length === 0) return;
    let list = [],
      length = game.players.length,
      i;
    for (i = 0; i + 1 < length; i += 2) {
      list.push(
        game.winTeam == "BLUE" ? (
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
                  {game.players[i].name + "\n"}
                  {game.players[i].dist > 1000
                    ? game.players[i].dist / 1000 + "km"
                    : game.players[i].dist + "m"}{" "}
                  | {game.players[i].points} pts
                </Text>
              </View>
              <Image style={styles.PlayerAvatar} source={{ uri: link }} />
              {/* With Crown start*/}
              {game.players[i].key.toString() === distMVP && (
                <View
                  style={{ top: -20, paddingStart: 5, position: "absolute" }}
                >
                  <View style={{ top: 28, right: 5, bottom: 0 }}>
                    <Image style={styles.PlayerAvatar} source={{ uri: link }} />
                  </View>
                  <View style={{ top: -43, left: 25, width: 40, height: 40 }}>
                    <Image
                      style={styles.Crown}
                      source={require("./image/PurpleCrown.png")}
                    />
                  </View>
                </View>
              )}
              {game.players[i].key.toString() === pointMVP && (
                <View
                  style={{ top: -20, paddingStart: 5, position: "absolute" }}
                >
                  <View style={{ top: 28, right: 5, bottom: 0 }}>
                    <Image style={styles.PlayerAvatar} source={{ uri: link }} />
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
              <Image style={styles.PlayerAvatar} source={{ uri: link }} />
              {/* With Crown start*/}
              {game.players[i + 1].key.toString() === distMVP && (
                <View
                  style={{ top: -20, paddingStart: 5, position: "absolute" }}
                >
                  <View style={{ top: 28, right: 5, bottom: 0 }}>
                    <Image style={styles.PlayerAvatar} source={{ uri: link }} />
                  </View>
                  <View style={{ top: -43, left: 25, width: 40, height: 40 }}>
                    <Image
                      style={styles.Crown}
                      source={require("./image/PurpleCrown.png")}
                    />
                  </View>
                </View>
              )}
              {game.players[i + 1].key.toString() === pointMVP && (
                <View
                  style={{ top: -20, paddingStart: 5, position: "absolute" }}
                >
                  <View style={{ top: 28, right: 5, bottom: 0 }}>
                    <Image style={styles.PlayerAvatar} source={{ uri: link }} />
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
                {game.players[i + 1].name + "\n"}
                {game.players[i + 1].dist > 1000
                  ? game.players[i + 1].dist / 1000 + "km"
                  : game.players[i + 1].dist + "m"}{" "}
                | {game.players[i + 1].points} pts
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
                  {game.players[i].name + "\n"}
                  {game.players[i].dist > 1000
                    ? game.players[i].dist / 1000 + "km"
                    : game.players[i].dist + "m"}{" "}
                  | {game.players[i].points} pts
                </Text>
              </View>
              <Image style={styles.PlayerAvatar} source={{ uri: link }} />
              {/* With Crown start*/}
              {game.players[i].key.toString() === distMVP && (
                <View
                  style={{ top: -20, paddingStart: 5, position: "absolute" }}
                >
                  <View style={{ top: 28, right: 5, bottom: 0 }}>
                    <Image style={styles.PlayerAvatar} source={{ uri: link }} />
                  </View>
                  <View style={{ top: -43, left: 25, width: 40, height: 40 }}>
                    <Image
                      style={styles.Crown}
                      source={require("./image/PurpleCrown.png")}
                    />
                  </View>
                </View>
              )}
              {game.players[i].key.toString() === pointMVP && (
                <View
                  style={{ top: -20, paddingStart: 5, position: "absolute" }}
                >
                  <View style={{ top: 28, right: 5, bottom: 0 }}>
                    <Image style={styles.PlayerAvatar} source={{ uri: link }} />
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
              <Image style={styles.PlayerAvatar} source={{ uri: link }} />
              {/* With Crown start*/}
              {game.players[i + 1].key.toString() === distMVP && (
                <View
                  style={{ top: -20, paddingStart: 5, position: "absolute" }}
                >
                  <View style={{ top: 28, right: 5, bottom: 0 }}>
                    <Image style={styles.PlayerAvatar} source={{ uri: link }} />
                  </View>
                  <View style={{ top: -43, left: 25, width: 40, height: 40 }}>
                    <Image
                      style={styles.Crown}
                      source={require("./image/PurpleCrown.png")}
                    />
                  </View>
                </View>
              )}
              {game.players[i + 1].key.toString() === pointMVP && (
                <View
                  style={{ top: -20, paddingStart: 5, position: "absolute" }}
                >
                  <View style={{ top: 28, right: 5, bottom: 0 }}>
                    <Image style={styles.PlayerAvatar} source={{ uri: link }} />
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
                {game.players[i + 1].name + "\n"}
                {game.players[i + 1].dist > 1000
                  ? game.players[i + 1].dist / 1000 + "km"
                  : game.players[i + 1].dist + "m"}{" "}
                | {game.players[i + 1].points} pts
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

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer2}>
        <Text style={styles.headerText}>
          {`${game.hostName}'s Room`}
          {`\nRoom ID: ${game.gid}`}
        </Text>
        <Image style={styles.PlayerAvatar} source={{ uri: link }} />
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
          //wsSend(JSON.stringify({ header: "START", content: gameID }));
          console.log("Home");
        }}
      ></Button>
    </View>
  );
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
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "normal",
    paddingLeft: 10,
    textAlign: "left",
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
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderRightWidth: 5,
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
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderRightWidth: 5,
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
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
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
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
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
});
