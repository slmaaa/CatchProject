import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native";
import { ListItem } from "react-native-elements";
import database from "@react-native-firebase/database";
import MMKVStorage from "react-native-mmkv-storage";
const MMKV = new MMKVStorage.Loader().initialize();

export default SelectHistory = ({ navigation }) => {
  const [initializing, setInitializing] = useState(true);
  if (initializing) return null;
  const list = useRef([]);
  useEffect(() => {
    database()
      .ref(`users/${userID}/gameRecord`)
      .once("value")
      .then((snapshot) => {
        list.current.push(snapshot.val());
      });
  }, []);
  <SafeAreaView>
    {list.map((l, i) => (
      <ListItem
        key={i}
        bottomDivider
        onPress={() => {
          MMKV.setMap("selectedHistory", l);
          navigation.navigate("history");
        }}
      >
        <ListItem.Content>
          <ListItem.Title>{l.gameID}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    ))}
  </SafeAreaView>;
};
