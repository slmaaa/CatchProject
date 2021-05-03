import React, { useState, useEffect } from "react";
import { StyleSheet, View, Pressable, Text, Alert } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
MapboxGL.setAccessToken(
  "pk.eyJ1IjoicmFzaGlkdGhlZGV2ZWxvcGVyIiwiYSI6ImNrYXBncGlwdjBjbG4yd3FqaXl2ams1NHQifQ.jvRoapH6Ae7QHb8Kx4z9FQ"
);
import Geolocation from "react-native-geolocation-service";
import RNLocation, { Location } from "react-native-location";
const App = () => {
  const [location, setLocation] = useState(null);
  const [coordinates, setcoordinates] = useState([114.2655, 22.3364]);
  //   const [clicor,setclicor] = useState([114.2655,22.3364]);
  const [addcor, setaddcor] = useState([]);
  useEffect(() => {
    //websocketSetup();
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
        let locationSubscription = RNLocation.subscribeToLocationUpdates(
          (locations) => {
            // console.log("locations", locations)
            if (locations !== undefined && locations.length > 0) {
              let currentLocation = locations[0];
              console.log(currentLocation.longitude);
              console.log(currentLocation.latitude);
              setcoordinates([
                JSON.stringify(currentLocation.longitude),
                JSON.stringify(currentLocation.latitude),
              ]);
              // setBlueTeamScore(Math.floor(Math.random() * 100));
              // setRedTeamScore(Math.floor(Math.random() * 100));
            }
          }
        );
      }
    });
  }, [addcor]);
  //   const addbutton = ()=>{
  //     Alert.alert("addbutton")
  //     console.log("hihi")
  //   }
  const startbutton = () => {
    Alert.alert("startbutton");
  };

  const setpoint = (counter) => {
    const id = counter;
    const lan = addcor[counter][0];
    const lat = addcor[counter][1];
    coordinate = [lan, lat];
    const redteam = addcor[counter][2];
    const blueteam = addcor[counter][3];

    const colorStyles1 = {
      borderRightColor: "white",
      borderLeftColor: "red",
      borderRightWidth: 40 - redteam,
      borderLeftWidth: redteam,
    };
    const colorStyles2 = {
      borderRightColor: "white",
      borderLeftColor: "blue",
      borderRightWidth: 40 - blueteam,
      borderLeftWidth: blueteam,
    };
    return (
      <MapboxGL.PointAnnotation key={id} coordinate={coordinate}>
        <View style={styles.container}>
          <View style={styles.circle} />
        </View>
      </MapboxGL.PointAnnotation>
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
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView
          style={styles.map}
          onPress={(event) => {
            // const {geometry, properties} = event;
            Alert.alert(
              "Add New point",
              "Add latitude" +
                event.geometry.coordinates[0] +
                " and longtitude " +
                event.geometry.coordinates[1] +
                " to the Map?",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "OK",
                  onPress: () =>
                    setaddcor([
                      ...addcor,
                      [
                        event.geometry.coordinates[0],
                        event.geometry.coordinates[1],
                      ],
                    ]),
                },
              ]
            );
            //Alert.alert("Add latitude"+event.geometry.coordinates[0]+" and longtitude " + event.geometry.coordinates[1]+" to the Map?")
            //setaddcor([...addcor, [event.geometry.coordinates[0],event.geometry.coordinates[1]]]);

            //    this.setState({
            //      latitude: geometry.coordinates[1],
            //      longitude: geometry.coordinates[0],
            //      screenPointX: properties.screenPointX,
            //      screenPointY: properties.screenPointY,
            //    });
          }}
        >
          <MapboxGL.Camera zoomLevel={14} centerCoordinate={coordinates} />
          <MapboxGL.PointAnnotation
            key="pointAnnotation"
            id="pointAnnotation"
            coordinate={coordinates}
          >
            {/* currentLocation */}
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: "#00cccc",
                borderRadius: 50,
                borderColor: "#fff",
                borderWidth: 3,
              }}
            />
          </MapboxGL.PointAnnotation>
          {setpoints()}
        </MapboxGL.MapView>
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "lightblue" : "green",
            },
            styles.button1,
          ]}
          onPress={startbutton}
        >
          <Text style={styles.buttonText}>Start</Text>
        </Pressable>
        {/* <Pressable
        style={({pressed}) => [
          {
            backgroundColor: pressed ? 'lightblue' : 'blue',
          },
          styles.button2,
        ]}
        onPress={addbutton}>
        <Text style={styles.buttonText}>Add</Text>
       </Pressable> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    marginTop: 0,
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    backgroundColor: "rgba(52, 52, 52, 0.5)",
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
    height: "10%",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    position: "absolute",
    top: "90%",
    right: "25%",
  },
  button2: {
    borderRadius: 30,
    padding: 6,
    height: "10%",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    position: "absolute",
    top: "90%",
    right: "50%",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
  },
});

export default App;
