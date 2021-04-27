/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { Input } from "react-native-elements";
import * as riddle from "./RiddleTestDB/1.json";
import { color } from "../../constants.json";

const operators = ["*", "+", "-"];

const math_it_up = {
  "+": function (x, y) {
    return x + y;
  },

  "-": function (x, y) {
    return x - y;
  },
  "*": function (x, y) {
    return x * y;
  },
};

export default Maths = ({ navigation, route }) => {
  const [disabled, setDisabled] = useState(false);
  const [question, setQuestion] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [summitButtonColor, setSummitButtonColor] = useState("blue");

  let answer;

  const handleOnPressSummit = () => {
    setDisabled(true);
    let correct = answerInput === answer;
    setSummitButtonColor(correct ? color.lightGreen : color.wrongRed);
    setTimeout(
      () => navigation.navigate("InGame", { cd: correct ? -1 : 7 }),
      2000
    );
  };

  useEffect(() => {
    const a = Math.floor(Math.random() * 900 + 100);
    const b = Math.floor(Math.random() * 100 + 1);
    const c = Math.floor(Math.random() * 100 + 1);
    const o1 = operators[Math.floor(Math.random() * 3)];
    const o2 = operators[Math.floor(Math.random() * 3)];
    answer = toString(math_it_up[o2](math_it_up[o1](a, b), c));
    let first_half = `${a} ${o1} ${b}`;
    if (o2 == "*" && o1 != "*") first_half = "(" + first_half + ")";
    setQuestion(first_half + ` ${o1} ${b}`);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.questionText}>{question}</Text>
      <Input
        placeholder="Your answer"
        onChangeText={setAnswerInput}
        keyboardType={"number-pad"}
      />
      <TouchableHighlight
        disabled={disabled}
        style={[styles.summitButton, { backgroundColor: summitButtonColor }]}
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
  },
  summitButtonText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: "white",
    fontFamily: "Poppins-Regular",
    fontSize: 20,
  },
});
