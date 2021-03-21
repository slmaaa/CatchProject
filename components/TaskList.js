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

import CatchCountdown from './CatchCountdown';
import * as colorCode from '../ColorCode';
import {easy, medium, hard} from './task_list.json';
import Task from './Task';

const randomNumber = () => Math.floor(Math.random() * 5);
const TaskList = props => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Tasks</Text>
      <Task difficulty={'easy'} task={randomNumber()} />
      <Task difficulty={'medium'} task={randomNumber()} />
      <Task difficulty={'medium'} task={randomNumber()} />
      <Task difficulty={'hard'} task={randomNumber()} />
    </View>
  );
};
export default TaskList;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-evenly',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    lineHeight: 32,
    margin: 5,
  },
});
