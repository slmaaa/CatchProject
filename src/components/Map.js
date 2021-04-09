import { useEffect, useRef, useState } from "react";
//import { Marker } from "react-map-gl";
import {
  cpEnergyLevel,
  eventLog,
  playerStatus,
  score,
} from "../data_from_server.json";
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
  Modal,
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
const TEAM = 0;

const InGame = (props) => {
  const [locationText, setLocationText] = useState("");
  const [location, setLocation] = useState("a");
  const [cpFlag, setCPFlag] = useState(-1);
  const [time, setTime] = useState(0);
  const [formattedTime, setFormattedTime] = useState("");
  const mapContainer = useRef();
  const [lng, setLng] = useState(114.263069);
  const [lat, setLat] = useState(22.334851);
  const [zoom, setZoom] = useState(18);
  const [eventLogText, setEventLogText] = useState("");
  const [eventLogPtr, setEventLogPtr] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [enegryBarArray, setEnergyBarArray] = useState([]);
  const [enegryBar, setEnergyBar] = useState();

  const setEventText = () => {
    let s = "";
    if (eventLogPtr >= 4) s += printEventLog(eventLogPtr - 4, true) + "\n";
    if (eventLogPtr >= 3) s += printEventLog(eventLogPtr - 3, true) + "\n";
    if (eventLogPtr >= 2) s += printEventLog(eventLogPtr - 2, true) + "\n";
    if (eventLogPtr >= 1) s += printEventLog(eventLogPtr - 1, true) + "\n";
    s += printEventLog(eventLogPtr, true);
    return s;
  };
  const renderEnergyBar = () => {
    if (playerStatus.cp != -1) {
      console.log(playerStatus.cp);
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

  const renderCaptureBar = () => {
    const BLUE = () => (
      <ProgressBar
        color="#A9BCF5"
        trackColor="#2E64FE"
        indeterminate
        style={styles.scoreBar}
      />
    );
    const RED = () => (
      <ProgressBar
        color="red"
        trackColor="#F6CECE"
        indeterminate
        style={styles.scoreBar}
      />
    );
    if (playerStatus.status == 0) {
      return <ProgressBar trackColor="grey" style={styles.scoreBar} />;
    } else if (playerStatus.status == 1) {
      return TEAM == 0 ? BLUE() : RED();
    } else if (playerStatus.status == 2) {
      return TEAM == 0 ? RED() : BLUE();
    }
  };

  useEffect(() => {
    setEnergyBar(renderEnergyBar());
  }, [enegryBarArray]);

  useEffect(() => {
    if (playerStatus.cp != -1) setEnergyBarArray(enegryArray());
  }, [playerStatus, cpEnergyLevel]);

  useEffect(() => {
    if (eventLogPtr < eventLog.length && !modalVisible) {
      setNotificationText(printEventLog(eventLogPtr));
      setModalVisible(true);
    }
    return () => {};
  }, [eventLogPtr]);

  useEffect(() => {
    var map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    var popup = new mapboxgl.Popup({ offset: 25 }).setText(
      cpEnergyLevel[0] < 0
        ? "Occuplied by Team Blue by " + cpEnergyLevel[0]
        : "Occuplied by Team Red by " + cpEnergyLevel[0]
    );

    // create DOM element for the marker
    var el = document.createElement("div");
    el.id = "marker";
    var popup1 = new mapboxgl.Popup({ offset: 25 }).setText(
      cpEnergyLevel[1] < 0
        ? "Occuplied by Team Blue by " + cpEnergyLevel[1]
        : "Occuplied by Team Red by " + cpEnergyLevel[1]
    );

    // create DOM element for the marker
    var el1 = document.createElement("div");
    el1.id = "marker";
    var popup2 = new mapboxgl.Popup({ offset: 25 }).setText(
      cpEnergyLevel[2] < 0
        ? "Occuplied by Team Blue by " + cpEnergyLevel[2]
        : "Occuplied by Team Red by " + cpEnergyLevel[2]
    );

    // create DOM element for the marker
    var el2 = document.createElement("div");
    el2.id = "marker2";
    var popup3 = new mapboxgl.Popup({ offset: 25 }).setText(
      cpEnergyLevel[3] < 0
        ? "Occuplied by Team Blue by " + cpEnergyLevel[3]
        : "Occuplied by Team Red by " + cpEnergyLevel[3]
    );

    // create DOM element for the marker
    var el3 = document.createElement("div");
    el3.id = "marker3";
    var marker = new mapboxgl.Marker({
      color: cpEnergyLevel[0] < 0 ? "#A9BCF5" : "#F6CECE",
    })
      .setLngLat([114.262832, 22.335083])
      .setPopup(popup)
      .addTo(map);
    var marker2 = new mapboxgl.Marker({
      color: cpEnergyLevel[1] < 0 ? "#A9BCF5" : "#F6CECE",
    })
      .setLngLat([114.262834, 22.33459])
      .setPopup(popup1)
      .addTo(map);
    var marker3 = new mapboxgl.Marker({
      color: cpEnergyLevel[2] < 0 ? "#A9BCF5" : "#F6CECE",
    })
      .setLngLat([114.263299, 22.334605])
      .setPopup(popup2)
      .addTo(map);
    var marker4 = new mapboxgl.Marker({
      color: cpEnergyLevel[3] < 0 ? "#A9BCF5" : "#F6CECE",
    })
      .setLngLat([114.263291, 22.335091])
      .setPopup(popup3)
      .addTo(map);
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );

    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });
    // var marker = new mapboxgl.Marker()
    // .setLngLat([22.335083, 114.262832])
    //  .addTo(map);
    return () => {
      map.remove();
    };
  }, []);

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
      <Modal
        animationType={"fade"}
        transparent
        visible={modalVisible}
        onShow={() => {
          setTimeout(() => {
            setModalVisible(false);
          }, 3000);
        }}
        onDismiss={() => {
          setEventLogPtr(eventLogPtr + 1);
          setEventLogText(setEventText());
        }}
      >
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationText}>{notificationText}</Text>
        </View>
      </Modal>
      <View style={styles.mapContainer}>
        <div className="map-container" ref={mapContainer} />
      </View>
      <map />
      <View style={styles.scoreContainer}>
        <View style={styles.scoreBarContainer}>
          <ProgressBar
            color="red"
            trackColor="#F6CECE"
            progress={score[0] / SCORE_TARGET}
            style={styles.scoreBar}
          />
          <ProgressBar
            color="#A9BCF5"
            trackColor="#2E64FE"
            progress={(SCORE_TARGET - score[1]) / SCORE_TARGET}
            style={styles.scoreBar}
          />
        </View>
        <View style={styles.score}>
          <Text style={styles.scoreRed}>{score[0]}</Text>
          <Text style={styles.scoreBlue}>{score[1]}</Text>
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

const enegryArray = () => {
  let tempArray = [];
  const energyLevel = cpEnergyLevel[playerStatus.cp];
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

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
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
    textAlign: "end",
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
