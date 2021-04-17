import React, { useState } from "react";
import { Text, SafeAreaView, StyleSheet, Switch, View } from "react-native";
import { Input, CheckBox, Button, ThemeProvider } from "react-native-elements";

import { color } from "../constants.json";

export default CreateGame = ({ navigation }) => {
  const [isHost, setIsHost] = useState(false);
  const [usePresetCP, setUsePresetCP] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      <Input placeholder="Game name"></Input>
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Join as host</Text>
        <Switch
          trackColor={{ true: "green", false: "grey" }}
          thumbColor={isHost ? color.lightGreen : "white"}
          value={isHost}
          onValueChange={() => setIsHost((previous) => !previous)}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Use preset checkpoints</Text>
        <Switch
          trackColor={{ true: "green", false: "grey" }}
          thumbColor={usePresetCP ? color.lightGreen : "white"}
          value={usePresetCP}
          onValueChange={() => setUsePresetCP((previous) => !previous)}
        />
      </View>
      <Button
        containerStyle={{ margin: 10 }}
        titleStyle={{ color: color.blueOnBlack }}
        buttonStyle={{ borderColor: color.blueOnBlack, borderWidth: 1.5 }}
        title="Checkpoints setup"
        disabled={usePresetCP}
        type={"outline"}
      ></Button>
      <Button
        containerStyle={{ margin: 10 }}
        titleStyle={{ color: color.lightGreen }}
        buttonStyle={{
          borderColor: color.lightGreen,
          borderWidth: 1.5,
        }}
        title="Done"
        type={"outline"}
      ></Button>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    borderWidth: 0,
    flex: 1,
    padding: 15,
  },
  nameInputContainer: {
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "grey",
    padding: 5,
  },
  switchContainer: {
    flexDirection: "row",
    backgroundColor: "black",
    justifyContent: "space-between",
  },
  switchText: {
    fontFamily: "Poppins-Medium",
    textAlign: "left",
    fontSize: 18,
    color: color.blueOnBlack,
    padding: 10,
  },
});
