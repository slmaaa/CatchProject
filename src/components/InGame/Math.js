/* eslint-disable quotes */
import React, { useState, useEffect, useRef } from "react";
import * as Progress from "react-native-progress";
import { SafeAreaView, Text, StyleSheet, View, Alert } from "react-native";
import { StackActions } from "@react-navigation/native";
import { Input, Button } from "react-native-elements";
import MMKVStorage from "react-native-mmkv-storage";

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
  const MMKV = new MMKVStorage.Loader().initialize();
  const { cpName, gid, team, cid } = route.params;
  const cooldowns = useRef(MMKV.getArray("cpCooldowns"));
  const correct = useRef(false);
  const [disabled, setDisabled] = useState(false);
  const [question, setQuestion] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [cooldown, setCooldown] = useState(cooldowns.current[cid]);
  const [answer, setAnswer] = useState();
  const [level, setLevel] = useState(0);

  const handleOnPressSummit = () => {
    setDisabled(true);
    if (answerInput !== answer) {
      setCooldown(COOLDOWN);
      setup();
    } else {
      setLevel(MMKV.getMap("joinedGame").checkpoints[cid].level[team]);
      correct.current = true;
      setTimeout(() => {
        MMKV.setInt("challengesSolved", MMKV.getInt("challengesSolved") + 1);
        setLevel(MMKV.getMap("joinedGame").checkpoints[cid].level[team]);
        wsSend(
          JSON.stringify({
            header: "ADD",
            content: { gid: gid.toString(), team: team, cid: cid },
          })
        );
      }, 1000);
      setTimeout(() => {
        navigation.pop();
      }, 3000);
    }
  };

  useInterval(
    () => {
      setCooldown((cooldowns.current[cid] = cooldown - 1));
      if (cooldown === 0) {
        setDisabled(false);
      }
    },
    cooldown !== -1 ? 1000 : null
  );

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        MMKV.setArray("cpCooldowns", cooldowns.current);
      }),
    [navigation]
  );
  const setup = () => {
    let a, b, c, o1, o2, ans;
    do {
      a = Math.floor(Math.random() * 100 + 1);
      b = Math.floor(Math.random() * 100 + 1);
      c = Math.floor(Math.random() * 100 + 1);
      o1 = operators[Math.floor(Math.random() * 3)];
      o2 = operators[Math.floor(Math.random() * 3)];
      ans = math_it_up[o2](math_it_up[o1](a, b), c);
    } while (ans >= 1000 || ans <= 0);
    setAnswer(ans.toString());
    let first_half = `${a} ${o1} ${b}`;
    if (o2 === "*" && o1 !== "*") first_half = "(" + first_half + ")";
    setQuestion(first_half + ` ${o2} ${c}`);
  };

  useEffect(() => {
    setup();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.checkpointName}>{cpName}</Text>

      {cooldown !== -1 && (
        <View style={{ flex: 0.8 }}>
          <Text style={styles.wrongText}>Wrong anwser. Try again in</Text>
          <Progress.Circle
            progress={cooldown / COOLDOWN}
            size={120}
            thickness={10}
            formatText={(progress) => {
              return cooldown + "s";
            }}
            color={"red"}
            showsText={true}
            style={{ alignSelf: "center" }}
          />
        </View>
      )}
      {cooldown === -1 && !correct.current && (
        <View style={{ flex: 0.8 }}>
          <Text style={styles.questionText}>{question}</Text>
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
        </View>
      )}
      {correct.current && (
        <View style={{ flex: 0.8 }}>
          <Text style={styles.correctText}>Correct!</Text>
          <Progress.Bar
            progress={
              level / MMKV.getMap("joinedGame").checkpoints[cid].maxLevel
            }
            color={team === "RED" ? color.teamRed : color.teamBlue}
            width={200}
            height={30}
            style={{ alignSelf: "center" }}
          />
        </View>
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
    flex: 0.2,
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
  summitButton: {
    flex: 0.7,
    alignSelf: "center",
    alignContent: "center",
    width: "48%",
  },
  wrongText: {
    textAlign: "center",
    fontSize: 18,
    color: "red",
    flex: 0.3,
  },
  correctText: {
    textAlign: "center",
    fontSize: 36,
    color: "black",
    fontWeight: "700",
    flex: 0.3,
  },
  summitButtonText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: "white",
    fontFamily: "Poppins-Regular",
    fontSize: 20,
  },
});
