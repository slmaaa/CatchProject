import React, { useEffect, useState } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  ScrollView,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import MMKVStorage from "react-native-mmkv-storage";
import database from "@react-native-firebase/database";
import { wsSend } from "../App";
import { color } from "../constants";
import Medal1 from "./medals/military-medal.svg";
import Medal2 from "./medals/military-medal-2.svg";
import Medal3 from "./medals/military-medal-3.svg";
import Medal4 from "./medals/military-medal-4.svg";
import Medal5 from "./medals/1st-place-medal.svg";
import Medal6 from "./medals/sports-medal.svg";
const MMKV = new MMKVStorage.Loader().initialize();

var { height, width } = Dimensions.get("window");
const Badges = ({ navigation }) => {
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
        <Text style={styles.header}>Badges</Text>
      </View>

      <Button
        containerStyle={styles.backButtonContainer}
        buttonStyle={styles.backButton}
        onPress={() => navigation.goBack()}
        icon={<Icon name="arrow-back" type={"material"} color={"white"} />}
      />

      <View style={styles.individualContainer}>
        <Text style={styles.normalText}>Individual</Text>
      </View>
      <ScrollView style={styles.scrollViewIndividual} horizontal={true}>
        <View>
          <Medal1 width={100} height={100} />
          <Text>Distance(0/500m)</Text>
        </View>

        <View>
          <Medal2 width={100} height={100} />
          <Text> Riddles(0/2)</Text>
        </View>

        <View>
          <Medal3 width={100} height={100} />
          <Text> Smartest(0/1)</Text>
        </View>

        <View>
          <Medal4 width={100} height={100} />
          <Text> Sportest(0/1)</Text>
        </View>
      </ScrollView>

      <View style={styles.teamContainer}>
        <Text style={styles.normalText}>Team</Text>
      </View>

      <ScrollView style={styles.scrollViewTeam} horizontal={true}>
        <View style={styles.container}>
          <Medal5 width={100} height={100} />
          <Text> Win(0/1)</Text>
        </View>

        <View>
          <Medal6 width={100} height={100} />
          <Text> Win(0/3)</Text>
        </View>
      </ScrollView>
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
  individualContainer: {
    position: "absolute",
    top: height * 0.15,
    left: width * 0.05,
    color: color.brown,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  teamContainer: {
    position: "absolute",
    top: height * 0.5,
    left: width * 0.05,
    color: color.brown,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  normalText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    margin: 5,
  },
  scrollContainer: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollViewIndividual: {
    position: "absolute",
    top: height * 0.22,
    left: width * 0.05,
    backgroundColor: color.primaryDark,
    marginHorizontal: 20,
  },
  scrollViewTeam: {
    position: "absolute",
    top: height * 0.57,
    left: width * 0.05,
    backgroundColor: color.primaryDark,
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
});
export default Badges;
