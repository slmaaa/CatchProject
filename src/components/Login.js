import {
  SafeAreaView,
  Text,
  TextInput,
  StyleSheet,
  Button,
} from "react-native";
import { useState } from "react";
import * as React from "react";
import { Link } from "@react-navigation/native";
import { url } from "./constants";

const Login = () => {
  const [playerID, setPlayerID] = useState();
  const [name, setName] = useState();
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder={"Player ID"}
        style={styles.input}
        keyboardType="numeric"
        onChangeText={setPlayerID}
      ></TextInput>
      <TextInput
        placeholder={"Name"}
        style={styles.input}
        keyboardType="numeric"
        onChangeText={setName}
      ></TextInput>
      <Button
        title={"Add player"}
        onPress={() => {
          const id = "P" + (playerID >= 10 ? playerID : "0" + playerID);
          const player = {
            pid: id,
            name: name,
            avatar: null,
          };
          fetch(url + "/posting", {
            method: "POST", // or 'PUT'
            body: JSON.stringify(player), // data can be `string` or {object}!
            headers: new Headers({
              "Content-Type": "application/json",
            }),
          })
            .then((res) => res.json())
            .catch((error) => console.error("Error:", error))
            .then((response) => console.log("Success:", response));
        }}
      ></Button>
      <Link to="InGame">Start Game</Link>
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

export default Login;
