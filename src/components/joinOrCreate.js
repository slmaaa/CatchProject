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
  Divider,
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
const JoinOrCreate = ({ navigation }) => {
  const [initializing, setInitializing] = useState(true);

  const friends = [];
  const nearbyRooms = [];
  const list = [
    {
      title: "Friend’s Room",
      data:
        friends.length === 0
          ? ["So sad, you have no friends, please add oil:("]
          : friends,
    },
    {
      title: "Nearby Room",
      data:
        nearbyRooms.length === 0
          ? ["There are no nearby rooms, try create one"]
          : nearbyRooms,
    },
  ];

  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
  return (
    <SafeAreaView container={styles.container}>
      <Button
        containerStyle={styles.backButtonContainer}
        buttonStyle={styles.backButton}
        onPress={() => navigation.goBack()}
        icon={<Icon name="arrow-back" type={"material"} color={"white"} />}
      />

      <SectionList
        style={styles.listContainer}
        sections={list}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <Item title={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <>
            <Text style={styles.header}>{title}</Text>
            <Divider style={{ backgroundColor: color.grey }} />
          </>
        )}
      />
      <Button
        containerStyle={styles.createButtonContianer}
        buttonStyle={styles.createButton}
        icon={<Icon name="plus" type={"material-community"} color={"white"} />}
      />
      <Button
        containerStyle={styles.createButtonContianer}
        buttonStyle={styles.createButton}
        icon={
          <Icon
            name="account-multiple-plus"
            type={"material-community"}
            color={"white"}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    justifyContent: "center",
  },
  listContainer: {
    height: "60%",
    marginTop: height / 6.5,
    alignSelf: "center",
    width: "90%",
  },
  backButtonContainer: {
    position: "absolute",
    top: height * 0.06,
    right: width / 12,
    color: color.brown,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  backButton: {
    backgroundColor: color.brown,
    borderRadius: height / 60,
    width: height / 15,
    height: height / 15,
  },
  createButtonContianer: {
    alignSelf: "flex-end",
    color: color.brown,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  createButton: {
    backgroundColor: color.brown,
    width: height / 10,
    height: height / 10,
    borderRadius: height / 60,
  },
  item: {
    width: (width * 5) / 6,
    height: height * 0.085,
  },
  header: {
    fontSize: 16,
    fontWeight: "700",
  },
});
export default JoinOrCreate;
