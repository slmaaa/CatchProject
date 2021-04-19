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
  const [coordinates] = useState([114.2655, 22.3364]);
  useEffect(() => {
    const _watchId = Geolocation.watchPosition(
      (position) => {
        setLocation(position.coords);
        time = position.timestamp;
        if (location != null) {
          locationText =
            "Latitude: " +
            JSON.stringify(location.latitude) +
            "\n" +
            "Longitude: " +
            JSON.stringify(location.longitude);
        }
      },
      (error) => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        distanceFilter: 1,
        interval: 100000,
        fastestInterval: 100000,
      }
    );
    if (location != null) {
      setCurrentCID(
        updateCPFlag(
          location,
          currentCID,
          CP_LOCATION,
          CP_RANGE,
          NUM_OF_CP,
          RID
        )
      );
    }
    return () => {
      if (_watchId) {
        Geolocation.clearWatch(_watchId);
      }
    };
  }, [location]);

  
  
  
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView style={styles.map}>
          <MapboxGL.Camera zoomLevel={15} centerCoordinate={coordinates} />
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