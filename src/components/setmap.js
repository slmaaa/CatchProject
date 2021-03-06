import React, {useState,useEffect} from 'react';
import {StyleSheet, View, Pressable, Text, Alert} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
import * as Progress from "react-native-progress";
MapboxGL.setAccessToken(
  'pk.eyJ1IjoicmFzaGlkdGhlZGV2ZWxvcGVyIiwiYSI6ImNrYXBncGlwdjBjbG4yd3FqaXl2ams1NHQifQ.jvRoapH6Ae7QHb8Kx4z9FQ',
);
const MAPBOX_TOKEN = 'pk.eyJ1IjoicmFzaGlkdGhlZGV2ZWxvcGVyIiwiYSI6ImNrYXBncGlwdjBjbG4yd3FqaXl2ams1NHQifQ.jvRoapH6Ae7QHb8Kx4z9FQ'
import Geolocation from "react-native-geolocation-service";
import Geocoder from 'react-native-geocoding';
import RNLocation, { Location } from 'react-native-location';
const App = () => {
  const [location, setLocation] = useState(null);
  const [coordinates,setcoordinates] = useState([114.2655,22.3364]);
  const [addcor,setaddcor]=useState([[114.2635,22.3372,5,9],[114.2655,22.3364,14,17],[114.2645,22.3344,10,7]])
  useEffect(()=>{
    //websocketSetup();
    RNLocation.configure({
      distanceFilter: 0, //meters
      desiredAccuracy: {
        ios: "best",
        // highAccuracy
        // balancedPowerAccuracy
        android: "highAccuracy"
      },
      // Android only
      androidProvider: "auto",
      interval: 1000, // Milliseconds
      fastestInterval: 1000, // Milliseconds
      maxWaitTime: 1000, // Milliseconds
      // iOS Only
      activityType: "other",
      allowsBackgroundLocationUpdates: false,
      headingFilter: 1, // Degrees
      headingOrientation: "portrait",
      pausesLocationUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: false,
    }) 
    RNLocation.requestPermission({
      ios: "whenInUse",
      android: {
        detail: "fine"
      }
    }).then(granted => {
        if (granted) {
          let locationSubscription = RNLocation.subscribeToLocationUpdates(locations => {
            // console.log("locations", locations)
            if(locations !== undefined && locations.length > 0){
              let currentLocation = locations[0];
              console.log(currentLocation.longitude) ;
              console.log(currentLocation.latitude) ;
              setcoordinates([JSON.stringify(currentLocation.longitude),JSON.stringify(currentLocation.latitude)])  
              // setBlueTeamScore(Math.floor(Math.random() * 100));
              // setRedTeamScore(Math.floor(Math.random() * 100));
            } 
          })
        }
      })  
  },[addcor])  
  // useEffect(() => {
  //   const _watchId = Geolocation.watchPosition(
    
  //     (position) => {
  //       console.log("hihi")
  //       console.log(position)
  //       setLocation(position.coords); 
  //       //setcoordinates([parseFloat(JSON.stringify(position.coords.longitude)),parseFloat(JSON.stringify(position.coords.latitude))]);
  //       time = position.timestamp;
  //       if (location != null) {
  //         locationText =
  //           "Latitude: " +
  //           JSON.stringify(location.latitude) +
  //           "\n" +
  //           "Longitude: " +
  //           JSON.stringify(location.longitude);
  //         console.log("here is the location ")
          
  //         setcoordinates([parseFloar(JSON.stringify(location.longitude)),parseFloat(JSON.stringify(location.latitude))])  
  //         //console.log(locationText)  
  //       }
  //     },
  //     (error) => {
  //       // See error code charts below.
  //       console.log(error.code, error.message);
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       timeout: 15000,
  //       distanceFilter: 1,
  //       interval: 100000,
  //       fastestInterval: 100000,
  //     }
  //   );
  //   return () => {
  //     if (_watchId) {
  //       Geolocation.clearWatch(_watchId);
  //     }
  //   };
  // }, [coordinates]); 

  // useEffect(() => {
  //   Geolocation.getCurrentPosition(info=>{
  //     //console.log(info.coords.latitude)
  //     //console.log(info.coords.longitude)
  //     setcoordinates([info.coords.longitude,info.coords.altitude])
      
  //   })
  // }, [location]);

  const addbutton = ()=>{
    setaddcor([...addcor,[114.2656,22.3360,8,20]])
    Alert.alert("addbutton")
    console.log("hihi")
  }
  const startbutton = ()=>{
    addcor.splice(index, 3);
    Alert.alert("startbutton")
  }

  const setpoint = (counter) => {
    const id = counter;
    const lan = addcor[counter][0];
    const lat = addcor[counter][1];
    coordinate = [lan,lat]
    const redteam = addcor[counter][2]
    const blueteam = addcor[counter][3]
    

//     const colorStyles1 = {
//       borderRightColor:"white",
//       borderLeftColor:"red",
//       borderRightWidth: 40-redteam,
//       borderLeftWidth: redteam,

//   };
//   const colorStyles2 = {
//     borderRightColor:"white",
//     borderLeftColor:"blue",
//     borderRightWidth: 40-blueteam,
//     borderLeftWidth: blueteam,


// };
    return(
    
    <MapboxGL.PointAnnotation key={id} coordinate={coordinate}>
        <View style={styles.container}>
          <View style={styles.circle} />
          {/* <View style={[styles.rectangle,colorStyles1]} />
          <View style={[styles.rectangle2,colorStyles2]} /> */}
          <View
              style={{ width: 50, height: 100, backgroundColor: "#FFFFFF00" }}
            >
              <Progress.Bar progress={redteam} width={50} />
              <Progress.Bar progress={blueteam} width={50} color={"red"} />
            </View>
        </View>
       
    </MapboxGL.PointAnnotation>
    
    );

  }

  

  const setpoints = () => {
    const item = [];
    for(let i = 0; i<addcor.length; i++){
      item.push(setpoint(i));
    }
    return item;

  }


  
  
  
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView style={styles.map}>
          <MapboxGL.Camera zoomLevel={13} centerCoordinate={coordinates} />
          <MapboxGL.PointAnnotation
           key="pointAnnotation"
           id="pointAnnotation"
           coordinate={coordinates}>   
           {/* currentLocation */}
           <View style={{
                  height: 30, 
                  width: 30, 
                  backgroundColor: '#00cccc', 
                  borderRadius: 50, 
                  borderColor: '#fff', 
                  borderWidth: 3
                }} />
          </MapboxGL.PointAnnotation>
          {setpoints()}
        </MapboxGL.MapView>
        {/* <Text style={[styles.button1,styles.buttonText]}>RED Team 35</Text>
        <Text style={[styles.button2,styles.buttonText]}>BLUE Team 46</Text> */}
        <Pressable
        style={({pressed}) => [
          {
            backgroundColor: pressed ? 'lightblue' : 'green',
          },
          styles.button1,
        ]}
        onPress={startbutton}>
        <Text style={styles.buttonText}>Start</Text>
       </Pressable>
       <Pressable
        style={({pressed}) => [
          {
            backgroundColor: pressed ? 'lightblue' : 'blue',
          },
          styles.button2,
        ]}
        onPress={addbutton}>
        <Text style={styles.buttonText}>Add</Text>
       </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rectangle: {
    marginTop:0,
    width: 40,
    height:  5,
  },
  rectangle2: {
    marginTop:0,
    width: 40,
    height:  5,
  },
  circle: {
    marginTop:0,
    width: 40,
    height: 40,
    borderRadius: 40/2,
    backgroundColor: 'rgba(52, 52, 52, 0.3)'
 },
  page: {
    flex: 1,
  },
  container: {
    width: "100%",
    height: "100%",
    // borderRadius: 50/2,
    backgroundColor: 'rgba(52, 52, 52, 0)'
  },
  map: {
    flex: 1,
    position:'relative',
  },
  button1: {
    backgroundColor:'red',
    borderRadius: 30,
    padding: 6,
    height: '10%',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    position:'absolute',
    top: '90%',
    right: '0%',
  },
  button2: {
    borderRadius: 30,
    padding: 6,
    height: '10%',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    position:'absolute',
    top: '90%',
    left: '0%',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    
  },
});

export default App;