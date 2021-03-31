import { useEffect, useRef, useState } from "react";
import { eventLog } from "../data_from_server.json";
import { playerStatus } from "../data_from_server.json";
import * as React from "react";
import Geolocation from "react-native-geolocation-service";
import { getDistance } from "geolib";
import timestampToDate from "./timestampToDate";
import printEventLog from "./printEventLog";
import ProgressBar from "react-native-progress/Bar";
import { PermissionsAndroid } from "react-native";

import {
  Text,
  View,
  Dimensions,
  Vibration,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";

const NUM_OF_CP = 4;
const CP_LOCATION = [
  { latitude: 22.335083, longitude: 114.262832 },
  { latitude: 22.33459, longitude: 114.262834 },
  { latitude: 22.334605, longitude: 114.263299 },
  { latitude: 22.335091, longitude: 114.263291 },
];
const CP_RANGE = 5;

const InGame = (props) => {
  const [locationText, setLocationText] = useState("");
  const [location, setLocation] = useState("a");
  const [cpFlag, setCPFlag] = useState(-1);
  const [time, setTime] = useState(0);
  const [formattedTime, setFormattedTime] = useState("");
  console.log(printEventLog());
  useEffect(() => {
    const _watchId = Geolocation.watchPosition(
      (position) => {
        setLocation(position.coords);
        setTime(position.timestamp);
        let f = timestampToDate(position.timestamp);
        setFormattedTime(f);
        console.log("Location updated at " + f);
        setLocationText(
          "Latitude: " +
            JSON.stringify(position.coords.latitude) +
            "\n" +
            "Longitude: " +
            JSON.stringify(position.coords.longitude)
        );
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
    setCPFlag(-1);
    if (location != "a") {
      for (let i = 0; i < NUM_OF_CP; i++) {
        if (getDistance(location, CP_LOCATION[i]) <= CP_RANGE) {
          setCPFlag(i);
          break;
        }
      }
    }
    return () => {
      if (_watchId) {
        Geolocation.clearWatch(_watchId);
      }
    };
  }, [location]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <Text>{time}</Text>
        <Text>{locationText}</Text>
        <Text>{formattedTime}</Text>
        <Text>{cpFlag}</Text>
      </View>
      <View style={styles.scoreBarContainer}>
        <Progress.Bar progress={0.3} width={200} />
      </View>
      <View style={styles.eventLogContainer}>
        <Text>{printEventLog()}</Text>
      </View>
      <View style={styles.currentEnergyBarContainer}>
        <Text>Energy Bar</Text>
      </View>
      <View></View>
    </SafeAreaView>
  );
};

export default InGame;
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
  mapContainer: {
    flex: 0.6,
    justifyContent: "center",
    backgroundColor: "white",
  },
  scoreBarContainer: {
    flex: 0.1,
    backgroundColor: "white",
  },
  eventLogContainer: {
    flex: 0.15,
    backgroundColor: "white",
  },
  currentEnergyBarContainer: {
    flex: 0.15,
    backgroundColor: "white",
  },
});
