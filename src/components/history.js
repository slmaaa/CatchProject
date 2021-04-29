import React, {useState,useEffect} from 'react';
import {StyleSheet, View, Pressable, Text, Alert, Modal,TouchableHighlight,Button} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
const accessToken = 'pk.eyJ1IjoicmFzaGlkdGhlZGV2ZWxvcGVyIiwiYSI6ImNrYXBncGlwdjBjbG4yd3FqaXl2ams1NHQifQ.jvRoapH6Ae7QHb8Kx4z9FQ';
MapboxGL.setAccessToken(accessToken);
const directionsClient = MapboxDirectionsFactory({accessToken});
import Swiper from 'react-native-swiper'
import Geolocation from "react-native-geolocation-service";
import RNLocation, { Location } from 'react-native-location';
import {lineString as makeLineString} from '@turf/helpers';
import MapboxDirectionsFactory from '@mapbox/mapbox-sdk/services/directions';
import { add } from 'react-native-reanimated';
import { getDistance } from 'geolib';
import Icon from 'react-native-vector-icons/FontAwesome5';
const App = () => {
    const startingPoint = [114.2635,22.3372];
    const destinationPoint = [114.2655,22.3364];
    const [route, setRoute] = useState(null);
  const[ModalOpen, setModalOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [coordinates,setcoordinates] = useState([114.2655,22.3364]);
  const [addcor,setaddcor]=useState([[114.2635,22.3372],[114.2655,22.3364],[114.2645,22.3344]])
  const startbutton = ()=>{
    Alert.alert("startbutton")
  }  
  useEffect(() => {
    fetchRoute();
  })
  const fetchRoute = async () => {
    const reqOptions = {
      waypoints: [
        {coordinates: addcor[0]},
        {coordinates: addcor[1]},
        {coordinates: addcor[2]},
      ],
      profile: 'driving-traffic',
      geometries: 'geojson',
    };
    const res = await directionsClient.getDirections(reqOptions).send();
    console.log(res.body.routes[0].geometry.coordinates);
    const newRoute = makeLineString(res.body.routes[0].geometry.coordinates);
    setRoute(newRoute);
  };

  const modalslideone = () =>{
      var distance = 0
      for(let i = 0; i < addcor.length-1; i++){
          distance = distance + getDistance(addcor[i],addcor[i+1])
      }
      return(
        <View style={styles.slide1}>
        <Icon name="running" size={30} color="#900" />
        <Text style={styles.text}>{distance}</Text>
        <Text style={styles.text}>Average speed</Text>
        <Text style={styles.text}>Time used</Text>
      </View>
      )
  }
  const modalslidetwo = () =>{
    return(
      <View style={styles.slide1}>
      <Text style={styles.text}>Calories burns</Text>
      <Text style={styles.text}>Fat burns</Text>
    </View>
    )
}
const modalslidethree = () =>{
    return(
      <View style={styles.slide1}>
      <Text style={styles.text}>Teammates</Text>
      <Text style={styles.text}>Opponents</Text>
    </View>
    )
}

  const modal = () =>{
      return(

         <Modal visible={ModalOpen} animationType='fade' transparent={true}>
             <TouchableHighlight style={styles.centeredView} onPress={() => setModalOpen(false)}>
          <Swiper style={styles.wrapper} showsButtons={true} >
              {modalslideone()}
              {modalslidetwo()}
              {modalslidethree()}
        
      </Swiper>
             </TouchableHighlight>
           
        </Modal> 
      )
  }

  const detailbutton = () =>{
      return(
          <Pressable
        style={({pressed}) => [
          {
            backgroundColor: pressed ? 'grey' : '#2196F3',
          },
          styles.button1,
        ]}
        onPress={() => setModalOpen(true)}>
        <Text style={styles.buttonText}>Details</Text>
        </Pressable>
      )
  }
//   const route = ()=>{
//       return
//   }

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView style={styles.map}>
          <MapboxGL.Camera zoomLevel={15} centerCoordinate={coordinates} /> 
          {
          route && (
           <MapboxGL.ShapeSource id='shapeSource' shape={route}>
              <MapboxGL.LineLayer id='lineLayer' style={{lineWidth: 5, lineJoin: 'bevel', lineColor: '#ff0000'}} />
            </MapboxGL.ShapeSource>
          )
        }
        </MapboxGL.MapView>
        {detailbutton()}
        {modal()}
         
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    wrapper: {},
    slide1: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#9DD6EB'
    },
    slide2: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#97CAE5'
    },
    slide3: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#92BBD9'
    },
    text: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0,0,0,0.5)'
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
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 15,
        padding: 7,
        elevation: 2,
        top: '95%',
        right: '0%'
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"},
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
    borderRadius: 30,
    padding: 6,
    height: '7%',
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
    fontWeight: 'bold'
    
  },
});

export default App;