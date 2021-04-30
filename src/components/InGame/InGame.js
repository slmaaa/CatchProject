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
  const [initializing, setInitializing] = useState(true);

  const gameInfo = useRef();
  const [location, setLocation] = useState(null);
  const [currentCID, setCurrentCID] = useState(-1); //Current checkpoint id. -1 if not in any checkpoints
  const mapRef = useRef();
  const gameRef = useRef({
    game: null,
    team: null,
    checkpointsLocation: null,
    numberOfCheckpoints: null,
  });

  const renderCheckpointsOnMap = () => {
    let cpRenderList = [];
    for (let i = 0; i < gameRef.current.numberOfCheckpoints; i++) {
      cpRenderList.push(
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
              style={{ width: 50, height: 100, backgroundColor: "#FFFFFF00" }}
            >
              <Progress.Bar
                progress={
                  gameRef.current.game.checkpoints[i].level.BLUE /
                  gameRef.current.game.checkpoints[i].maxLevel
                }
                width={50}
              />
              <Progress.Bar
                progress={
                  gameRef.current.game.checkpoints[i].level.RED /
                  gameRef.current.game.checkpoints[i].maxLevel
                }
                width={50}
                color={"red"}
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
      checkpointsLocation = [];
    game.checkpoints.map((val) => {
      checkpointsLocation.push({
        latitude: val.area.center.lat,
        longitude: val.area.center.lng,
      });
      coolDowns.push(-1);
    });
    gameRef.current.checkpointsLocation = checkpointsLocation;
    gameRef.current.numberOfCheckpoints = game.checkpoints.length;
    MMKV.setArray("cpCooldowns", coolDowns);
    setInitializing(false);
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
      for (let i = 0; i < gameRef.current.numberOfCheckpoints; i++) {
        if (
          getDistance(
            {
              latitude: location.latitude,
              longitude: location.longitude,
            },
            gameRef.current.checkpointsLocation[i]
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
    if (currentCID !== -1) {
      navigation.navigate("Maths", {
        cpName: gameRef.current.game.checkpoints[currentCID].name,
        gid: gameRef.current.game.gid,
        team: gameRef.current.team,
        cid: currentCID,
      });
    }
  }, [currentCID]);

  useInterval(() => {
    gameInfo.current = MMKV.getMap("gameInfo");
  }, 100);

  useEffect(() => {
    if (gameInfo.current == null) {
      return;
    }
    gameRef.current.game.status = gameInfo.current.status;
    for (let i = 0; i < gameRef.current.numberOfCheckpoints; i++) {
      gameRef.current.game.checkpoints[i].level = gameInfo.current.cpsLevel[i];
    }
    MMKV.setMap("joinedGame", gameRef.current.game);
  }, [gameInfo.current]);

  if (initializing) return null;
  else
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
                  zoomLevel: 17,
                  centerCoordinate: [114.263981, 22.339158],
                }}
              />
              {renderCheckpointsOnMap()}
              <MapboxGL.UserLocation />
            </MapboxGL.MapView>
          </View>
          <Button
            title={"test"}
            onPress={() => {
              if (currentCID !== -1) {
                navigation.navigate("Maths", {
                  cpName: gameRef.current.game.checkpoints[currentCID].name,
                  gid: gameRef.current.game.gid,
                  team: gameRef.current.team,
                  cid: currentCID,
                });
              }
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
