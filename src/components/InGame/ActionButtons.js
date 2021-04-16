import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableHighlight, Text } from "react-native";

import { color } from "../../constants.json";
import useInterval from "../Helper/useInterval";

//option{0:not in CP,1:riddle,2:sudoku,3:Flappy bird}

const ActionButtons = (
  option,
  completionLevel,
  handleOnPress,
  cd,
  disabled,
  currentCID
) => {
  const [buttonText, setButtonText] = useState();
  const s = [
    "Hurry to next CP",
    "Riddle " + completionLevel + "/5",
    "Sudoku " + completionLevel + "/5",
    "Flappy Bird " + completionLevel + "/5",
  ];
  const buttonColor = [
    color.grey,
    color.lightGreen,
    color.primary,
    color.orange,
    color.grey,
  ];
  useEffect(() => {
    if (option == 0) {
      setButtonText(s[0]);
    } else if (cd == 0) {
      setButtonText(s[option]);
    } else {
      setButtonText("CD: " + cd);
    }
  }, [option, cd]);

  return (
    <TouchableHighlight
      disabled={disabled}
      style={[
        styles.actionButton,
        { backgroundColor: cd == 0 ? buttonColor[option] : "grey" },
      ]}
      onPress={handleOnPress}
    >
      <Text style={styles.actionButtonText}>{buttonText}</Text>
    </TouchableHighlight>
  );
};
export default ActionButtons;
const styles = StyleSheet.create({
  actionButton: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
    position: "absolute",
    borderWidth: 0.8,
    borderColor: "white",

    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: "white",
    fontFamily: "Poppins-Regular",
    fontSize: 20,
  },
});
