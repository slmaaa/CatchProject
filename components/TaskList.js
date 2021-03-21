import React, {useEffect, useRef, useState} from 'react';

import Geolocation from 'react-native-geolocation-service';

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
  let x = randomNumber();
  const [type1, setType1] = useState(easy[x].type);
  const [quantity1, setQuantity1] = useState(easy[x].quantity);
  x = randomNumber();
  const [type2, setType2] = useState(medium[x].type);
  const [quantity2, setQuantity2] = useState(medium[x].quantity);
  x = randomNumber();
  const [type3, setType3] = useState(medium[x].type);
  const [quantity3, setQuantity3] = useState(medium[x].quantity);
  x = randomNumber();
  const [type4, setType4] = useState(hard[x].type);
  const [quantity4, setQuantity4] = useState(hard[x].quantity);
  const [location, setLocation] = useState(null);
  useEffect(() => {
    if (1) {
      Geolocation.watchPosition(
        position => {
          setLocation(JSON.stringify(position));
          console.log(position);
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          distanceFilter: 0,
          fastestInterval: 0,
        },
      );
    }
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upcoming Tasks</Text>
      <Task difficulty={'easy'} type={type1} quantity={quantity1} />
      <Task difficulty={'medium'} type={type2} quantity={quantity2} />
      <Task difficulty={'medium'} type={type3} quantity={quantity3} />
      <Task difficulty={'hard'} type={type4} quantity={quantity4} />
      <Text>{location}</Text>
    </View>
  );
};
export default TaskList;
const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-evenly',
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    lineHeight: 32,
    margin: 5,
  },
});
