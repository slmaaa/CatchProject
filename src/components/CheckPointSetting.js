import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, Dimensions, Image } from "react-native";
import { getDistance } from "geolib";
import { Button, Icon, Overlay } from "react-native-elements";
import * as Progress from "react-native-progress";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { wsSend } from "../App";
MapboxGL.setAccessToken(
  "pk.eyJ1IjoicmFzaGlkdGhlZGV2ZWxvcGVyIiwiYSI6ImNrYXBncGlwdjBjbG4yd3FqaXl2ams1NHQifQ.jvRoapH6Ae7QHb8Kx4z9FQ"
);
import MMKVStorage from "react-native-mmkv-storage";
import RNLocation, { Location } from "react-native-location";
import { color } from "../constants.json";
const { height, width } = Dimensions.get("window");
const tooCloseDistance = 25;

const CheckPointSetting = ({ navigation }) => {
  const MMKV = new MMKVStorage.Loader().initialize();
  MMKV.setBool("cpsSaved", false);
  const [location, setLocation] = useState(null);
  const [checkpointsCoor, setCheckpointsCoor] = useState([]);
  const [infoToServe, setInfoToServe] = useState([]);
  const [radius, setRadius] = useState(15);
  const [checkpointpower, setcheckpointpower] = useState(5);
  const [saving, setSaving] = useState(false);
  const [tooCloseAlertVisible, setTooCloseAlertVisible] = useState(false);
  const [cpNumberWarningVisible, setCPNumberWaringVisible] = useState(false);
  const mapRef = useRef();
  const cpsRef = useRef([]);
  const numberOfPlayers = MMKV.getMap("joinedGame").players.length;
  const recommendedNumOfCPs =
    (numberOfPlayers / 2) % 2 === 0
      ? numberOfPlayers / 2 + 1
      : numberOfPlayers / 2;
  useEffect(() => {
    let unsub;
    RNLocation.configure({
      distanceFilter: 0, //meters
      desiredAccuracy: {
        ios: "best",
        // highAccuracy
        // balancedPowerAccuracy
        android: "highAccuracy",
      },
      // Android only
      androidProvider: "auto",
      interval: 10, // Milliseconds
      fastestInterval: 10, // Milliseconds
      maxWaitTime: 10, // Milliseconds
      // iOS Only
      activityType: "other",
      allowsBackgroundLocationUpdates: false,
      headingFilter: 1, // Degrees
      headingOrientation: "portrait",
      pausesLocationUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: false,
    });
    RNLocation.requestPermission({
      ios: "whenInUse",
      android: {
        detail: "fine",
      },
    }).then((granted) => {
      if (granted) {
        unsub = RNLocation.subscribeToLocationUpdates((locations) => {
          // console.log("locations", locations)
          if (locations !== undefined && locations.length > 0) {
            setLocation(locations[0]);
          }
        });
      }
    });
    return function cleanup() {
      unsub();
    };
  }, []);
  const handleUndo = () => {
    let list = checkpointsCoor;
    list.pop();
    setCheckpointsCoor(list);
    cpsRef.current.pop();
  };
  const handleAdd = () => {
    mapRef.current.getCenter().then((mapCenter) => {
      let tooClose = false;
      checkpointsCoor.map((val) => {
        if (getDistance(val, mapCenter) < tooCloseDistance) tooClose = true;
      });
      if (tooClose) {
        setTooCloseAlertVisible(true);
        return;
      }
      const id = checkpointsCoor.length;
      const name = "CP" + id;
      console.log(checkpointsCoor.length);
      setCheckpointsCoor([...checkpointsCoor, mapCenter]);
      let selectedcheckpoint = {
        cid: id,
        name: name,
        area: {
          area: "CIRCLE",
          center: { lat: mapCenter[1], lng: mapCenter[0] },
          radius: radius,
        },
        maxLevel: checkpointpower,
      };
      cpsRef.current.push(selectedcheckpoint);
    });
  };
  const handleConfirm = () => {
    if (checkpointsCoor.length !== recommendedNumOfCPs) {
      setCPNumberWaringVisible(true);
    } else uploadCheckpoints();
  };
  const uploadCheckpoints = () => {
    const gameID = MMKV.getString("gameID");
    const checkpoints = cpsRef.current;
    wsSend(
      JSON.stringify({
        header: "SAVE_CPS",
        content: { gid: gameID, checkpoints: checkpoints },
      })
    ).then(() => {
      console.log("testing");
      const interval = setInterval(() => {
        let flag = MMKV.getBool("cpsSaved");
        if (!flag) return;
        clearInterval(interval);
        navigation.navigate("PrepareRoom");
      }, 100);
    });
  };
  const setPoint = (counter) => {
    const id = counter;
    const lan = checkpointsCoor[counter][0];
    const lat = checkpointsCoor[counter][1];
    var coordinate = [lan, lat];
    return (
      <MapboxGL.PointAnnotation
        key={id}
        id={id.toString()}
        coordinate={coordinate}
      />
    );
  };

  const setPoints = () => {
    const item = [];
    for (let i = 0; i < checkpointsCoor.length; i++) {
      item.push(setPoint(i));
    }
    return item;
  };
  return (
    <View style={styles.container}>
      <Overlay
        isVisible={tooCloseAlertVisible}
        overlayStyle={{
          width: "80%",
          borderRadius: 30,
          height: height * 0.3,
          alignContent: "space-between",
          justifyContent: "space-evenly",
        }}
        onBackdropPress={() => {
          setTooCloseAlertVisible(false);
        }}
      >
        <Text style={styles.tooCloseText}>
          Too close to the current checkpoints
        </Text>
        <Button
          type="clear"
          title={"Okay"}
          titleStyle={{ color: "#1976D2" }}
          icon={
            <Icon
              name={"check-circle"}
              type={"material-community"}
              color={"#1976D2"}
            />
          }
          onPress={() => {
            setTooCloseAlertVisible(false);
          }}
        />
      </Overlay>
      <Overlay
        isVisible={cpNumberWarningVisible}
        overlayStyle={{
          width: "80%",
          borderRadius: 30,
          height: height * 0.3,
          alignContent: "space-between",
          justifyContent: "space-evenly",
        }}
        onBackdropPress={() => {
          setTooCloseAlertVisible(false);
        }}
      >
        <Text style={styles.cpNumWaringText}>
          The current number of checkpoints may result in unexpected game time
          and experience. Still continue?
        </Text>
        <Button
          type="clear"
          title={"Yes"}
          titleStyle={{ color: "#1976D2" }}
          icon={
            <Icon
              name={"check-circle"}
              type={"material-community"}
              color={"#1976D2"}
            />
          }
          onPress={() => {
            setCPNumberWaringVisible(false);
            uploadCheckpoints();
          }}
        />
        <Button
          type="clear"
          title={"Back"}
          titleStyle={{ color: color.wrongRed }}
          icon={
            <Icon
              name={"close-circle"}
              type={"material-community"}
              color={color.wrongRed}
            />
          }
          onPress={() => {
            setCPNumberWaringVisible(false);
          }}
        />
      </Overlay>
      <Overlay
        isVisible={saving}
        overlayStyle={{ width: "80%", borderRadius: 30 }}
      >
        <Text style={styles.savingText}>Saving...</Text>
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
      <View style={styles.mapContainer}>
        <MapboxGL.MapView style={styles.map} ref={mapRef}>
          <MapboxGL.Camera
            defaultSettings={{
              zoomLevel: 17,
            }}
            followUserLocation={true}
          />
          <MapboxGL.UserLocation />

          {setPoints()}
        </MapboxGL.MapView>
      </View>
      <View style={styles.crosshairContainer}>
        <Image
          source={require("../../assets/img/Target.png")}
          style={styles.crosshairImage}
        />
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          CP count: {checkpointsCoor.length} / {recommendedNumOfCPs}
        </Text>
      </View>
      <Button
        containerStyle={styles.confirmButtonContainer}
        buttonStyle={styles.confirmButton}
        onPress={handleConfirm}
        icon={<Icon name="check" type={"material"} color={"white"} />}
      />
      <Button
        containerStyle={styles.cancelButtonContainer}
        buttonStyle={styles.cancelButton}
        onPress={() => navigation.goBack()}
        icon={<Icon name="close" type={"material"} color={"white"} />}
      />
      <Button
        icon={
          <Icon
            name="plus"
            type={"material-community"}
            color={"white"}
            size={height / 15}
          />
        }
        containerStyle={styles.addButton}
        buttonStyle={{ backgroundColor: color.brown, borderRadius: 60 }}
        onPress={handleAdd}
      />
      <Button
        icon={
          <Icon
            name="undo-variant"
            type={"material-community"}
            color={"white"}
            size={height / 15}
          />
        }
        containerStyle={styles.undoButton}
        buttonStyle={{ backgroundColor: color.brown, borderRadius: 60 }}
        onPress={handleUndo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  crosshairContainer: {
    position: "absolute",
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
  },
  crosshairImage: { height: height / 6, width: height / 6 },
  circle: {
    marginTop: 0,
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  mapContainer: {
    width: "100%",
    height: "100%",
    // borderRadius: 50/2,
    backgroundColor: "rgba(52, 52, 52, 0)",
  },
  map: {
    flex: 1,
    position: "relative",
  },
  addButton: {
    position: "absolute",
    top: height * 0.9,
    alignSelf: "center",
    color: color.brown,
    borderRadius: height / 15,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.37,
    shadowRadius: height / 15,
    elevation: 5,
  },
  undoButton: {
    position: "absolute",
    top: height * 0.9,
    left: 10,
    color: color.brown,
    borderRadius: height / 15,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.37,
    shadowRadius: height / 15,
    elevation: 5,
  },
  headerContainer: {
    position: "absolute",
    width: width * 0.45,
    height: height * 0.1,
    flexDirection: "row",
    top: height * 0.03,
    marginBottom: height * 0.05,
    borderBottomRightRadius: height / 20,
    borderTopRightRadius: height / 20,
    backgroundColor: "#00000080",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "700",
    paddingLeft: 10,
    textAlign: "center",
    marginRight: 10,
  },
  confirmButtonContainer: {
    position: "absolute",
    top: height * 0.06,
    right: 10,
    color: color.brown,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  confirmButton: {
    backgroundColor: color.brown,
    borderRadius: height / 60,
    width: height / 15,
    height: height / 15,
  },
  cancelButtonContainer: {
    position: "absolute",
    top: height * 0.15,
    right: 10,
    color: color.brown,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  cancelButton: {
    backgroundColor: color.brown,
    borderRadius: height / 60,
    width: height / 15,
    height: height / 15,
  },
  buttonText: {
    fontSize: 20,
    color: "white",
  },
  tooCloseText: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    textAlignVertical: "center",
  },
  savingText: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    margin: 5,
  },
  cpNumWaringText: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});

export default CheckPointSetting;
