import { useEffect, useRef, useState } from "react";
import { eventLog, playerStatus, score } from "../data_from_server.json";
import * as React from "react";
import Geolocation from "react-native-geolocation-service";
import { getDistance } from "geolib";
import timestampToDate from "./timestampToDate";
import printEventLog from "./printEventLog";
import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";

import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker";
mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken =
  "pk.eyJ1IjoiaGVjdG9yY2hjaCIsImEiOiJja205YmhldXUwdHQ1Mm9xbGw4N2RodndhIn0.yX90QKE2jcgG-7V5wOGXeQ";

import { PermissionsAndroid } from "react-native";

import {
  Text,
  View,
  Dimensions,
  Vibration,
  ScrollView,
  ProgressBar,
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
const SCORE_TARGET = 1000;

const InGame = (props) => {
  const [locationText, setLocationText] = useState("");
  const [location, setLocation] = useState("a");
  const [cpFlag, setCPFlag] = useState(-1);
  const [time, setTime] = useState(0);
  const [formattedTime, setFormattedTime] = useState("");
  const [scoreRed, setScoreRed] = useState(300);
  const [scoreBlue, setScoreBlue] = useState(300);
  const mapContainer = useRef();
  const [lng, setLng] = useState(114.263069);
  const [lat, setLat] = useState(22.334851);
  const [zoom, setZoom] = useState(18);
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
    setScoreRed(score[0]);
    setScoreBlue(score[1]);
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
      scrollZoom: false,
      dragRotate: false,
      dragPan: false,
    });

    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });
    return () => {
      map.remove();
      if (_watchId) {
        Geolocation.clearWatch(_watchId);
      }
    };
  }, [location]);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <div className="map-container" ref={mapContainer} />
      </View>
      <map />
      <View style={styles.scoreContainer}>
        <View style={styles.scoreBarContainer}>
          <ProgressBar
            color="red"
            trackColor="#F6CECE"
            progress={scoreRed / SCORE_TARGET}
            style={styles.scoreBar}
          />
          <ProgressBar
            color="#A9BCF5"
            trackColor="#2E64FE"
            progress={(SCORE_TARGET - scoreBlue) / SCORE_TARGET}
            style={styles.scoreBar}
          />
        </View>
        <View style={styles.score}>
          <Text style={styles.scoreRed}>{scoreRed}</Text>
          <Text style={styles.scoreBlue}>{scoreBlue}</Text>
        </View>
      </View>

      <View style={styles.eventLogContainer}>
        <Text>{printEventLog()}</Text>
      </View>
      <View style={styles.currentEnergyBarContainer}>
        <Text>Energy Bar</Text>
        <Text>{time}</Text>
        <Text>{locationText}</Text>
        <Text>{formattedTime}</Text>
        <Text>{cpFlag}</Text>
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
  map_container: {
    position: "absolute",
    height: 500,
    width: 500,
  },
  mapContainer: {
    flex: 0.6,
    justifyContent: "center",
    backgroundColor: "white",
  },
  scoreContainer: {
    flex: 0.1,
  },
  scoreBarContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
  },
  score: {
    flexDirection: "row",
  },
  scoreRed: {
    flex: 0.5,
    alignSelf: "flex-start",
    color: "black",
  },
  scoreBlue: {
    flex: 0.5,
    textAlign: "end",
    color: "black",
  },
  scoreBar: {
    flex: 0.5,
    height: 20,
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
