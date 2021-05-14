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
import * as Progress from "react-native-progress";
import MMKVStorage from "react-native-mmkv-storage";
import { color } from "../constants";

const MMKV = new MMKVStorage.Loader().initialize();

var { height, width } = Dimensions.get("window");

const Friends = ({ navigation }) => {
  const [initializing, setInitializing] = useState(true);
  const [joinOverlayVisible, setJoinOverlayVisible] = useState(false);
  const [roomID, setRoomID] = useState();
  const [creating, setCreating] = useState(false);
  const friends = [];
  const nearbyRooms = [];
  const list = [
    {
      title: "Friends",
      data:
        friends.length === 0
          ? ["So sad, you have no friends, please add oil:("]
          : friends,
    },
  ];
  const Item = ({ title }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView container={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Friends</Text>
      </View>

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
            <Divider style={{ backgroundColor: color.grey }} />
          </>
        )}
      />

      <Button
        containerStyle={styles.createButtonContianer}
        buttonStyle={styles.createButton}
        onPress={() => {
          setJoinOverlayVisible(true);
        }}
        icon={
          <Icon
            name="account-search"
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
    left: width * 0.8,
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
    position: "absolute",
    top: height * 0.85,
    left: width * 0.8,
    alignSelf: "flex-end",
    color: color.brown,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  createButton: {
    backgroundColor: color.brown,
    width: height / 15,
    height: height / 15,
    borderRadius: height / 60,
  },
  item: {
    width: (width * 5) / 6,
    height: height * 0.085,
  },
  header: {
    fontSize: 36,
    fontWeight: "700",
  },
  headerContainer: {
    position: "absolute",
    top: height * 0.07,
    left: width * 0.05,
    color: color.brown,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  creatingText: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    margin: 5,
  },
});
export default Friends;
