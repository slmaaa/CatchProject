import React, {Component} from 'react';

import {StyleSheet, View} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';
MapboxGL.setAccessToken(
  'pk.eyJ1IjoiaGVjdG9yY2hjaCIsImEiOiJja205YmhldXUwdHQ1Mm9xbGw4N2RodndhIn0.yX90QKE2jcgG-7V5wOGXeQ',
);

console.disableYellowBox = true;

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Here -122.4324 is Longitude.
      // Here 37.78825 is Latitude.
      coordinates: [114.262867, 22.333333],
      error: null,
      Address: null,
    };
  }
  // async componentDidMount(){
  //   Geolocation.getCurrentPosition(
  //     (position)=>{
  //       this.setState()({
  //         latitude: position.coords.latitude,
  //         longitude:position.coords.longitude,
  //       })
  //       Geocoder.from(position.coords.latitude,position.coords.longitude)
  //       .then(json=>{
  //         console.log(json);
  //       })
  //     }
  //   )
  // }

  render() {
    return (
      <View style={styles.MainContainer}>
        <View style={styles.SubContainer}>
          <MapboxGL.MapView style={styles.Mapbox}>
            <MapboxGL.Camera
              zoomLevel={15}
              centerCoordinate={this.state.coordinates}
            />

            <MapboxGL.PointAnnotation coordinate={this.state.coordinates} />
          </MapboxGL.MapView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
  },
  SubContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
  },
  Mapbox: {
    flex: 1,
  },
});
