/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, ScrollView, StyleSheet, View, Image, Dimensions, TouchableOpacity } from "react-native";
import { Avatar, Button, Card, ListItem } from "react-native-elements";

import { color } from "../constants.json";
import useInterval from "./useInterval";
import Icon from "react-native-vector-icons";
import { renderNode } from "react-native-elements/dist/helpers";

var { height, width } = Dimensions.get('window');
var player = {
    pid: "pid1",
    name: "Name",
    avatar: "https://images-na.ssl-images-amazon.com/images/S/pv-target-images/7bbe5762c79ee0ad11c1267483b4a2d5e12868de779eaf751e8e86596e978bbb._V_SX1080_.jpg"
}

export default Test = ({ navigation }) => {
    const [roomInfo, setRoomInfo] = useState(null);
    const [playerView, setPlayersView] = useState([]);

    var game = {
        gid: "Game ID",
        gname: "gameName",
        status: "PREPARE",
        hostID: "hostuserID",
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

    return (
        <View style={styles.container}>
            {/* <View style={styles.headerContainer}> */}
            <TouchableOpacity style={[styles.card]}>
                <Text style={styles.title}>
                    {`${game.hostName}'s Room`}
                    {`\nRoom ID: ${game.gid}`}
                </Text>
                <Image style={styles.cardImage} source={{ uri: player.avatar }} />
            </TouchableOpacity>
        </View>
    )
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: color.darkGrey,
        flex: 1,

    },
    card: {
        width: "45%",
        height: "10%",
        flexDirection: 'row',
        marginTop:10,
        borderBottomRightRadius: height/20,
        borderTopRightRadius: height/20,
        backgroundColor: "#00000080",
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardImage: {
        borderRadius: height/30,
        height: height/15,
        width: height/15,
        marginRight: height/40,
    },
    title: {
        fontSize: 10,
        color: "#FFFFFF",
        fontWeight: 'normal',
        paddingLeft: 10,
    },
});
