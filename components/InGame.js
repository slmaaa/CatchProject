import React, {useEffect, useRef, useState} from 'react';

import {
  Text,
  View,
  Vibration,
  NativeModules,
  TouchableHighlight,
  SafeAreaView,
  Alert,
  StyleSheet,
} from 'react-native';

import * as colorCode from '../ColorCode';

const InGame = props => {
  <SafeAreaView>
    <View style={styles.mapContainer}></View>
  </SafeAreaView>;
};

export default InGame;
const styles = StyleSheet.create({
  container: {},
  mapContainer: {
    color: 'red',
    flex: 0.3,
  },
});
