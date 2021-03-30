import React, { useEffect, useRef, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { getDistance } from 'geolib';
import { PermissionsAndroid } from 'react-native';

import {
  Text,
  View,
  Dimensions,
  Vibration,
  TouchableHighlight,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';

const NUM_OF_CP = 4;
const CP_LOCATION = [
  { latitude: 22.335083, longitude: 114.262832 },
  { latitude: 22.33459, longitude: 114.262834 },
  { latitude: 22.334605, longitude: 114.263299 },
  { latitude: 22.335091, longitude: 114.263291 },
];
const CP_RANGE = 5;

const timestampToDate = timestamp => {
  let d = new Date(timestamp);
  let hours = d.getHours(),
    minutes = d.getMinutes(),
    seconds = d.getSeconds(),
    month = d.getMonth() + 1,
    day = d.getDate(),
    year = d.getFullYear() % 100;

  function pad(d) {
    return (d < 10 ? '0' : '') + d;
  }

  let formattedDate =
    pad(hours) +
    ':' +
    pad(minutes) +
    ':' +
    pad(seconds) +
    ' ' +
    pad(month) +
    '-' +
    pad(day) +
    '-' +
    pad(year);
  return formattedDate;
};

const InGame = props => {
  const [locationText, setLocationText] = useState('');
  const [location, setLocation] = useState('a');
  const [cpFlag, setCPFlag] = useState(-1);
  const [time, setTime] = useState(0);
  const [formattedTime, setFormattedTime] = useState('');
  useEffect(() => {
    const _watchId = Geolocation.watchPosition(
      position => {
        setLocation(position.coords);
        setTime(position.timestamp);
        let f = timestampToDate(position.timestamp);
        setFormattedTime(f);
        console.log('Location updated at ' + f);
        setLocationText(
          'Latitude: ' +
          JSON.stringify(position.coords.latitude) +
          '\n' +
          'Longitude: ' +
          JSON.stringify(position.coords.longitude),
        );
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        distanceFilter: 1,
        interval: 1000,
        fastestInterval: 1000,
      },
    );
    setCPFlag(-1);
    if (location != 'a') {
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
  MapboxGL.setConnected(true);
  MapboxGL.setAccessToken(
    'pk.eyJ1IjoiaGVjdG9yY2hjaCIsImEiOiJja205YmhldXUwdHQ1Mm9xbGw4N2RodndhIn0.yX90QKE2jcgG-7V5wOGXeQ',
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <Text>{locationText}</Text>
        <Text>{formattedTime}</Text>
        <Text>{cpFlag}</Text>
      </View>
      <View style={styles.scoreBarContainer}>
        <Text>Score</Text>
      </View>
      <View style={styles.eventLogContainer}>
        <Text>Event Log</Text>
      </View>
      <View style={styles.currentEnergyBarContainer}>
        <Text>Energy Bar</Text>
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
  mapContainer: {
    flex: 0.6,
    justifyContent: "center",
    backgroundColor: "tomato",
  },
  scoreBarContainer: {
    flex: 0.1,
    backgroundColor: "yellow",
  },
  eventLogContainer: {
    flex: 0.15,
    backgroundColor: "blue",
  },
  currentEnergyBarContainer: {
    flex: 0.15,
    backgroundColor: "orange",
  },
});
