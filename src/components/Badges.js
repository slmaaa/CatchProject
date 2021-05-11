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
import documentOnePage24Regular from "@iconify/icons-fluent/document-one-page-24-regular";
import database from "@react-native-firebase/database";
import { join } from "./joinOrCreate";
import { URL } from "../constants.json";
import { wsSend } from "../App";
import { color } from "../constants";

const MMKV = new MMKVStorage.Loader().initialize();

var { height, width } = Dimensions.get("window");
const Badges = ({ navigation }) => {
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
      <Overlay
        isVisible={creating}
        overlayStyle={{ width: "80%", borderRadius: 30 }}
      >
        <Text style={styles.creatingText}>Creating...</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            margin: 5,
          }}
        >
          <Progress.CircleSnail
            indeterminate
            size={100}
            thickness={7}
            color={[color.teamRed, color.teamBlue]}
          />
        </View>
      </Overlay>
      <Overlay
        isVisible={joinOverlayVisible}
        onBackdropPress={() => setJoinOverlayVisible(false)}
        overlayStyle={{ width: "80%" }}
      >
        <Input placeholder="Enter room ID" onChangeText={setRoomID} />
        <Button title={"Join"} onPress={handleOnPressJoin} />
      </Overlay>
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
        onPress={handleCreate}
        icon={<Icon name="plus" type={"material-community"} color={"white"} />}
      />
      <Button
        containerStyle={styles.createButtonContianer}
        buttonStyle={styles.createButton}
        onPress={() => {
          setJoinOverlayVisible(true);
        }}
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
  creatingText: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    margin: 5,
  },
});
export default Badges;