/* eslint-disable quotes */
import { useEffect, useRef, useState, useCallback } from "react";
import { getDistance } from "geolib";
import * as Progress from "react-native-progress";
import MapboxGL from "@react-native-mapbox-gl/maps";
const MMKV = new MMKVStorage.Loader().initialize();
import RNLocation, { Location } from "react-native-location";
import database from "@react-native-firebase/database";

MapboxGL.setAccessToken(
  "pk.eyJ1IjoiaGVjdG9yY2hjaCIsImEiOiJja205YmhldXUwdHQ1Mm9xbGw4N2RodndhIn0.yX90QKE2jcgG-7V5wOGXeQ"
);
import {
  Text,
  View,
  Dimensions,
  Vibration,
  Modal,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";

import MMKVStorage from "react-native-mmkv-storage";
import React from "react";
import useInterval from "../Helper/useInterval";
import { wsSend } from "../../App";
import { color } from "../../constants.json";
import { Button, Overlay, Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/core";

const { height, width } = Dimensions.get("window");
const CP_RANGE = 8;
const InGame = ({ navigation, route }) => {
  const MMKV = new MMKVStorage.Loader().initialize();
  const [initializing, setInitializing] = useState(true);

  const gameInfo = useRef();
  const [location, setLocation] = useState(null);
  const [lastLocation, setLastLocation] = useState(null);
  const [gameOverAccountingVisible, setGameOverAccountingVisible] = useState(
    false
  );
  const [challengesSolved, setChallengesSolved] = useState(0);
  const [notificationText, setNotificationText] = useState("");
  const distanceTravelled = useRef(0);
  const [checkpointsCaptured,setCheckpointsCaptured] = useState([]);
  const [distanceCovered, setDistanceCovered] = useState(0);
  const [currentCID, setCurrentCID] = useState(-1); //Current checkpoint id. -1 if not in any checkpoints
  const [modalVisible, setModalVisible] = useState(false);
  const locationRecord = useRef([]);
  const mapRef = useRef();
  const messageRef = useRef([]);
  const gameRef = useRef({
    game: null,
    team: null,
    checkpointsLocation: null,
    numberOfCheckpoints: null,
  });
  const renderCheckpointsOnMap = () => {
    let cpRenderList = [];
    for (let i = 0; i < gameRef.current.numberOfCheckpoints; i++) {
      checkpointsCaptured[i] === null
        ? cpRenderList.push(
            <>
              <MapboxGL.MarkerView
                id={"CP" + i}
                key={i + "m"}
                coordinate={[
                  gameRef.current.checkpointsLocation[i].longitude,
                  gameRef.current.checkpointsLocation[i].latitude,
                ]}
              >
                <View
                  style={{
                    width: 50,
                    height: 100,
                    backgroundColor: "#FFFFFF00",
                  }}
                >
                  <Progress.Bar
                    progress={
                      gameRef.current.game.checkpoints[i].level.BLUE /
                      gameRef.current.game.checkpoints[i].maxLevel
                    }
                    color={color.teamBlue}
                    width={50}
                  />
                  <Progress.Bar
                    progress={
                      gameRef.current.game.checkpoints[i].level.RED /
                      gameRef.current.game.checkpoints[i].maxLevel
                    }
                    width={50}
                    color={color.teamRed}
                  />
                </View>
              </MapboxGL.MarkerView>
              <MapboxGL.PointAnnotation
                id={"CP" + i}
                key={i + "p"}
                coordinate={[
                  gameRef.current.checkpointsLocation[i].longitude,
                  gameRef.current.checkpointsLocation[i].latitude,
                ]}
              />
            </>
          )
        : checkpointsCaptured[i] === "BLUE"
        ? cpRenderList.push(
            <MapboxGL.PointAnnotation
              id={"CP" + i}
              key={i + "p"}
              coordinate={[
                gameRef.current.checkpointsLocation[i].longitude,
                gameRef.current.checkpointsLocation[i].latitude,
              ]}
            >
              <View
                style={{
                  height: 50,
                  width: 50,
                  backgroundColor: "#00000000",
                }}
              >
                <Image source={require("../../../assets/img/blue-flag.png")} />
              </View>
            </MapboxGL.PointAnnotation>
          )
        : cpRenderList.push(
            <MapboxGL.PointAnnotation
              id={"CP" + i}
              key={i + "p"}
              coordinate={[
                gameRef.current.checkpointsLocation[i].longitude,
                gameRef.current.checkpointsLocation[i].latitude,
              ]}
            >
              <View
                style={{
                  height: 50,
                  width: 50,
                  backgroundColor: "#00000000",
                }}
              >
                <Image source={require("../../../assets/img/red-flag.png")} />
              </View>
            </MapboxGL.PointAnnotation>
          );
    }
    return cpRenderList;
  };
  useEffect(() => {
    if (!initializing) return;
    const game = MMKV.getMap("joinedGame");
    gameRef.current.game = game;
    gameRef.current.team = MMKV.getString("team");
    let coolDowns = [],
      checkpointsLocation = [],
      capturedList = [];
    game.checkpoints.map((val) => {
      checkpointsLocation.push({
        latitude: val.area.center.lat,
        longitude: val.area.center.lng,
      });
     capturedList.push(null);
     setCheckpointsCaptured(capturedList);
      coolDowns.push(-1);
    });
    gameRef.current.checkpointsLocation = checkpointsLocation;
    gameRef.current.numberOfCheckpoints = game.checkpoints.length;
    MMKV.setArray("cpCooldowns", coolDowns);
    MMKV.setInt("challengesSolved", 0);
    setInitializing(false);
    console.log(gameRef.current.game.checkpoints);
  }, []);
  useEffect(() => {
    let unsub;
    RNLocation.configure({
      distanceFilter: 0, //meters
      desiredAccuracy: {
        ios: "best",
        // highAccuracy
        // balancedPowerAccuracy
        android: "highAccuracy",
      },
      // Android only
      androidProvider: "auto",
      interval: 10, // Milliseconds
      fastestInterval: 10, // Milliseconds
      maxWaitTime: 10, // Milliseconds
      // iOS Only
      activityType: "other",
      allowsBackgroundLocationUpdates: false,
      headingFilter: 1, // Degrees
      headingOrientation: "portrait",
      pausesLocationUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: false,
    });
    RNLocation.requestPermission({
      ios: "whenInUse",
      android: {
        detail: "fine",
      },
    }).then((granted) => {
      if (granted) {
        unsub = RNLocation.subscribeToLocationUpdates((locations) => {
          // console.log("locations", locations)
          if (locations !== undefined && locations.length > 0) {
            setLocation(locations[0]);
            if (locationRecord.current.length === 0) {
              locationRecord.current.push(locations[0]);
            } else {
              const dist = getDistance(
                [
                  locationRecord.current[locationRecord.current.length - 1]
                    .longitude,
                  locationRecord.current[locationRecord.current.length - 1]
                    .latitude,
                ],
                [locations[0].longitude, locations[0].latitude]
              );
              if (dist >= 10) {
                locationRecord.current.push(locations[0]);
                distanceTravelled.current += dist;
              }
            }
          }
        });
      }
    });
    return function cleanup() {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (gameRef.current.game.status === "OVER") return;
    if (location !== null) {
      let flag, newCID;
      for (let i = 0; i < gameRef.current.numberOfCheckpoints; i++) {
        if (
          Math.abs(
            getDistance(
              {
                latitude: location.latitude,
                longitude: location.longitude,
              },
              gameRef.current.checkpointsLocation[i]
            )
          ) <= CP_RANGE
        ) {
          newCID = i;
          flag = true;
          break;
        }
      }
      if (!flag) {
        newCID = -1;
      }
      setCurrentCID(newCID);
    }
  }, [location]);

  useEffect(() => {
    if (gameRef.current.game.status === "OVER") return;
    if (currentCID === -1) {
      navigation.navigate("InGame");
      return;
    }
    if (checkpointsCaptured[currentCID] === null) {
      navigation.navigate("Maths", {
        cpName: gameRef.current.game.checkpoints[currentCID].name,
        gid: gameRef.current.game.gid,
        team: gameRef.current.team,
        cid: currentCID,
      });
    } else {
      navigation.navigate("InGame");
    }
  }, [currentCID, gameRef.current]);

  useInterval(() => {
    setDistanceCovered(distanceTravelled.current);
    gameInfo.current = MMKV.getMap("gameInfo");
  }, 100);

  useFocusEffect(
    useCallback(() => {
      if (gameRef.current.game.status === "OVER") return;
      if (gameInfo.current === null|| gameInfo.current ===undefined) {
        return;
      }
      gameRef.current.game.status = gameInfo.current.status;
      for (let i = 0; i < gameRef.current.numberOfCheckpoints; i++) {
        gameRef.current.game.checkpoints[i].level =
          gameInfo.current.cpsLevel[i];
      }
      setCheckpointsCaptured(gameInfo.current.cpsCaptured);
      let list = messageRef.current;
      list.push();
      list.push(gameInfo.current.message);
      messageRef.current = list;
      MMKV.setMap("joinedGame", gameRef.current.game);
      gameInfo.current = null;
      MMKV.setMap("gameInfo", null);
      if (gameRef.current.game.status === "OVER") {
        setGameOverAccountingVisible(true);
        wsSend(
          JSON.stringify({
            header: "PLAYER_STATS",
            content: {
              gid: gameRef.current.game.gid.toString(),
              key: MMKV.getInt("key").toString(),
              points: MMKV.getInt("challengesSolved").toString(),
              dist: distanceTravelled.current.toString(),
            },
          })
        ).then(() => {
          let interval = setInterval(() => {
            const endStats = MMKV.getMap("endStats");
            if (endStats == null) return;
            clearInterval(interval);
            gameRef.current.game.players = endStats.players;
            gameRef.current.game.winTeam = endStats.winTeam;
            gameRef.current.game.startTime = endStats.startTime;
            gameRef.current.game.endTime = endStats.endTime;
            MMKV.setMap("joinedGame", gameRef.current.game);
            MMKV.setString("pointMVP", endStats.pointMVP.toString());
            MMKV.setString("distMVP", endStats.distMVP.toString());
            database()
              .ref("users/" + MMKV.getString("userID") + "/gameRecord")
              .push({
                gameID: gameRef.current.gid,
                locationRecord: locationRecord.current,
                startTime: endStats.startTime,
                endTime: endStats.endTime,
                distance: distanceTravelled.current.toString(),
                pointMVP: endStats.pointMVP.toString(),
                distMVP: endStats.distMVP.toString(),
                game: gameRef.current.game,
              })
              .then(() => {
                navigation.replace("GameOver");
              });
          }, 100);
        });
      }
    }, [gameInfo.current])
  );

  useEffect(() => {
    if (modalVisible || messageRef.current.length === 0) return;
    setNotificationText(messageRef.current.shift());
    setModalVisible(true);
  });

  useFocusEffect(() => {
    setChallengesSolved(MMKV.getInt("challengesSolved"));
  });

  if (initializing) return null;
  else
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <Modal
            animationType={"fade"}
            transparent
            visible={modalVisible}
            onShow={() => {
              setTimeout(() => {
                setModalVisible(false);
              }, 3000);
            }}
          >
            <View
              style={[
                styles.notificationContainer,
                {
                  borderBottomWidth: 5,
                  borderColor:
                    notificationText[1] === "BLUE"
                      ? color.teamBlue
                      : color.teamRed,
                },
              ]}
            >
              <Text style={styles.notificationText}>{notificationText[0]}</Text>
            </View>
          </Modal>
          <Overlay
            isVisible={gameOverAccountingVisible}
            overlayStyle={{ width: "80%", borderRadius: 30 }}
          >
            <Text style={styles.creatingText}>Game Over.</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                margin: 5,
              }}
            >
              <Progress.CircleSnail
                indeterminate
                size={100}
                thickness={7}
                color={[color.teamRed, color.teamBlue]}
              />
            </View>
          </Overlay>
          <View style={styles.mapContainer}>
            <MapboxGL.MapView
              ref={mapRef}
              style={styles.map}
              pitchEnabled={false}
              rotateEnabled={false}
              compassEnabled={false}
              scrollEnabled={false}
            >
              <MapboxGL.Camera
                followUserLocation={true}
                followUserMode={"normal"}
                defaultSettings={{
                  zoomLevel: 17,
                }}
              />
              {renderCheckpointsOnMap()}
              <MapboxGL.UserLocation />
            </MapboxGL.MapView>
          </View>
          <View
            style={[
              styles.playerStatsBar,
              {
                borderColor:
                  gameRef.current.team === "BLUE"
                    ? color.teamBlue
                    : color.teamRed,
              },
            ]}
          >
            <View style={styles.profilePictureContainer}>
              <Image
                style={styles.headerPlayerAvatar}
                source={{ uri: MMKV.getString("userAvatar") }}
              />
            </View>
            <Text style={[styles.playerStatsText, { textAlign: "left" }]}>
              {MMKV.getString("userName")}
            </Text>
            <Text style={[styles.playerStatsText, { textAlign: "right" }]}>
              {distanceCovered > 1000
                ? distanceCovered / 1000 + "km"
                : distanceCovered + "m"}{" "}
              | {challengesSolved} pts
            </Text>
          </View>
          <Button
            disabled={
              currentCID !== -1
                ? false
                : checkpointsCaptured[currentCID] === null
                ? true
                : false
            }
            icon={
              <Icon
                name="circle-edit-outline"
                type={"material-community"}
                color={"white"}
                size={height / 15}
              />
            }
            containerStyle={styles.addButton}
            buttonStyle={{ backgroundColor: color.brown, borderRadius: 60 }}
            onPress={() => {
              navigation.navigate("Maths", {
                cpName: gameRef.current.game.checkpoints[currentCID].name,
                gid: gameRef.current.game.gid,
                team: gameRef.current.team,
                cid: currentCID,
              });
            }}
          />
        </SafeAreaView>
      </>
    );
};

export default InGame;
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    backgroundColor: "black",
  },
  notificationContainer: {
    position: "absolute",
    left: "10%",
    width: "80%",
    backgroundColor: "#D32F2F",
    borderRadius: 10,
    height: "8%",
    justifyContent: "center",
    alignSelf: "center",
  },
  notificationText: {
    color: "black",
    textAlign: "center",
    textAlignVertical: "center",
  },
  mapContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#263238",
  },
  map: {
    flex: 1,
  },
  notificationContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    height: "8%",
    justifyContent: "center",
    alignSelf: "center",
  },
  notificationText: {
    color: "black",
    textAlign: "center",
    textAlignVertical: "center",
  },
  playerStatsBar: {
    position: "absolute",
    width: "60%",
    top: height * 0.03,
    height: height * 0.1,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    right: 0,
    borderWidth: 3,
    borderRightWidth: 0,
    backgroundColor: color.transBlack,
    alignItems: "center",
    flexDirection: "row",
  },
  headerPlayerAvatar: {
    borderRadius: height / 30,
    height: height / 15,
    width: height / 15,
    marginHorizontal: height / 60,
  },
  playerStatsText: {
    fontSize: 13,
    fontWeight: "700",
    color: "white",
    textAlignVertical: "center",
    marginHorizontal: 5,
  },
  actionButtonView: {
    position: "absolute",
    bottom: "5%",
    alignContent: "center",
    left: "25%",
    height: 60,
    width: "50%",
  },
  marker: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
  addButton: {
    position: "absolute",
    top: height * 0.9,
    alignSelf: "center",
    color: color.brown,
    borderRadius: height / 15,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.37,
    shadowRadius: height / 15,
    elevation: 5,
  },
});
