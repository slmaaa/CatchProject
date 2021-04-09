import { useEffect, useRef, useState } from "react";
import * as defaultGetData from "../data_from_server.json";
import * as defaultGetJSON from "../snapshot.json";
import FetchData from "./FetchData";
import * as React from "react";
import Geolocation from "react-native-geolocation-service";
import { getDistance } from "geolib";
import timestampToDate from "./timestampToDate";
import useInterval from "./useInterval";

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
  const [time, setTime] = useState(0);
  const [formattedTime, setFormattedTime] = useState("");
  const [lng, setLng] = useState(114.263069);
  const [lat, setLat] = useState(22.334851);
  const [zoom, setZoom] = useState(18);
  const [eventLogText, setEventLogText] = useState("");
  const [eventLogPtr, setEventLogPtr] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [enegryBarArray, setEnergyBarArray] = useState([]);
  const [enegryBar, setEnergyBar] = useState();
  const [getData, setGetData] = useState(defaultGetData);
  const [postData, setPostData] = useState(defaultPostData);
  const [lastJSON, setLastJSON] = useState(null);

  let markers = [],
    popups = [];

  const post = () => {
    fetch("http://localhost:3001/posting", {
      method: "POST", // or 'PUT'
      body: JSON.stringify(postData), // data can be `string` or {object}!
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((res) => res.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => console.log("Success:", response));
  };

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

  const setEventText = () => {
    let s = "";
    if (eventLogPtr >= 4) s += getData.eventLog[eventLogPtr - 4] + "\n";
    if (eventLogPtr >= 3) s += getData.eventLog[eventLogPtr - 3] + "\n";
    if (eventLogPtr >= 2) s += getData.eventLog[eventLogPtr - 2] + "\n";
    if (eventLogPtr >= 1) s += getData.eventLog[eventLogPtr - 1] + "\n";
    s += getData.eventLog[eventLogPtr] + "\n";
    console.log(1);
    return s;
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
    if (getData.playerStatus.status == 0) {
      return <ProgressBar trackColor="grey" style={styles.scoreBar} />;
    } else if (getData.playerStatus.status == -1) {
      return TEAM === "Red" ? BLUE() : RED();
    } else if (getData.playerStatus.status == 1) {
      return TEAM == "Red" ? RED() : BLUE();
    } else if (getData.playerStatus.status == 2)
      return TEAM === "Red" ? (
        <ProgressBar trackColor="red" style={styles.scoreBar} />
      ) : (
        <ProgressBar trackColor="#A9BCF5" style={styles.scoreBar} />
      );
  };

  useEffect(() => {
    var map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    popups[0] = new mapboxgl.Popup({ offset: 25 }).setText(
      getData.cpEnergyLevel[0] < 0
        ? "Occuplied by Team Blue by " + getData.cpEnergyLevel[0]
        : "Occuplied by Team Red by " + getData.cpEnergyLevel[0]
    );

    // create DOM element for the marker
    popups[1] = new mapboxgl.Popup({ offset: 25 }).setText(
      getData.cpEnergyLevel[1] < 0
        ? "Occuplied by Team Blue by " + getData.cpEnergyLevel[1]
        : "Occuplied by Team Red by " + getData.cpEnergyLevel[1]
    );

    popups[2] = new mapboxgl.Popup({ offset: 25 }).setText(
      getData.cpEnergyLevel[2] < 0
        ? "Occuplied by Team Blue by " + getData.cpEnergyLevel[2]
        : "Occuplied by Team Red by " + getData.cpEnergyLevel[2]
    );

    popups[3] = new mapboxgl.Popup({ offset: 25 }).setText(
      getData.cpEnergyLevel[3] < 0
        ? "Occuplied by Team Blue by " + getData.cpEnergyLevel[3]
        : "Occuplied by Team Red by " + getData.cpEnergyLevel[3]
    );
    markers[0] = new mapboxgl.Marker({
      color: getData.cpEnergyLevel[0] < 0 ? "#A9BCF5" : "#F6CECE",
    })
      .setLngLat([114.262832, 22.335083])
      .setPopup(popups[0])
      .addTo(map);
    markers[1] = new mapboxgl.Marker({
      color: getData.cpEnergyLevel[1] < 0 ? "#A9BCF5" : "#F6CECE",
    })
      .setLngLat([114.262834, 22.33459])
      .setPopup(popups[1])
      .addTo(map);
    markers[2] = new mapboxgl.Marker({
      color: getData.cpEnergyLevel[2] < 0 ? "#A9BCF5" : "#F6CECE",
    })
      .setLngLat([114.263299, 22.334605])
      .setPopup(popups[2])
      .addTo(map);
    markers[3] = new mapboxgl.Marker({
      color: getData.cpEnergyLevel < 0 ? "#A9BCF5" : "#F6CECE",
    })
      .setLngLat([114.263291, 22.335091])
      .setPopup(popups[3])
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
    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (getData != null) {
      setEnergyBar(renderEnergyBar());
    }
  }, [enegryBarArray]);

  useInterval(() => {
    FetchData(setGetData, getData, lastJSON, setLastJSON, RID);
  }, 1000);

  useEffect(() => {
    if (getData != null) {
      if (getData.playerStatus.cp != -1) setEnergyBarArray(enegryArray());
    }
  }, [lastJSON]);

  useEffect(() => {
    if (getData != null) {
      if (eventLogPtr < getData.eventLog.length && !modalVisible) {
        setNotificationText(
          getData.eventLog[eventLogPtr].slice(
            9,
            getData.eventLog[eventLogPtr].length
          )
        );
        setModalVisible(true);
      }
    }
    return () => {};
  }, [eventLogPtr, lastJSON]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });

    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });
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
    var flag = false;
    if (location != null) {
      for (let i = 0; i < NUM_OF_CP; i++) {
        if (getDistance(location, CP_LOCATION[i]) <= CP_RANGE) {
          if (currentCID == -1) {
            setPostData({
              rid: RID,
              CID: i,
              time: new Date().getTime,
              is_in: true,
            });
            post();
          }
          setCurrentCID(i);
          flag = true;
          break;
        }
      }
      if (!flag) {
        if (currentCID != -1) {
          setPostData({
            rid: RID,
            CID: currentCID,
            time: new Date().getTime,
            is_in: false,
          });
        }
        setCurrentCID(-1);
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
            progress={getData.score[0] / SCORE_TARGET}
            style={styles.scoreBar}
          />
          <ProgressBar
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
