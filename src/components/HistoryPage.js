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
  StatusBar,
  ScrollView,
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
import documentOnePage24Regular from "@iconify/icons-fluent/document-one-page-24-regular";
import database from "@react-native-firebase/database";
import { join } from "./joinOrCreate";
import { URL } from "../constants.json";
import { wsSend } from "../App";
import { color } from "../constants";

const MMKV = new MMKVStorage.Loader().initialize();

var { height, width } = Dimensions.get("window");
const HistoryPage = ({ navigation }) => {
  const [initializing, setInitializing] = useState(true);
  const [joinOverlayVisible, setJoinOverlayVisible] = useState(false);
  const [roomID, setRoomID] = useState();
  const [creating, setCreating] = useState(false);
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

  async function setGame() {
    const game = {
      gid: "None",
      gname: "None",
      status: "WAITING",
      hostID: MMKV.getString("userID"),
      hostName: MMKV.getString("userName"),
      players: [
        {
          pid: MMKV.getString("userID"),
          name: MMKV.getString("userName"),
          avatar: "None",
        },
      ],
      teams: ["RED", "BLUE"],
    };

    let createdGame = null;
    wsSend(JSON.stringify({ header: "CREATE", content: game }))
      .then(async () => {
        let interval = setInterval(() => {
          createdGame = MMKV.getMap("joinedGame");
          if (createdGame == null) return;
          clearInterval(interval);
          MMKV.setString("gameID", createdGame.gid.toString());
          database()
            .ref("users/" + MMKV.getString("userID"))
            .update({
              gameID: createdGame.gid.toString(),
              status: "PREPARE_HOST",
            });
          MMKV.setString("userStatus", "PREPARE_HOST");
          navigation.replace("Waiting");
        }, 100);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  const handleCreate = () => {
    setCreating(true);
    setGame();
  };
  const handleOnPressJoin = () => {
    let game;
    wsSend(
      JSON.stringify({
        header: "JOIN",
        content: {
          player: {
            pid: MMKV.getString("userID"),
            name: MMKV.getString("userName"),
            avatar: "None",
          },
          gid: roomID,
        },
      })
    ).then(() => {
      let interval = setInterval(() => {
        game = MMKV.getMap("joinedGame");
        if (game == null) return;
        clearInterval(interval);
        MMKV.setString("gameID", roomID);
        MMKV.setString("gameName", game.gname);
        database()
          .ref("users/" + MMKV.getString("userID"))
          .update({ gameID: roomID, status: "WAITING" });
        MMKV.setString("userStatus", "WAITING");
        navigation.replace("Waiting", {
          gameName: game.gname,
        });
      }, 100);
    });
  };
  return (
    <SafeAreaView container={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>History</Text>
      </View>
      
      <Button
        containerStyle={styles.backButtonContainer}
        buttonStyle={styles.backButton}
        onPress={() => navigation.goBack()}
        icon={<Icon name="arrow-back" type={"material"} color={"white"} />}
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
    fontSize: 36,
    fontWeight: "700",
  },
  headerContainer:{
    position:"absolute",
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
  scrollContainer: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
});
export default HistoryPage;