/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import * as Progress from "react-native-progress";
import { SafeAreaView, Text, StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import { color } from "../../constants.json";
import { wsSend } from "../../App";

import useInterval from "../Helper/useInterval";

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

const COOLDOWN = 20;

export default Maths = ({ navigation, route }) => {
  const [disabled, setDisabled] = useState(false);
  const [question, setQuestion] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [coolDown, setCoolDown] = useState(-1);
  const [answer, setAnswer] = useState();

  const { cpName, gid, team, cid } = route.params;

  const handleOnPressSummit = () => {
    setDisabled(true);
    let correct = answerInput === answer;
    if (!correct) {
      setCoolDown(COOLDOWN);
    } else {
      wsSend(
        JSON.stringify({
          header: "ADD",
          content: { gid: gid, team: team, cid: cid },
        })
      );
    }
  };

  useInterval(
    () => {
      setCoolDown(coolDown - 1);
      if (coolDown === 0) {
        setDisabled(false);
      }
    },
    coolDown !== -1 ? 1000 : null
  );

  useEffect(() => {
    let a, b, c, o1, o2, ans;
    do {
      a = Math.floor(Math.random() * 100 + 1);
      b = Math.floor(Math.random() * 100 + 1);
      c = Math.floor(Math.random() * 100 + 1);
      o1 = operators[Math.floor(Math.random() * 3)];
      o2 = operators[Math.floor(Math.random() * 3)];
      ans = math_it_up[o2](math_it_up[o1](a, b), c);
    } while (ans >= 1000);
    setAnswer(ans.toString());
    let first_half = `${a} ${o1} ${b}`;
    if (o2 === "*" && o1 !== "*") first_half = "(" + first_half + ")";
    setQuestion(first_half + ` ${o2} ${c}`);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.checkpointName}>{cpName}</Text>
      <Text style={styles.questionText}>{question}</Text>

      {coolDown !== -1 && (
        <View style={{ flex: 0.3 }}>
          <Text style={styles.wrongText}>Wrong anwser. Try again in</Text>
          <Progress.Circle
            progress={coolDown / COOLDOWN}
            size={120}
            thickness={10}
            formatText={(progress) => {
              return coolDown + "s";
            }}
            color={"red"}
            showsText={true}
            style={{ alignSelf: "center" }}
          />
        </View>
      )}
      {coolDown === -1 && (
        <>
          <Input
            placeholder="Your answer"
            onChangeText={setAnswerInput}
            keyboardType={"number-pad"}
          />
          <Button
            containerStyle={styles.summitButton}
            buttonStyle={{ backgroundColor: color.brown }}
            title={"Summit"}
            onPress={handleOnPressSummit}
            disabled={disabled}
          />
        </>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: color.offWhite,
    padding: 30,
    flex: 1,
  },
  checkpointName: {
    flex: 0.1,
    fontSize: 21,
    textAlign: "left",
    fontWeight: "700",
    textAlignVertical: "center",
  },
  questionText: {
    flex: 0.3,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
    color: "black",
  },
  checkBox: {
    borderColor: color.darkGrey,
    padding: 10,
    flex: 0.2,
  },
  summitButton: {
    flex: 0.25,
    alignSelf: "center",
    alignContent: "center",
    width: "48%",
  },
  wrongText: {
    textAlign: "center",
    fontSize: 18,
    color: "red",
  },
  summitButtonText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: "white",
    fontFamily: "Poppins-Regular",
    fontSize: 20,
  },
});
