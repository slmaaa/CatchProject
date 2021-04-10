import { SafeAreaView, StyleSheet, Pressable, Text } from "react-native";
import { useState } from "react";
import * as React from "react";
import { url } from "./constants";
const Config = () => {
  const [gID, setgID] = useState();
  const [name, setName] = useState();
  const CP_LOCATION = [
    { latitude: 22.335083, longitude: 114.262832 },
    { latitude: 22.33459, longitude: 114.262834 },
    { latitude: 22.334605, longitude: 114.263299 },
    { latitude: 22.335091, longitude: 114.263291 },
  ];
  const CP1 = {
    cid: "A1",
    name: "Alpha",
    area: {
      area: "CIRCLE",
      center: {
        lat: CP_LOCATION[0].latitude,
        lng: CP_LOCATION[0].longitude,
        time: 0,
      },
      radius: 5,
      time: 0,
    },
  };
  const CP2 = {
    cid: "B1",
    name: "Bravo",
    area: {
      area: "CIRCLE",
      center: {
        lat: CP_LOCATION[1].latitude,
        lng: CP_LOCATION[1].longitude,
        time: 0,
      },
      radius: 5,
      time: 0,
    },
  };
  const CP3 = {
    cid: "C1",
    name: "Charlie",
    area: {
      area: "CIRCLE",
      center: {
        lat: CP_LOCATION[2].latitude,
        lng: CP_LOCATION[2].longitude,
        time: 0,
      },
      radius: 5,
      time: 0,
    },
  };
  const CP4 = {
    cid: "D1",
    name: "Delta",
    area: {
      area: "CIRCLE",
      center: {
        lat: CP_LOCATION[3].latitude,
        lng: CP_LOCATION[3].longitude,
        time: 0,
      },
      radius: 5,
      time: 0,
    },
  };
  const game = {
    gpid: "G01",
    checkpoints: [CP1, CP2, CP3, CP4],
    players: [],
    min_players: 4,
    max_players: 18,
  };
  fetch("http://keina.astgov.space:5908/gp/G01", {
    method: "POST", // or 'PUT'
    body: JSON.stringify(game), // data can be `string` or {object}!
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error:", error))
    .then((response) => console.log("Success:", response));

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        onPressIn={() => {
          console.log("testing");
        }}
      >
        <Text>Add game to server</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "white" },
  input: {
    borderWidth: 1,
    fontSize: 24,
    fontFamily: "Arial",
    margin: 10,
    backgroundColor: "white",
  },
});

export default Config;
