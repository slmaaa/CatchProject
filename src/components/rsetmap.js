import React, {useState,useEffect,useRef} from 'react';
import {StyleSheet, View, Pressable, Text, Alert,Modal,TouchableHighlight} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import NumericInput from 'react-native-numeric-input'
MapboxGL.setAccessToken(
  'pk.eyJ1IjoicmFzaGlkdGhlZGV2ZWxvcGVyIiwiYSI6ImNrYXBncGlwdjBjbG4yd3FqaXl2ams1NHQifQ.jvRoapH6Ae7QHb8Kx4z9FQ',
);
import RNLocation, { Location } from 'react-native-location';
const App = () => {
  const [coordinates,setcoordinates] = useState([114.2655,22.3364]);
  const [location, setLocation] = useState(null);
  const [addcor,setaddcor]=useState([]);
  const [mapcenter, setmapcenter] = useState([]);
  const [infotoserve,setinfotoserve]=useState([]);
  const[radius,setradius]=useState(10);
  const[checkpointpower,setcheckpointpower]=useState(5);
  //const[ModalOpen, setModalOpen] = useState(false);
  const mapRef = useRef();
  useEffect(() => {
    mapRef.current.getCenter().then((val) => 
    setmapcenter(val)
    );

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
  
  const addbutton = ()=>{
    //setModalOpen(true)
    id = addcor.length+1;
    var name = "name";
    setaddcor([...addcor, mapcenter])// centerlat,lng hvent implement
    setinfotoserve({...infotoserve,
      newpoint :{
        "cid": id,
        "name": name,
        "area": {
          "area": "CIRCLE",
          "center": { "lat": mapcenter[0], "lng": mapcenter[1] },
          "radius": {radius}
        },
        "maxLevel": {checkpointpower},
      }
  });
    //console.log(infotoserve[1].geolocation.lan)
  }
  const startbutton = ()=>{
    console.log(infotoserve)
    //Alert.alert(infotoserve.length)
    console.log(coordinates)
  }

  const setpoint = (counter) => {
    const id = counter;
    const lan = addcor[counter][0];
    const lat = addcor[counter][1];
    var coordinate = [lan,lat]
    return(
    
    <MapboxGL.PointAnnotation key={id} coordinate={coordinate}>
        <View style={styles.container}>
          <View style={styles.circle}/>
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
        <MapboxGL.MapView style={styles.map}  ref={mapRef}
        // onPress={(event) => {
        //     // const {geometry, properties} = event; 
        //     Alert.alert(
        //         "Add New point",
        //         "Add latitude"+event.geometry.coordinates[0]+ " and longtitude " + event.geometry.coordinates[1]+" to the Map?",
        //         [
        //           {
        //             text: "Cancel",
        //             onPress: () => console.log("Cancel Pressed"),
        //             style: "cancel"
        //           },
        //           { text: "OK", onPress: () => setaddcor([...addcor, [event.geometry.coordinates[0],event.geometry.coordinates[1]]]) }
        //         ]
        //       );             
        // }}
      >
          <MapboxGL.Camera zoomLevel={16} centerCoordinate={coordinates} />
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
        {/* {modal()} */}
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
       <View style={styles.shooter} />
       <View style={styles.shooter2} />
       <View style={styles.input}>
         <NumericInput 
            value = {radius}
            onChange={value => setradius({value})} 
            onLimitReached={(isMax,msg) => console.log(isMax,msg)}
            totalWidth={150} 
            totalHeight={50} 
            iconSize={25}
            step={10}
            valueType='real'
            rounded 
            textColor='#B0228C' 
            iconStyle={{ color: 'white' }} 
            rightButtonBackgroundColor='#EA3788' 
            leftButtonBackgroundColor='#E56B70'/>
            <Text style={styles.texttop}>CP Radius (m)</Text>
       </View>
       <View style={styles.input2}>
         <NumericInput 
            value = {checkpointpower}
            onChange={value => setcheckpointpower({value})} 
            onLimitReached={(isMax,msg) => console.log(isMax,msg)}
            totalWidth={150} 
            totalHeight={50} 
            iconSize={25}
            step={1}
            valueType='real'
            rounded 
            textColor='#B0228C' 
            iconStyle={{ color: 'white' }} 
            rightButtonBackgroundColor='#EA3788' 
            leftButtonBackgroundColor='#E56B70'/>
            <Text style={styles.texttop}>Max Points</Text>
       </View>


       
       {/* <View style={styles.shootercircle} /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input:{
    height: '10%',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    position:'absolute',
    top: '1%',
    right: '0%',

  },
  input2:{
    height: '10%',
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    position:'absolute',
    top: '1%',
    left: '0%',

  },
  shooter:{
    borderRadius: 30,
    padding: 6,
    height: '10%',
    width: '1%',
    justifyContent: 'center',
    alignItems: 'center',
    position:'absolute',
    top: '45%',
    right: '50%',
    flex: 1,
    backgroundColor: "black",
  },
  shooter2:{
    borderRadius: 30,
    padding: 6,
    height: '1%',
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
    position:'absolute',
    top: '49%',
    right: '44%',
    backgroundColor: "black",
  },
  circle: {
    marginTop:0,
    width: 40,
    height: 40,
    borderRadius: 40/2,
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
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
    right: '50%',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
  texttop:{
    fontSize: 20,
    color: 'grey',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
});

export default App;