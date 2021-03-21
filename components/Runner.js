import React, {useEffect, useRef, useState} from 'react';

import Modal from 'react-native-modalbox';

import {
  Text,
  View,
  Vibration,
  NativeModules,
  TouchableHighlight,
  Alert,
  StyleSheet,
} from 'react-native';

import * as colorCode from '../ColorCode';

import CatchCountdown from './CatchCountdown';
import {CatchData} from './test';
import {easy, medium, hard} from './task_list.json';

function Chaser(props) {
  const [end, setEnd] = useState(false);
  const [isBeingCaught, setIsBeingCaught] = useState(0);
  const [open, setIsOpen] = useState(false);
  const modal1 = useRef(null);
  console.log(CatchData.isBeingCatch);
  function onClose() {
    console.log('Modal just closed');
    setIsOpen(false);
    setEnd(false);
    Vibration.cancel();
  }
  function onOpen() {
    console.log('Modal just opened');
    Vibration.vibrate([200, 200], true);
  }
  return (
    <>
      <View style={styles.container}>
        <TouchableHighlight onPress={() => setIsOpen(true)}>
          <Text>Caught</Text>
        </TouchableHighlight>
        <Modal
          ref={modal1}
          style={styles.modal}
          swipeToClose={true}
          onClosed={onClose}
          onOpened={onOpen}
          isOpen={open}
          isDisabled={false}>
          <CatchCountdown end={end} settingEnd={setEnd} />
        </Modal>
      </View>
    </>
  );
}
export default Chaser;
const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    justifyContent: 'center',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 230,
    width: '70%',
    borderWidth: 5,
    borderRadius: 10,
    borderColor: 'red',
  },
});
