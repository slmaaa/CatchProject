import React, {useState,useEffect} from 'react';
import {StyleSheet, View, Pressable, Text, Alert} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
const RID = "GG01-PP02";

MapboxGL.setAccessToken(
  'pk.eyJ1IjoicmFzaGlkdGhlZGV2ZWxvcGVyIiwiYSI6ImNrYXBncGlwdjBjbG4yd3FqaXl2ams1NHQifQ.jvRoapH6Ae7QHb8Kx4z9FQ',
);
import Geolocation from "react-native-geolocation-service";
const defaultPostData = {
  rid: RID,
  CID: -1,
  time: 0,
  is_in: null,
};
const App = () => {
  const [location, setLocation] = useState(null);
  const [coordinates,setcoordinates] = useState([114.2655,22.3364]);
  // const [curlng,setcurlng] = useState(114.2655);
  // const [curalt,setcuralt] = useState(22.3364);
  useEffect(() => {
    Geolocation.getCurrentPosition(info=>{
      // setcurlng(info.coords.longitude)
      // setcuralt(info.coords.altitud)
      console.log(info.coords.altitude)
      console.log(info.coords.longitude)
      setcoordinates([info.coords.longitude,info.coords.altitude])
      
    })
  }, [location]);

  
  
  
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView style={styles.map}>
          <MapboxGL.Camera zoomLevel={1} centerCoordinate={coordinates} />
          <MapboxGL.PointAnnotation
        key="pointAnnotation"
        id="pointAnnotation"
        coordinate={coordinates}>
        <View style={{
                  height: 30, 
                  width: 30, 
                  backgroundColor: '#00cccc', 
                  borderRadius: 50, 
                  borderColor: '#fff', 
                  borderWidth: 3
                }} />
      </MapboxGL.PointAnnotation>
        </MapboxGL.MapView>
        <Pressable
        style={({pressed}) => [
          {
            backgroundColor: pressed ? 'lightgreen' : 'green',
          },
          styles.button,
        ]}
        onPress={() => Alert.alert('sent things to serve')}>
        <Text style={styles.buttonText}>Start</Text>
       </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'blue',
  },
  map: {
    flex: 1,
    position:'relative',
  },
  button: {
    borderRadius: 30,
    padding: 6,
    height: '10%',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    position:'absolute',
    top: '90%',
    right: '25%',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
});

export default App;