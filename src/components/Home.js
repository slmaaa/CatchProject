/*
HomeScreen:
Shown nearby player location and route player to screens
*/
import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Overlay, Input, Button } from "react-native-elements";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import MMKVStorage from "react-native-mmkv-storage";
import MapboxGL from "@react-native-mapbox-gl/maps";

import { Icon, InlineIcon } from "@iconify/react";
import documentOnePage24Regular from "@iconify/icons-fluent/document-one-page-24-regular";
import { join } from "./joinGame";
import { URL } from "../constants.json";
import { wsSend } from "../App";
import { color } from "../constants";
MapboxGL.setAccessToken(
  "pk.eyJ1IjoiaGVjdG9yY2hjaCIsImEiOiJja205YmhldXUwdHQ1Mm9xbGw4N2RodndhIn0.yX90QKE2jcgG-7V5wOGXeQ"
);

const MMKV = new MMKVStorage.Loader().initialize();
var { height, width } = Dimensions.get("window");
const Home = ({ navigation }) => {
  const userName = MMKV.getString("userName");
  const userID = MMKV.getString("userID");

  return (
    <SafeAreaView style={styles.container}>
      <Icon
        recordIcon={documentOnePage24Regular}
        style={{ color: "#ffffff", fontSize: "100px" }}
      />
      <MapboxGL.MapView
        style={styles.map}
        pitchEnabled={false}
        scrollEnabled={false}
        rotateEnabled={false}
      >
        <MapboxGL.Camera followUserLocation={true} followUserMode={"compass"} />
        <MapboxGL.UserLocation />
      </MapboxGL.MapView>
      <Button
        title={"GAME"}
        containerStyle={styles.button}
        titleStyle={{ color: "white", fontSize: 24 }}
        buttonStyle={{ backgroundColor: color.brown }}
        onPress={() => {
          navigation.navigate("RealHome");
        }}
      ></Button>
    </SafeAreaView>
  );
};

const stylesImage = StyleSheet.create({
  container: {
    flex: 0.001,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  tinyLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  logo: {
    width: 66,
    height: 58,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  button: {
    position: "absolute",
    height: 50,
    top: height * 0.8,
    width: "40%",
    marginVertical: 50,
    alignSelf: "center",
    color: color.brown,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.37,
    shadowRadius: 15,
    elevation: 5,
  },
});
export default Home;
