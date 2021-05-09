import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableHighlight,
  FlatList,
  SectionList,
} from "react-native";
import {
  Overlay,
  Input,
  Button,
  ListItem,
  Avatar,
  Icon,
} from "react-native-elements";
import MMKVStorage from "react-native-mmkv-storage";
import documentOnePage24Regular from "@iconify/icons-fluent/document-one-page-24-regular";
import { join } from "./joinOrCreate";
import { URL } from "../constants.json";
import { wsSend } from "../App";
import { color } from "../constants";

const MMKV = new MMKVStorage.Loader().initialize();
var { height, width } = Dimensions.get("window");
const JoinOrCreate = () => {
  const [initializing, setInitializing] = useState(true);

  const friends = [];

  const list = [
    {
      title: "Friend’s Room",
      data:
        friends.length === 0
          ? ["So sad, you have no friends, please add oil"]
          : friends,
    },
    {
      title: "Nearby Room",
      data: ["French Fries", "Onion Rings", "Fried Shrimps"],
    },
  ];

  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
  return (
    <SafeAreaView>
      <TouchableHighlight style={styles.backButton}>
        <Icon name="arrow-back" type={"material"} color={"white"} />
      </TouchableHighlight>

      <SectionList
        sections={list}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <Item title={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <>
            <Text style={styles.header}>{title}</Text>
          </>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    margin: 100,
  },
  backButton: {
    position: "absolute",
    top: height * 0.06,
    right: width / 12,
    borderRadius: 10,
    width: height / 15,
    height: height / 15,
    backgroundColor: color.brown,
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    width: (width * 5) / 6,
    height: height * 0.085,
  },
});
export default JoinOrCreate;
