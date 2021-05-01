import { useEffect, useRef, useState } from "react";
import * as Progress from "react-native-progress";
import MapboxGL from "@react-native-mapbox-gl/maps";
MapboxGL.setAccessToken(
  "pk.eyJ1IjoiaGVjdG9yY2hjaCIsImEiOiJja205YmhldXUwdHQ1Mm9xbGw4N2RodndhIn0.yX90QKE2jcgG-7V5wOGXeQ"
);
import {
  Text,
  View,
  Dimensions,
  Modal,
  Vibration,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { Overlay } from "react-native-elements";
import MMKVStorage from "react-native-mmkv-storage";

import fetchData from "../DataExchange/fetchData";
import React from "react";
import Geolocation from "react-native-geolocation-service";
import timestampToDate from "../Helper/timestampToDate";
import useInterval from "../Helper/useInterval";
import setEventText from "./setEventText";
import updateCPFlag from "./updateCPFlag";
import ActionButtons from "./ActionButtons";
import { wsSend } from "../../App";
import { color } from "../../constants.json";

const CP_RANGE = 5;
const SCORE_TARGET = 1000;
const InGame = ({ navigation, route }) => {
  const MMKV = new MMKVStorage.Loader().initialize();

  const [location, setLocation] = useState(null);
  const [actionButton, setActionButton] = useState(null);
  const [actionButtonOption, setActionButtonOption] = useState(0);
  const [coolDown, setCoolDown] = useState([0, 0, 0, 0]);
  const [currentCoolDown, setCurrentCoolDown] = useState(-1);
  const [actionButtonDisable, setActionButtonDisable] = useState(false);
  const [cpCompletetionLevel, setCPCompletionLevel] = useState([3]);
  const [currentCID, setCurrentCID] = useState(-1); //Current checkpoint id. -1 if not in any checkpoints
  let time = 0, //Time in Unix timestamp
    locationText = "", //Turn location data in text. For testing only
    modalVisible = false,
    notificationText = "",
    getData = defaultGetData; //Data GET from server
  let game,
    team,
    checkpointsLocation = [],
    checkpointsLevel = [],
    numberOfCheckpoints = 0,
    gameInfo;
  // Location wathcher, update location and post when CPFlag changes
  useEffect(() => {
    const _watchId = Geolocation.watchPosition(
      (position) => {
        setLocation(position.coords);
        time = position.timestamp;
        if (location != null) {
          locationText =
            "Latitude: " +
            JSON.stringify(location.latitude) +
            "\n" +
            "Longitude: " +
            JSON.stringify(location.longitude);
        }
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        distanceFilter: 1,
        interval: 100000,
        fastestInterval: 100000,
      }
    );
    if (location != null) {
      setCurrentCID(
        updateCPFlag(
          location,
          checkpointsLocation,
          CP_RANGE,
          numberOfCheckpoints
        )
      );
    }
    return () => {
      if (_watchId) {
        Geolocation.clearWatch(_watchId);
      }
    };
  }, [location]);

  useInterval(() => {
    gameInfo = MMKV.getMap("gameInfo");
  }, 100);

  useEffect(() => {
    game = MMKV.getMap("joinedGame");
    team = MMKV.getString("team");
    game.checkpoints.map((val) => {
      checkpointsLocation.push({
        latitude: val.area.center.lat,
        longitude: val.area.center.lng,
      });
    });
    numberOfCheckpoints = game.checkpoints.length;
  }, []);

  useEffect(() => {
    game.status = gameInfo.status;
    for (let i = 0; i < game.checkpoints, length; i++) {
      game.checkpoints[i].level = gameInfo.cpsLevel;
    }
    console.log(gameInfo);
  }, [gameInfo]);

  useEffect(() => {
    if (game.status == "END") {
      console.log(game.status);
    }
  }, [game.status]);

  useEffect(() => {
    setActionButton(
      ActionButtons(
        currentCID == -1 ? "NOT_IN_CP" : "MATH",
        currentCID == -1 ? 0 : game.checkponts[currentCID].level[team],
        () => {
          navigation.navigate("Riddle");
        },
        coolDown[currentCID],
        actionButtonDisable,
        currentCID
      )
    );
  }, [currentCID, game, actionButtonDisable]);

  useEffect(() => {
    if (route.params?.cd) {
      if (route.params?.cd == -1) {
        wsSend(
          JSON.stringify({
            header: "ADD",
            content: { gid: game[gid], team: team, cid: currentCID },
          })
        );
      } else {
        let newState = coolDown;
        newState[currentCID] = route.params?.cd;
        setCoolDown([...newState]);
        setCurrentCoolDown(currentCID);
      }
    }
  }, [route.params?.cd]);

  useInterval(
    () => {
      let newState = coolDown;
      newState[currentCoolDown]--;
      setCoolDown([...newState]);
      if (coolDown[currentCoolDown] == 0) setCurrentCoolDown(-1);
    },
    currentCoolDown == -1 ? null : 1000
  );
  useEffect(() => {
    if (currentCoolDown != currentCID) {
      setActionButtonDisable(false);
    } else if (coolDown[currentCID] != 0) {
      setActionButtonDisable(true);
    }
  }, [coolDown, currentCID, currentCoolDown]);
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
              modalVisible = false;
            }, 3000);
          }}
          onDismiss={() => {
            eventLogPtr++;
            setEventLogText(setEventText(getData.eventLog));
          }}
        >
          <View style={styles.notificationContainer}>
            <Text style={styles.notificationText}>{notificationText}</Text>
          </View>
        </Modal>
        <View style={styles.mapContainer}>
          <MapboxGL.MapView
            style={styles.map}
            styleURL={"mapbox://styles/mapbox/dark-v10"}
            logoEnabled={false}
          >
            <MapboxGL.Camera
              defaultSettings={{
                zoomLevel: 18,
                centerCoordinate: [
                  CP_LOCATION[0].longitude,
                  CP_LOCATION[0].latitude,
                ],
                pitch: 45,
              }}
            />
            <MapboxGL.UserLocation />
          </MapboxGL.MapView>
        </View>
        <View style={styles.actionButtonView}>{actionButton}</View>
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
  actionButtonView: {
    position: "absolute",
    bottom: "5%",
    alignContent: "center",
    left: "25%",
    height: 60,
    width: "50%",
  },
});
