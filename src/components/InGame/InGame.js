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

import * as defaultGetData from "../../data_from_server.json";
import fetchData from "../DataExchange/fetchData";
import React from "react";
import Geolocation from "react-native-geolocation-service";
import timestampToDate from "../Helper/timestampToDate";
import useInterval from "../Helper/useInterval";
import setEventText from "./setEventText";
import updateCPFlag from "./updateCPFlag";
import ActionButtons from "./ActionButtons";
import { color } from "../../constants.json";

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

const InGame = ({ navigation, route }) => {
  const [location, setLocation] = useState(null);
  const [actionButtonOption, setActionButtonOption] = useState(0);
  const [coolDown, setCoolDown] = useState(0);
  const [actionButtonDisable, setActionButtonDisable] = useState(false);
  let time = 0, //Time in Unix timestamp
    locationText = "", //Turn location data in text. For testing only
    currentCID = -1, //Current checkpoint id. -1 if not in any checkpoints
    postData = defaultPostData, //Data that needed to POST to server
    modalVisible = false,
    notificationText = "",
    getData = defaultGetData; //Data GET from server

  const actionButton = ActionButtons(
    1,
    1,
    () => {
      navigation.navigate("Riddle");
    },
    coolDown,
    actionButtonDisable
  );
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
    currentCID = updateCPFlag(
      location,
      currentCID,
      CP_LOCATION,
      CP_RANGE,
      NUM_OF_CP,
      RID
    );

    return () => {
      if (_watchId) {
        Geolocation.clearWatch(_watchId);
      }
    };
  }, [location]);

  useEffect(() => {
    if (route.params?.cd) {
      if (route.params?.cd == 0) {
        // add point to cp
      } else {
        setCoolDown(route.params.cd);
      }
    }
  }, [route.params?.cd]);
  useInterval(
    () => {
      setCoolDown(coolDown - 1);
    },
    coolDown == 0 ? null : 1000
  );
  useEffect(() => {
    if (coolDown != 0) setActionButtonDisable(true);
    else setActionButtonDisable(false);
  }, [coolDown]);
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
              zoomLevel={13}
              centerCoordinate={[
                CP_LOCATION[0].longitude,
                CP_LOCATION[0].latitude,
              ]}
              pitch={45}
            />
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
