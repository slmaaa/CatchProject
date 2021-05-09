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
import MMKVStorage from "react-native-mmkv-storage";
import MapboxGL from "@react-native-mapbox-gl/maps";

import { Icon, InlineIcon } from "@iconify/react";
import documentOnePage24Regular from "@iconify/icons-fluent/document-one-page-24-regular";
import { join } from "./joinOrCreate";
import { URL } from "../constants.json";
import { wsSend } from "../App";
import { color } from "../constants";
MapboxGL.setAccessToken(
  "pk.eyJ1IjoiaGVjdG9yY2hjaCIsImEiOiJja205YmhldXUwdHQ1Mm9xbGw4N2RodndhIn0.yX90QKE2jcgG-7V5wOGXeQ"
);

import histroy from "./history";
import RealHome from "./RealHome";

const MMKV = new MMKVStorage.Loader().initialize();
var { height, width } = Dimensions.get("window");

const Home = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.homeButtons}>
        <Icon
          reverse
          name="file-tray-full-outline"
          type="ionicon"
          color="#4F2D20"
        />

        <Icon reverse name="medal-outline" type="ionicon" color="#4F2D20" />

        <Icon reverse name="people-outline" type="ionicon" color="#4F2D20" />
      </View>
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
          navigation.navigate("joinOrCreate");
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
    top: height * 0.9,
    width: "40%",
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
