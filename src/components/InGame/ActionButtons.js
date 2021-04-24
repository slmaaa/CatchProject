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
  const status = {
    NOT_IN_CP: "Hurry to next CP",
    RIDDLE: "Riddle " + completionLevel + "/5",
    SUDOKU: "Sudoku " + completionLevel + "/5",
    MATH: "Math" + completionLevel + "/5",
  };
  const buttonColor = {
    NOT_IN_CP: color.grey,
    RIDDLE: color.lightGreen,
    SUDOKU: color.primary,
    MATH: color.orange,
  };
  useEffect(() => {
    if (option == "NOT_IN_CP") {
      setButtonText(staus[option]);
    } else if (cd == 0) {
      setButtonText(status[option]);
    } else {
      setButtonText("CD: " + cd);
    }
  }, [option, cd]);

  return (
    <TouchableHighlight
      disabled={disabled}
      style={[
        styles.actionButton,
        { backgroundColor: cd == 0 ? buttonColor[option] : "black" },
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
