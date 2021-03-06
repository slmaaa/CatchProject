/*
HomeScreen:
Shown nearby player location and route player to screens
*/
import React from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Dimensions,
} from "react-native";
import { Button } from "react-native-elements";
import MMKVStorage from "react-native-mmkv-storage";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { Icon } from "react-native-elements";
import { color } from "../constants";
import auth from "@react-native-firebase/auth";
MapboxGL.setAccessToken(
  "pk.eyJ1IjoiaGVjdG9yY2hjaCIsImEiOiJja205YmhldXUwdHQ1Mm9xbGw4N2RodndhIn0.yX90QKE2jcgG-7V5wOGXeQ"
);

const MMKV = new MMKVStorage.Loader().initialize();
const { height, width } = Dimensions.get("window");

const Home = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <MapboxGL.MapView
        style={styles.map}
        pitchEnabled={false}
        scrollEnabled={false}
        rotateEnabled={false}
        compassEnabled={false}
      >
        <MapboxGL.Camera followUserLocation={true} followUserMode={"compass"} />
        <MapboxGL.UserLocation />
      </MapboxGL.MapView>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{MMKV.getString("userName")}</Text>
        <Image
          style={styles.playerAvatar}
          source={{
            uri: MMKV.getString("userAvatar"),
          }}
        />
      </View>

      <Button
        containerStyle={styles.historyButtonContianer}
        buttonStyle={styles.historyButton}
        onPress={() => {
          navigation.navigate("SelectHistory");
        }}
        icon={<Icon name="archive" type="material-community" color={"white"} />}
      />

      <Button
        containerStyle={styles.badgesButtonContianer}
        buttonStyle={styles.badgesButton}
        onPress={() => {
          navigation.navigate("Badges");
        }}
        icon={<Icon name="medal" type="material-community" color={"white"} />}
      />

      <Button
        containerStyle={styles.friendsButtonContianer}
        buttonStyle={styles.friendsButton}
        onPress={() => {
          navigation.navigate("Friends");
        }}
        icon={
          <Icon
            name="account-multiple"
            type="material-community"
            color={"white"}
          />
        }
      />
      <Button
        containerStyle={styles.logoutButtonContianer}
        buttonStyle={styles.logoutButton}
        onPress={() => {
          auth().signOut();
        }}
        icon={<Icon name="logout" type="material-community" color={"white"} />}
      />

      <Button
        title={"Game"}
        containerStyle={styles.button}
        titleStyle={{ color: "white", fontSize: 24 }}
        buttonStyle={{ backgroundColor: color.brown }}
        onPress={() => {
          navigation.navigate("joinOrCreate");
        }}
      ></Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  button: {
    position: "absolute",
    height: 50,
    top: height * 0.85,
    width: "40%",
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
  historyButtonContianer: {
    position: "absolute",
    top: height * 0.016,
    left: width * 0.8,
    color: color.brown,
    alignItems: "flex-end",
    justifyContent: "center",
    margin: 10,
  },
  historyButton: {
    backgroundColor: color.brown,
    width: height / 15,
    height: height / 15,
    borderRadius: height / 60,
  },
  badgesButtonContianer: {
    position: "absolute",
    top: height * 0.11,
    left: width * 0.8,
    color: color.brown,
    alignItems: "flex-end",
    justifyContent: "center",
    margin: 10,
  },
  badgesButton: {
    backgroundColor: color.brown,
    width: height / 15,
    height: height / 15,
    borderRadius: height / 60,
  },
  friendsButtonContianer: {
    position: "absolute",
    top: height * 0.2,
    left: width * 0.8,
    color: color.brown,
    alignItems: "flex-end",
    justifyContent: "center",
    margin: 10,
  },
  friendsButton: {
    backgroundColor: color.brown,
    width: height / 15,
    height: height / 15,
    borderRadius: height / 60,
  },
  logoutButtonContianer: {
    position: "absolute",
    top: height * 0.29,
    left: width * 0.8,
    color: color.brown,
    alignItems: "flex-end",
    justifyContent: "center",
    margin: 10,
  },
  logoutButton: {
    backgroundColor: color.brown,
    width: height / 15,
    height: height / 15,
    borderRadius: height / 60,
  },
  headerContainer: {
    position: "absolute",
    width: width * 0.45,
    height: height * 0.1,
    flexDirection: "row",
    marginTop: height * 0.03,
    paddingRight: height / 60,
    borderBottomRightRadius: height / 20,
    borderTopRightRadius: height / 20,
    backgroundColor: "#00000080",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 16,
    color: "white",
    fontWeight: "700",
    textAlign: "left",
    marginLeft: height / 30,
  },
  playerAvatar: {
    borderRadius: height / 30,
    height: height / 15,
    width: height / 15,
    backgroundColor: "white",
  },
});
export default Home;
