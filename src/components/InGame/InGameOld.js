import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
import * as Progress from "react-native-progress";
import {
  Text,
  View,
  Dimensions,
  Modal,
  Vibration,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";

import * as defaultGetData from "../../data_from_server.json";
import fetchData from "../DataExchange/fetchData";
import React from "react";
import Geolocation from "react-native-geolocation-service";
import { getDistance } from "geolib";
import timestampToDate from "../Helper/timestampToDate";
import useInterval from "../Helper/useInterval";
import post from "../DataExchange/post";
import setEventText from "./setEventText";

const RID = "GG01-PP02";

const NUM_OF_CP = 4;
const CP_LOCATION = [
  { latitude: 22.335083, longitude: 114.262832 },
  { latitude: 22.33459, longitude: 114.262834 },
  { latitude: 22.334605, longitude: 114.263299 },
  { latitude: 22.335091, longitude: 114.263291 },
];
const CP_RANGE = 5;
const SCORE_TARGET = 1000;
const TEAM = "Red";

const defaultPostData = {
  rid: RID,
  CID: -1,
  time: 0,
  is_in: null,
};

const InGame = () => {
  const mapContainer = useRef();

  const [locationText, setLocationText] = useState("");
  const [location, setLocation] = useState(null);
  const [currentCID, setCurrentCID] = useState(-1);
  const [formattedTime, setFormattedTime] = useState("");
  const [lng, setLng] = useState(114.263069);
  const [lat, setLat] = useState(22.334851);
  const [zoom, setZoom] = useState(18);
  const [eventLogText, setEventLogText] = useState("");
  const [enegryBarArray, setEnergyBarArray] = useState([]);
  const [enegryBar, setEnergyBar] = useState();
  const [getData, setGetData] = useState(defaultGetData);
  const [postData, setPostData] = useState(defaultPostData);
  const [lastJSON, setLastJSON] = useState(null);
  let time = 0,
    modalVisible = false,
    eventLogPtr = 0,
    notificationText = "";

  let markers = [],
    popups = [];

  const enegryArray = () => {
    let tempArray = [];
    const energyLevel = getData.cpEnergyLevel[getData.playerStatus.cp];
    let i;
    for (i = 0; i < Math.abs(energyLevel); i++) {
      energyLevel > 0
        ? tempArray.push({ key: i, color: "#2E64FE" })
        : tempArray.push({ key: i, color: "red" });
    }
    for (; i < 10; i++) {
      tempArray.push({ key: i, color: "white" });
    }

    return tempArray;
  };

  const renderEnergyBar = () => {
    if (getData.playerStatus.cp != -1) {
      return enegryBarArray.map((item) => {
        return (
          <View
            style={[styles.enegryBar, { backgroundColor: item.color }]}
            key={item.key}
          ></View>
        );
      });
    } else {
      return <Text>Hurry to next CP</Text>;
    }
  };

  useEffect(() => {
    if (getData != null) {
      setEnergyBar(renderEnergyBar());
    }
  }, [enegryBarArray]);

  /*useInterval(() => {
    fetchData(setGetData, getData, lastJSON, setLastJSON, RID);
  }, 1000);*/

  useEffect(() => {
    if (getData != null) {
      if (getData.playerStatus.cp != -1) setEnergyBarArray(enegryArray());
    }
  }, [lastJSON]);

  useEffect(() => {
    if (getData != null) {
      if (eventLogPtr < getData.eventLog.length && !modalVisible) {
        notificationText = getData.eventLog[eventLogPtr].slice(
          9,
          getData.eventLog[eventLogPtr].length
        );
        modalVisible = true;
      }
    }
    return () => {};
  }, [eventLogPtr, lastJSON]);

  return (
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
          setEventLogText(setEventText());
        }}
      >
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>{notificationText}</Text>
        </View>
      </Modal>
      <View style={styles.mapContainer}></View>
      <View style={styles.scoreContainer}>
        <View style={styles.scoreBarContainer}>
          <Progress.Bar
            color="red"
            trackColor="#F6CECE"
            progress={getData.score[0] / SCORE_TARGET}
            style={styles.scoreBar}
          />
          <Progress.Bar
            color="#A9BCF5"
            trackColor="#2E64FE"
            progress={(SCORE_TARGET - getData.score[1]) / SCORE_TARGET}
            style={styles.scoreBar}
          />
        </View>
        <View style={styles.score}>
          <Text style={styles.scoreRed}>{getData.score[0]}</Text>
          <Text style={styles.scoreBlue}>{getData.score[1]}</Text>
        </View>
      </View>

      <View style={styles.eventLogContainer}>
        <Text>{eventLogText}</Text>
      </View>
      <View style={styles.playerStatusContainer}>
        <View style={styles.currentEnergyBar}>{enegryBar}</View>
        <View style={styles.captureAlertContainer}>{renderCaptureBar()}</View>
      </View>
    </SafeAreaView>
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
    textAlign: "right",
    color: "black",
  },
  scoreBar: {
    flex: 0.5,
    height: 50,
  },
  eventLogContainer: {
    flex: 0.15,
    backgroundColor: "white",
  },
  playerStatusContainer: {
    flex: 0.15,
    backgroundColor: "white",
  },
  currentEnergyBar: {
    flexDirection: "row",
    flex: 0.75,
  },
  enegryBar: {
    flex: 0.1,
    height: "80%",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  captureAlertContainer: {
    flex: 0.25,
  },
});
