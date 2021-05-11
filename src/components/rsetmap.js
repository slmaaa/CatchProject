import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { Button, Icon } from "react-native-elements";
import MapboxGL from "@react-native-mapbox-gl/maps";
MapboxGL.setAccessToken(
  "pk.eyJ1IjoicmFzaGlkdGhlZGV2ZWxvcGVyIiwiYSI6ImNrYXBncGlwdjBjbG4yd3FqaXl2ams1NHQifQ.jvRoapH6Ae7QHb8Kx4z9FQ"
);
import RNLocation, { Location } from "react-native-location";
import { color } from "../constants.json";
const { height, width } = Dimensions.get("window");
const App = () => {
  const [coordinates, setcoordinates] = useState([114.2655, 22.3364]);
  const [location, setLocation] = useState(null);
  const [addcor, setaddcor] = useState([]);
  const [mapcenter, setmapcenter] = useState([]);
  const [infotoserve, setinfotoserve] = useState({
    cid: "",
    name: "",
    area: {
      area: "",
      center: { lat: "", lng: "" },
      radius: "",
    },
    maxLevel: "",
  });
  const [radius, setradius] = useState(10);
  const [checkpointpower, setcheckpointpower] = useState(5);
  let selectedcheckpoints = [];
  //const[ModalOpen, setModalOpen] = useState(false);
  const mapRef = useRef();
  useEffect(() => {
    mapRef.current.getCenter().then((val) => setmapcenter(val));
  });
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
  //   const modal = () =>{
  //     return(
  //        <Modal visible={ModalOpen} animationType='slide' style={styles.centeredView}>
  //           <TouchableHighlight style={styles.centeredView} onPress={() => setModalOpen(false)}>
  //              <Text>hello</Text>
  //           </TouchableHighlight>
  //       </Modal>
  //     )
  // }

  const addbutton = () => {
    //setModalOpen(true)
    const id = addcor.length + 1;
    var name = "name";
    console.log(addcor.length);
    setaddcor([...addcor, mapcenter]); // centerlat,lng hvent implement
    let selectedcheckpoint = {
      cid: id,
      name: name,
      area: {
        area: "CIRCLE",
        center: { lat: mapcenter[0], lng: mapcenter[1] },
        radius: { radius },
      },
      maxLevel: { checkpointpower },
    };
    //selectedcheckpoints.push(selectedcheckpoint);
    setinfotoserve({ ...infotoserve, selectedcheckpoint });
  };
  const startbutton = () => {
    console.log(selectedcheckpoints.length);
    //Alert.alert(infotoserve.length)
    console.log(infotoserve.length);
  };

  const setpoint = (counter) => {
    const id = counter;
    const lan = addcor[counter][0];
    const lat = addcor[counter][1];
    var coordinate = [lan, lat];
    return (
      <MapboxGL.PointAnnotation
        key={id}
        id={id.toString()}
        coordinate={coordinate}
      ></MapboxGL.PointAnnotation>
    );
  };

  const setpoints = () => {
    const item = [];
    for (let i = 0; i < addcor.length; i++) {
      item.push(setpoint(i));
    }
    return item;
  };
  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapboxGL.MapView style={styles.map} ref={mapRef}>
          <MapboxGL.Camera
            defaultSettings={{
              zoomLevel: 17,
            }}
            followUserLocation={true}
          />
          <MapboxGL.UserLocation />

          {setpoints()}
        </MapboxGL.MapView>

        {/* <View style={styles.shootercircle} /> */}
      </View>
      <Button
        icon={
          <Icon
            name="plus"
            type={"material-community"}
            color={"white"}
            size={height / 15}
          />
        }
        containerStyle={styles.button}
        buttonStyle={{ backgroundColor: color.brown, borderRadius: 60 }}
        onPress={addbutton}
      ></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: "10%",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "1%",
    right: "0%",
  },
  input2: {
    height: "10%",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "1%",
    left: "0%",
  },
  shooter: {
    borderRadius: 30,
    padding: 6,
    height: "10%",
    width: "1%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "45%",
    right: "50%",
    flex: 1,
    backgroundColor: "black",
  },
  shooter2: {
    borderRadius: 30,
    padding: 6,
    height: "1%",
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "49%",
    right: "44%",
    backgroundColor: "black",
  },
  circle: {
    marginTop: 0,
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
  },
  container: {
    flex: 1,
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
  button: {
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
  buttonText: {
    fontSize: 20,
    color: "white",
  },
  texttop: {
    fontSize: 20,
    color: "grey",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});

export default App;
