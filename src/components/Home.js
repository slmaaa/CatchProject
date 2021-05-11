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

import { Icon } from 'react-native-elements'

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
        containerStyle={styles.historyButtonContianer}
        buttonStyle={styles.historyButton}
        onPress={() => {
          navigation.navigate("history");
        }}
        icon={   
          <Icon
            name="archive"
            type="material-community"
            color={"white"}
          />
        }
      />

      <Button
        containerStyle={styles.badgesButtonContianer}
        buttonStyle={styles.badgesButton}
        icon={   
          <Icon
            name="medal"
            type="material-community"
            color={"white"}
          />
        }
      />

      <Button
        containerStyle={styles.friendsButtonContianer}
        buttonStyle={styles.friendsButton}
        icon={   
          <Icon
            name="account-multiple"
            type="material-community"
            color={"white"}
          />
        }
      />


      <Button
        title={"Game"}
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
    top: height * 0.85,
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
  historyButtonContianer: {
    position:"absolute",
    top: height * 0.016,
    left: width * 0.8,
    color: color.brown,
    alignItems: "flex-end",
    justifyContent: "center",
    margin: 10,
  },
  historyButton: {
    backgroundColor: color.brown,
    width: height / 15,
    height: height / 15,
    borderRadius: height / 60,
  },
  badgesButtonContianer: {
    position:"absolute",
    top: height * 0.11,
    left: width * 0.8,
    color: color.brown,
    alignItems: "flex-end",
    justifyContent: "center",
    margin: 10,
  },
  badgesButton: {
    backgroundColor: color.brown,
    width: height / 15,
    height: height / 15,
    borderRadius: height / 60,
  },
  friendsButtonContianer: {
    position:"absolute",
    top: height * 0.20,
    left: width * 0.8,
    color: color.brown,
    alignItems: "flex-end",
    justifyContent: "center",
    margin: 10,
  },
  friendsButton: {
    backgroundColor: color.brown,
    width: height / 15,
    height: height / 15,
    borderRadius: height / 60,
  },
});
export default Home;
