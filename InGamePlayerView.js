/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, ScrollView, StyleSheet, View, Image, StatusBar, Dimensions, ImageBackground } from "react-native";
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

import { color } from "./constants.json";
//import { deleteGame, getGame } from "./Helper/server";
import useInterval from "./useInterval";
//import { Icon } from "react-native-elements/dist/icons/Icon";
// import Icon from "react-native-vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
//import { wsSend } from "../App";

var { height, width } = Dimensions.get('window');
var link = "https://images-na.ssl-images-amazon.com/images/S/pv-target-images/7bbe5762c79ee0ad11c1267483b4a2d5e12868de779eaf751e8e86596e978bbb._V_SX1080_.jpg";

export default InGamePlayerView = ({ navigation }) => {
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

    var game = {
        gid: "123456",
        gname: "gameName",
        status: "PREPARE",
        //hostID: MMKV.getString("userID"),
        hostID: "userID",
        //hostName: MMKV.getString("userName"),
        hostName: "userName",
        checkpoints: [
            {
                cp1: "cp1",
                cp2: "cp2",
                cp3: "cp3",
                cp4: "cp4",
                cp5: "cp5",
            },
        ],
        players: [
            {
                //   pid: MMKV.getString("userID"),
                //   name: MMKV.getString("userName"),
                //   avatar: "None",
                pid: "pid1",
                name: "userName1",
                avatar: "None1",
            },
            {
                pid: "pid2",
                name: "userName2",
                avatar: "None2",
            },
            {
                pid: "pid3",
                name: "userName3",
                avatar: "None3",
            },
            //   {
            //     pid: "pid4",
            //     name: "userName4",
            //     avatar: "None4",
            //   },
            //   {
            //     pid: "pid5",
            //     name: "userName5",
            //     avatar: "None5",
            //   },
            //   {
            //     pid: "pid6",
            //     name: "userName6",
            //     avatar: "None6",
            //   },
            //   {
            //     pid: "pid7",
            //     name: "userName7",
            //     avatar: "None7",
            //   },
            //   {
            //     pid: "pid8",
            //     name: "userName8",
            //     avatar: "None8",
            //   }
        ],
        teams: ["RED", "BLUE"],
    };

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
        playerList = ["Player1", "Player2", "Player3", "Player4", "Player5", "Player6", "Player7", "Player8", "Player9"];//, "Player10"];
        // setPlayersView(renderPlayersList());
    }, []);

    useEffect(() => {
        if (roomInfo == null) return;
        status = roomInfo.status;
        //let game = MMKV.getMap("joinedGame");
        game.players = roomInfo.players;
        //let list = [];
        // roomInfo.players.map((value) => {
        //   list.push(value.name);
        //   if (value.team != null) {
        //     if (value.pid === MMKV.getString("userID")) {
        //       MMKV.setString("team", value.team);
        //       MMKV.setInt("key", value.key);
        //     }
        //   }
        // });
        setPlayersView(renderPlayersList());
        if (status === "RUNNING") {
            navigation.replace("InGame");
            return;
        }
    }, [roomInfo]);

    const renderButton = () => {
        if (MMKV.getString == "PREPARE_HOST") {
            return <Button containerstyle={styles.button} title={"Confirm"}></Button>;
        }
    };

    const handleOnPressStart = () => {
        wsSend("header: ");
    };

    // console.log("width: ", width, "height: ", height);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <View style={styles.headerContainer3}>
                    <Image style={styles.PlayerAvatar} source={{ uri: link }} />
                    <Text style={styles.headerText}>
                        {`${game.hostName}`}
                    </Text>
                    <Text style={styles.headerText}>
                        {`0.0KM/0 Riddles`}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: color.offWhite,
        flex: 1,
    },
    headerContainer3: {
        width: width * 0.6,
        height: height * 0.078 + 20,
        flexDirection: 'row',
        marginTop: height * 0.08,
        paddingLeft: 0,
        marginBottom: height * 0.1,
        borderBottomLeftRadius: height / 20 + 5,
        borderTopLeftRadius: height / 20 + 5,
        borderTopWidth: 5,
        borderBottomWidth: 5,
        borderLeftWidth: 5,
        backgroundColor: "#00000080",
        borderColor: "#98E7FD",
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    headerText: {
        fontSize: height * 0.016,
        color: "#FFFFFF",
        fontWeight: 'normal',
        paddingRight: 5,
        textAlign: "left",
    },
    PlayerAvatar: {
        borderRadius: height / 30,
        height: height * 0.078 - 5,
        width: height * 0.078 - 5,
        marginHorizontal: height / 80,
    },
    playersListContainer: { height: "50%" },
    playerListRowConatiner: {
        height: height / 8,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    LeftPlayer: {
        width: width * 0.40,
        height: height * 0.1,
        flexDirection: 'row',
        backgroundColor: "#00000080",
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderTopWidth: 5,
        borderBottomWidth: 5,
        borderRightWidth: 5,
        borderBottomRightRadius: height * 0.05,
        borderTopRightRadius: height * 0.05,
        borderColor: "#98E7FD"
    },
    PlayerName: {
        fontSize: 14,
        fontWeight: "700",
        color: "white",
        textAlign: "left",
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
    backButton: {
        marginLeft: height / 6,
        borderRadius: height / 60,
        height: height / 15,
        width: height / 15,
        backgroundColor: color.brown,
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "center",
        marginHorizontal: height / 80,
    },
    IconReplacementText: {
        fontSize: 30,
        color: "white",
        textAlignVertical: "center",
        justifyContent: "center"
    },
});
