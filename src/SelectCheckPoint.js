/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, ScrollView, StyleSheet, View, Image, StatusBar, Dimensions } from "react-native";

import {
    Avatar,
    Button,
    Card,
    ListItem,
    Icon
} from "react-native-elements";
//import database from "@react-native-firebase/database";
import MMKVStorage from "react-native-mmkv-storage";
// import AsyncStorage from "@react-native-async-storage/async-storage";

import { color } from "../constants.json";
//import { deleteGame, getGame } from "./Helper/server";
import useInterval from "./useInterval";
//import { Icon } from "react-native-elements/dist/icons/Icon";
// import Icon from "react-native-vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
//import { wsSend } from "../App";

var { height, width } = Dimensions.get('window');
var link = "https://images-na.ssl-images-amazon.com/images/S/pv-target-images/7bbe5762c79ee0ad11c1267483b4a2d5e12868de779eaf751e8e86596e978bbb._V_SX1080_.jpg";


export default SelectCheckPoint = ({ navigation }) => {
    const MMKV = new MMKVStorage.Loader().initialize();
    //const [game, setGame] = useState(MMKV.getMap("joinedGame"));
    const [roomInfo, setRoomInfo] = useState(null);
    const [playerView, setPlayersView] = useState([]);
    //   const gameID = MMKV.getString("gameID");
    //   const userID = MMKV.getString("userID");
    const gameID = "gameID";
    const userID = "userID";
    let status;
    let playerList = [];

    const deleteRoom = () => {
        deleteGame.then(() => {
            MMKV.removeItem("gameID");
            database().ref(`games/${gameID}`).set(null);
            database()
                .ref("users/" + userID)
                .update({ status: "ONLINE" });
        });
        navigation.replace("Home");
    };

    useInterval(() => {
        setRoomInfo(MMKV.getMap("roomInfo"));
    }, 100);

    useEffect(() => {
        let list = [];
        //game.players.map((value) => list.push(value.name));
        playerList = ["Player1", "Player2", "Player3", "Player4", "Player5", "Player6", "Player7", "Player8", "Player9", "Player10"];
        setPlayersView(renderPlayersList());
    }, []);

    useEffect(() => {
        if (roomInfo == null) return;
        status = roomInfo.status;
        let game = MMKV.getMap("joinedGame");
        game.players = roomInfo.players;
        let list = [];
        roomInfo.players.map((value) => {
            list.push(value.name);
            if (value.team != null) {
                if (value.pid === MMKV.getString("userID")) {
                    MMKV.setString("team", value.team);
                    MMKV.setInt("key", value.key);
                }
            }
        });
        setPlayersView(renderPlayersList());
        if (status === "RUNNING") {
            navigation.replace("InGame");
            return;
        }
    }, [roomInfo]);

    const renderPlayersList = () => {
        if (playerList.length === 0) return;
        let list = [],
            i;
        for (i = 0; i < playerList.length; i += 1) {
            list.push(
                <View style={styles.playerListRowConatiner} key={i % 2}>
                    <View style={[styles.Player,
                    {
                        borderBottomRightRadius: height * 0.05,
                        borderTopRightRadius: height * 0.05,
                    }]} key={i}>
                        <Image style={styles.PlayerAvatar} source={{ uri: link }} />
                    </View>
                </View>
            );
        }
        return list;
    };

    const renderButton = () => {
        if (MMKV.getString == "PREPARE_HOST") {
            return <Button containerstyle={styles.button} title={"Confirm"}></Button>;
        }
    };

    const handleOnPressStart = () => {
        wsSend("header: ");
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>
                    {`${game.hostName}'s Room`}
                    {`\nRoom ID: ${game.gid}`}
                </Text>
                <Image style={styles.PlayerAvatar} source={{ uri: link }} />
            </View>
            <View style={styles.playersListContainer}>
                <ScrollView>{playerView}</ScrollView>
            </View>
            <Button
                title={"Start"}
                containerStyle={styles.button}
                titleStyle={{ color: "white", fontSize: 24 }}
                buttonStyle={{ backgroundColor: color.brown }}
                onPress={() => {
                    wsSend(JSON.stringify({ header: "START", content: gameID }));
                    // console.log("start" + gameID);
                }}
            ></Button>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: color.offWhite,
        flex: 1,
    },
    headerContainer: {
        width: width * 0.45,
        height: height * 0.1,
        flexDirection: 'row',
        marginTop: height * 0.05,
        marginBottom: 30,
        borderBottomRightRadius: height / 20,
        borderTopRightRadius: height / 20,
        backgroundColor: "#00000080",
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 10,
        color: "#FFFFFF",
        fontWeight: 'normal',
        paddingLeft: 10,
        textAlign: "left",
    },
    PlayerAvatar: {
        borderRadius: height / 30,
        height: height / 15,
        width: height / 15,
        marginHorizontal: height / 50,
    },
    playersListContainer: { height: "60%" },
    playerListRowConatiner: {
        height: 100,
        flexDirection: "row",
        justifyContent: "flex-start",
        marginVertical: 5,
    },
    Player: {
        width: width * 0.2,
        height: height * 0.1,
        flexDirection: 'row',
        marginTop: 10,
        backgroundColor: "#00000080",
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    PlayerName: {
        fontSize: 14,
        fontWeight: "700",
        color: "white",
        textAlign: "center",
        textAlignVertical: "center",
        flex: 3,
    },
    button: {
        height: 50,
        width: "50%",
        marginVertical: 50,
        alignSelf: "center",
        color: color.brown,
        borderRadius: 10,
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.37,
        shadowRadius: 15,
        elevation: 5,
    },
    backbutton: {
        height: 50,
        width: 50,
        alignSelf: "center",
        backgroundColor: color.brown,
        borderRadius: 10,
    },
});