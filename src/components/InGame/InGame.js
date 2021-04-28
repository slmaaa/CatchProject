/* eslint-disable quotes */
import { useEffect, useRef, useState } from "react";
import { getDistance } from "geolib";
import * as Progress from "react-native-progress";
import MapboxGL from "@react-native-mapbox-gl/maps";
import RNLocation, { Location } from "react-native-location";
import GeoJSON from "geojson";
MapboxGL.setAccessToken(
  "pk.eyJ1IjoiaGVjdG9yY2hjaCIsImEiOiJja205YmhldXUwdHQ1Mm9xbGw4N2RodndhIn0.yX90QKE2jcgG-7V5wOGXeQ"
);
import {
  Text,
  View,
  Dimensions,
  Modal,
  Vibration,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableHighlight,
} from "react-native";

import MMKVStorage from "react-native-mmkv-storage";
import React from "react";
import useInterval from "../Helper/useInterval";
import { wsSend } from "../../App";
import { color } from "../../constants.json";
import { Button } from "react-native-elements";
const CP_RANGE = 25;

const InGame = ({ navigation, route }) => {
  const MMKV = new MMKVStorage.Loader().initialize();

  const [testLevel, setTestLevel] = useState(0.3);
  const [location, setLocation] = useState(null);
  const [coolDown, setCoolDown] = useState([0, 0, 0, 0]);
  const [currentCoolDown, setCurrentCoolDown] = useState(-1);
  const [currentCID, setCurrentCID] = useState(-1); //Current checkpoint id. -1 if not in any checkpoints
  const [zoomLevel, setZoomLevel] = useState(19);
  const mapRef = useRef();
  let game,
    team,
    checkpointsLocation = [],
    checkpoinsMaxLevel = [],
    checkpointsLevel = [],
    checkpointsName = [],
    numberOfCheckpoints = 0,
    gameInfo,
    data = [];

  game = MMKV.getMap("joinedGame");
  team = MMKV.getString("team");
  game.checkpoints.map((val) => {
    checkpointsLocation.push({
      latitude: val.area.center.lat,
      longitude: val.area.center.lng,
    });
    checkpointsLevel.push(val.level);
    checkpointsName.push(val.name);
    checkpoinsMaxLevel.push(val.maxLevel);
    data.push({
      name: val.name,
      lat: val.area.center.lat,
      lng: val.area.center.lng,
    });
  });
  numberOfCheckpoints = game.checkpoints.length;

  const renderCheckpointsOnMap = () => {
    let cpRenderList = [];
    for (let i = 0; i < numberOfCheckpoints; i++) {
      cpRenderList.push(
        <>
          <MapboxGL.MarkerView
            id={"CP" + i}
            key={i + "m"}
            coordinate={[
              checkpointsLocation[i].longitude,
              checkpointsLocation[i].latitude,
            ]}
          >
            <View
              style={{ width: 50, height: 100, backgroundColor: "#FFFFFF00" }}
            >
              <Progress.Bar progress={testLevel} width={50} />
              <Progress.Bar progress={testLevel} width={50} color={"red"} />
            </View>
          </MapboxGL.MarkerView>
          <MapboxGL.PointAnnotation
            id={"CP" + i}
            key={i + "p"}
            coordinate={[
              checkpointsLocation[i].longitude,
              checkpointsLocation[i].latitude,
            ]}
          />
        </>
      );
    }
    return cpRenderList;
  };

  var unsub;
  useEffect(() => {
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
          }
        });
      }
    });
    return function cleanup() {
      unsub();
    };
  }, []);

  useEffect(() => {
    if (location !== null) {
      let flag, newCID;
      for (let i = 0; i < numberOfCheckpoints; i++) {
        if (
          getDistance(
            {
              latitude: location.latitude,
              longitude: location.longitude,
            },
            checkpointsLocation[i]
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
    console.log(checkpointsName);
    if (currentCID !== -1 && currentCoolDown !== currentCID) {
      navigation.navigate("Maths", {
        cpName: checkpointsName[currentCID],
        gid: game.gid,
        team: team,
        cid: currentCID,
      });
    } else {
      navigation.navigate("InGame");
    }
  }, [currentCID, currentCoolDown]);

  useInterval(() => {
    gameInfo = MMKV.getMap("gameInfo");
  }, 100);

  useEffect(() => {
    if (gameInfo == null) {
      return;
    }
    let cpsLevel = [];
    game.status = gameInfo.status;
    for (let i = 0; i < game.checkpoints.length; i++) {
      game.checkpoints[i].level = gameInfo.cpsLevel[i];
      cpsLevel.push(gameInfo.cpsLevel[i]);
    }
    console.log(gameInfo);
  }, [gameInfo]);

  useEffect(() => {
    if (route.params?.cd) {
      if (route.params?.cd === -1) {
        wsSend(
          JSON.stringify({
            header: "ADD",
            content: { gid: game.gid, team: team, cid: currentCID },
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
      if (coolDown[currentCoolDown] === 0) setCurrentCoolDown(-1);
    },
    currentCoolDown === -1 ? null : 1000
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.mapContainer}>
          <MapboxGL.MapView
            ref={mapRef}
            style={styles.map}
            pitchEnabled={false}
            rotateEnabled={false}
            compassEnabled={false}
          >
            <MapboxGL.Camera
              defaultSettings={{
                zoomLevel: zoomLevel,
                centerCoordinate: [114.263981, 22.339158],
              }}
            />
            {renderCheckpointsOnMap()}
            <MapboxGL.UserLocation />
          </MapboxGL.MapView>
        </View>
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
  marker: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
});
