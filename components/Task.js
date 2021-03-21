import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  Vibration,
  NativeModules,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';

import * as colorCode from '../ColorCode';
import * as tasks from './task_list.json';

const Task = props => {
  let type,
    quantity,
    taskText,
    task = Number(props.task);
  if (props.difficulty === 'easy') {
    type = tasks.easy[task].type;
    quantity = tasks.easy[task].quantity;
  } else if (props.difficulty === 'hard') {
    type = tasks.hard[task].type;
    quantity = tasks.hard[task].quantity;
  } else {
    type = tasks.medium[task].type;
    quantity = tasks.medium[task].quantity;
  }
  if (type === 'Heartrate') {
    taskText = 'Reach a heart rate of ' + String(quantity);
  } else {
    taskText = type + ' ' + String(quantity) + 'm';
  }
  const [text, setText] = useState(taskText);
  return (
    <View style={styles.container}>
      <View style={styles.taskBox}>
        <View style={styles.taskTextBox}>
          <Text style={styles.taskText}>{text}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Take</Text>
      </TouchableOpacity>
    </View>
  );
};
export default Task;
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  taskBox: {
    height: 40,
    borderRightWidth: 0,
    borderWidth: 2,
    borderRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: colorCode.primary,
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    flex: 0.75,
  },
  taskTextBox: {
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1,
  },
  taskText: {
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
    fontSize: 16,
    lineHeight: 28,
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    fontSize: 16,
    lineHeight: 28,
  },
  button: {
    flex: 0.25,
    height: 40,
    borderWidth: 2,
    justifyContent: 'center',
    alignContent: 'center',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: colorCode.primary,
    borderColor: colorCode.primary,
  },
});
