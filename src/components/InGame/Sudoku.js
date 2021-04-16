import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
} from "react-native";

import * as sudoku from "./SudokuTestDB/1.json";
import { color } from "../../constants.json";

export default Sudoku = () => {
  const DEFAULT_GRID = [...sudoku.Question];
  const [grid, setGrid] = useState([...sudoku.Question]);
  const [selectedNumber, setSelectedNumber] = useState(-1);

  const handleOnPressSmallGrid = (i) => {
    if (selectedNumber != -1) {
      let newState = grid;
      newState[i] = selectedNumber;
      setGrid([...newState]);
    }
  };
  const initializeGrid = () => {
    let grids = [];
    for (let i = 0; i < sudoku.SIZE; i++) {
      let row = [];
      for (let k = 0; k < sudoku.SIZE; k++) {
        let content;
        if (DEFAULT_GRID[i * sudoku.SIZE + k] === 0) {
          content = (
            <TouchableHighlight
              style={{
                flex: 1,
                alignContent: "center",
                justifyContent: "center",
              }}
              onPress={() => handleOnPressSmallGrid(i * sudoku.SIZE + k)}
              underlayColor={color.blueOnBlack}
            >
              <Text style={[styles.numberText, { color: color.lightGreen }]}>
                {grid[i * sudoku.SIZE + k] == 0
                  ? " "
                  : grid[i * sudoku.SIZE + k]}
              </Text>
            </TouchableHighlight>
          );
        } else {
          content = (
            <Text style={styles.numberText}>{grid[i * sudoku.SIZE + k]}</Text>
          );
        }
        const contents = content;
        row.push(
          <View
            key={i * 100 + k}
            style={[styles.smallGrid, { flex: 1 / sudoku.SIZE }]}
          >
            {contents}
          </View>
        );
      }
      grids.push(
        <View key={i} style={[styles.row, { flex: 1 / sudoku.SIZE }]}>
          {row}
        </View>
      );
    }
    return grids;
  };
  const initializeTools = () => {
    let content = [];
    for (let i = 1; i <= sudoku.SIZE; i++) {
      content.push(
        <TouchableHighlight
          key={i}
          onPress={() => {
            setSelectedNumber(i);
          }}
          underlayColor={"tomato"}
          style={{
            flex: 1 / sudoku.SIZE,
            alignContent: "center",
            justifyContent: "center",
            backgroundColor: selectedNumber == i ? "red" : color.orange,
            height: "100%",
            marginHorizontal: 2,
            borderColor: "white",
            borderRadius: 5,
            borderWidth: 0.6,
          }}
        >
          <Text style={styles.toolText}>{i}</Text>
        </TouchableHighlight>
      );
    }
    return content;
  };
  const grids = initializeGrid();
  const tools = initializeTools();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bigGrid}>{grids}</View>
      <View style={styles.toolsContainer}>{tools}</View>
      <View style={styles.toolsContainer}>
        <TouchableHighlight
          onPress={() => {
            setSelectedNumber(0);
          }}
          underlayColor={"tomato"}
          style={{
            flex: 0.5,
            alignContent: "center",
            justifyContent: "center",
            backgroundColor: selectedNumber == 0 ? "red" : color.offWhite,
            height: "100%",
            marginHorizontal: 2,
            borderColor: "white",
            borderRadius: 5,
            borderWidth: 0.6,
          }}
        >
          <Text style={styles.toolText}>DEL</Text>
        </TouchableHighlight>
        <TouchableHighlight
          onPress={() => {
            setGrid(DEFAULT_GRID);
          }}
          underlayColor={"tomato"}
          style={{
            flex: 0.5,
            alignContent: "center",
            justifyContent: "center",
            backgroundColor: color.offWhite,
            height: "100%",
            marginHorizontal: 2,
            borderColor: "white",
            borderRadius: 5,
            borderWidth: 0.6,
          }}
        >
          <Text style={styles.toolText}>RESET</Text>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  bigGrid: {
    top: "-5%",
    height: 350,
    width: 350,
    alignSelf: "center",
    borderWidth: 5,
    borderColor: color.blueOnBlack,
    borderRadius: 3,
  },
  row: {
    flexDirection: "row",
  },
  smallGrid: {
    borderWidth: 1,
    borderColor: color.blueOnBlack,
    alignContent: "center",
    justifyContent: "center",
  },
  numberText: {
    fontFamily: "Poppins-Medium",
    fontSize: 24,
    textAlign: "center",
    textAlignVertical: "center",
    color: color.blueOnBlack,
  },
  toolsContainer: {
    flex: 0.25,
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 10,
    flexWrap: "wrap",
  },
  toolText: {
    fontFamily: "Poppins-Medium",
    fontSize: 22,
    textAlign: "center",
    textAlignVertical: "center",
    color: "black",
  },
});
