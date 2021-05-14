import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Alert,
  Modal,
  TouchableHighlight,
  Button,
  Dimensions,
} from "react-native";

import MapboxGL from "@react-native-mapbox-gl/maps";
const accessToken =
  "pk.eyJ1IjoicmFzaGlkdGhlZGV2ZWxvcGVyIiwiYSI6ImNrYXBncGlwdjBjbG4yd3FqaXl2ams1NHQifQ.jvRoapH6Ae7QHb8Kx4z9FQ";
MapboxGL.setAccessToken(accessToken);
import Swiper from "react-native-swiper";
import {ButtonGroupProps, Icon,Button as Bt} from "react-native-elements";
import { getDistance } from "geolib";
import Icon1 from "react-native-vector-icons/FontAwesome5";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";
import Icon3 from "react-native-vector-icons/MaterialIcons";
import Icon4 from "react-native-vector-icons/Ionicons";
import MMKVStorage from "react-native-mmkv-storage";
import * as Progress from "react-native-progress";
import { color } from "../constants";
const { height, width } = Dimensions.get("window");
const MMKV = new MMKVStorage.Loader().initialize();
const App = ({ navigation }) => {
  const [route, setRoute] = useState(null);
  const [ModalOpen, setModalOpen] = useState(false);
  const [coordinates, setcoordinates] = useState([114.2655, 22.3364]);
  const selectedHistory = MMKV.getMap("selectedHistory");
  let coorList = [];
  selectedHistory.locationRecord.map((val)=>{
    coorList.push([val.longitude,val.latitude])
  })
 const featureCollection = [
    {
      type: "Feature",
      properties: { color: "red" },
      geometry: {
        type: "LineString",
        coordinates: coorList,
      },
    },
  ];

  const modalslideone = () => {
    const distance = selectedHistory.distance / 1000;
    const timeSpent = Math.round(
      (selectedHistory.endTime - selectedHistory.startTime) / 60
    );
    const speed = parseInt(timeSpent / distance);
    return (
      <View style={styles.slide1}>
        <Icon1 name="running" size={50} color="yellow" />
        <Text style={styles.text2}>Total Distance:</Text>
        <Text style={styles.text}>{distance} km</Text>
        <Text style={styles.text}> </Text>
        <Icon3 name="speed" size={50} color="orange" />
        <Text style={styles.text2}>Average speed:</Text>
        <Text style={styles.text}>{speed} mins / km</Text>
        <Text style={styles.text}> </Text>
        <Icon2 name="timer-outline" size={50} color="green" />
        <Text style={styles.text2}>Time used</Text>
        <Text style={styles.text}>{timeSpent} minutes</Text>
      </View>
    );
  };
  const modalslidetwo = () => {
    const calburn = parseFloat(
      (selectedHistory.distance / 1.632) * 100
    ).toFixed(2);
    const fatburn = parseFloat((calburn / 3500) * 453.592).toFixed(2);
    return (
      <View style={styles.slide1}>
        <Icon1 name="fire" size={50} color="red" />
        <Text style={styles.text2}>Calories burns</Text>
        <Text style={styles.text}>{calburn} cal</Text>
        <Text style={styles.text}> </Text>
        <Text style={styles.text}> </Text>
        <Icon4 name="body" size={50} color="red" />
        <Text style={styles.text2}>Fat burns</Text>
        <Text style={styles.text}>{fatburn} grams</Text>
      </View>
    );
  };
  const modalslidethree = () => {
    return (
      <View style={styles.slide1}>
        <Text style={styles.text}>Make a new Friend?</Text>
      </View>
    );
  };
  const modal = () => {
    return (
      <Modal visible={ModalOpen} animationType="fade" transparent={true}>
        <TouchableHighlight
          style={styles.centeredView}
          onPress={() => setModalOpen(false)}
        >
          <Swiper style={styles.wrapper} showsButtons={true}>
            {modalslideone()}
            {modalslidetwo()}
            {modalslidethree()}
          </Swiper>
        </TouchableHighlight>
      </Modal>
    );
  };
  const detailbutton = () => {
    return (
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "grey" : "#2196F3",
          },
          styles.button1,
        ]}
        onPress={() => setModalOpen(true)}
      >
        <Text style={styles.buttonText}>Details</Text>
      </Pressable>
    );
  };
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView style={styles.map}>
          <MapboxGL.Camera zoomLevel={15} centerCoordinate={coordinates} />
          {/* {
          route && (
           <MapboxGL.ShapeSource id='shapeSource' shape={route}>
              <MapboxGL.LineLayer id='lineLayer' style={{lineWidth: 5, lineJoin: 'bevel', lineColor: 'green'}} />
            </MapboxGL.ShapeSource>
          )
        } */}
          <MapboxGL.ShapeSource
            id="line"
            shape={{
              type: "FeatureCollection",
              features: featureCollection,
            }}
          >
            {featureCollection.map((item) => {
              return (
                <MapboxGL.LineLayer
                  id={"linelayer"}
                  style={{
                    lineJoin: "round",
                    lineColor: item.properties.color,
                    lineWidth: 5,
                    lineCap: "round",
                  }}
                />
              );
            })}
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>
        {detailbutton()}
        {modal()}
        <Bt
        containerStyle={styles.backButtonContainer}
        buttonStyle={styles.backButton}
        onPress={() => navigation.goBack()}
        icon={<Icon name="arrow-back" type={"material"} color={"white"} />}
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9DD6EB",
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#97CAE5",
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#92BBD9",
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  text2: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "70%",
    height: "70%",
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    //alignItems: "center",
    //shadowColor: "#001",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 15,
    padding: 7,
    elevation: 2,
    top: "95%",
    right: "0%",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  page: {
    flex: 1,
  },
  container: {
    width: "100%",
    height: "100%",
    // borderRadius: 50/2,
    backgroundColor: "rgba(52, 52, 52, 0)",
  },
  map: {
    flex: 1,
    position: "relative",
  },
  button1: {
    borderRadius: 30,
    padding: 6,
    height: "7%",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    position: "absolute",
    top: "90%",
    right: "25%",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  containerfd: {
    marginTop: 20,
    flex: 1,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
  },
  textfd: {
    fontSize: 20,
    color: "#101010",
    marginTop: 60,
    fontWeight: "700",
  },
  listItemfd: {
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    borderRadius: 35,
  },
  coverImagefd: {
    width: 50,
    height: 50,
    borderRadius: 35,
  },
  metaInfofd: {
    marginLeft: 10,
  },
  titlefd: {
    fontSize: 18,
    width: 200,
    padding: 10,
  },
});

export default App;
