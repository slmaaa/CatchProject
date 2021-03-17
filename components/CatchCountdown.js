import React, {useState} from 'react';

import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';

import * as colorCode from '../ColorCode';
import useInterval from './useInterval';

let padToTwo = number => (number <= 9 ? `0${number}` : number);

function CatchCountdown(props) {
  const [second, setSecond] = useState(5);
  const [milisecond, setMilisecond] = useState(0);
  useInterval(
    () => {
      if (milisecond != 0) {
        setMilisecond(milisecond - 1);
      } else if (second != 0) {
        setMilisecond(99);
        setSecond(second - 1);
      } else {
        props.settingEnd(true);
      }
    },
    props.end ? null : 1,
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.parent}>
          <Text style={styles.warning}>You will be caught by player 3 in </Text>
          <View style={styles.timerContainer}>
            <Text style={styles.child}>{padToTwo(second) + ' : '}</Text>
            <Text style={styles.child}>{padToTwo(milisecond)}</Text>
          </View>
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {},
  parent: {
    display: 'flex',
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingLeft: '8%',
    paddingRight: '8%',
    paddingTop: '.5%',
    paddingBottom: '.5%',
  },
  warning: {
    fontSize: 20,
    color: 'red',
    alignSelf: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
  },
  child: {
    fontSize: 40,
    color: 'red',
  },

  start: {
    alignSelf: 'center',
  },
});
export default CatchCountdown;
