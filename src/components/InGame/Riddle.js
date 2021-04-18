import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { CheckBox } from "react-native-elements";
import * as riddle from "./RiddleTestDB/1.json";
import { color } from "../../constants.json";

export default Riddle = ({ navigation, route }) => {
  const [checked, setChecked] = useState([false, false, false, false]);
  const [disabled, setDisabled] = useState(false);
  const [checkBoxesColor, setCheckBoxesColor] = useState([
    "black",
    "black",
    "black",
    "black",
  ]);
  let checkBoxes = [];

  for (let i = 0; i < 4; i++) {
    checkBoxes.push(
      <CheckBox
        key={i}
        checked={checked[i]}
        containerStyle={[
          styles.checkBox,
          { backgroundColor: checkBoxesColor[i] },
        ]}
        textStyle={styles.choiceText}
        title={riddle.Choices[i]}
        onPress={() => {
          handleOnPressCheckBoxes(i);
        }}
      />
    );
  }
  const handleOnPressCheckBoxes = (x) => {
    if (!disabled) {
      let newState = [false, false, false, false];
      newState[x] = true;
      setChecked(newState);
    }
  };

  const handleOnPressSummit = () => {
    setDisabled(true);
    let state = checkBoxesColor;
    const i = checked.indexOf(true);
    correct = i == riddle.Answer;
    state[i] = correct ? color.lightGreen : color.wrongRed;
    setCheckBoxesColor([...state]);
    setTimeout(
      () => navigation.navigate("InGame", { cd: correct ? -1 : 7 }),
      2000
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.questionText}>{riddle.Question}</Text>
      {checkBoxes}
      <TouchableHighlight
        disabled={disabled}
        style={styles.summitButton}
        onPress={handleOnPressSummit}
      >
        <Text style={styles.summitButtonText}>Summit</Text>
      </TouchableHighlight>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
  },
  questionText: {
    fontFamily: "Poppins-Medium",
    textAlign: "left",
    fontSize: 14,
    color: color.blueOnBlack,
    padding: 10,
  },
  checkBox: {
    borderColor: color.darkGrey,
    padding: 10,
  },
  choiceText: {
    fontFamily: "Poppins-Medium",
    textAlign: "left",
    fontSize: 14,
    color: color.offWhite,
  },
  summitButton: {
    position: "absolute",
    bottom: "5%",
    alignContent: "center",
    left: "25%",
    height: 60,
    width: "50%",
    borderRadius: 20,
    borderWidth: 0.8,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.lightGreen,
  },
  summitButtonText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: "white",
    fontFamily: "Poppins-Regular",
    fontSize: 20,
  },
});
