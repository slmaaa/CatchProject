
import React, { useEffect, useState } from "react";
import * as React from "react";
import { Text, SafeAreaView } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
MapboxGL.setAccessToken(
  "pk.eyJ1IjoiaGVjdG9yY2hjaCIsImEiOiJja205YmhldXUwdHQ1Mm9xbGw4N2RodndhIn0.yX90QKE2jcgG-7V5wOGXeQ"
);
import{StyleSheet,Dimensions}from"react-native";

const Home = () => {
  return (
    <View style={styles.mapContainer}>
          <MapboxGL.MapView
            style={styles.map}
            styleURL={"mapbox://styles/mapbox/dark-v10"}
            logoEnabled={false}
          >
            <MapboxGL.Camera
              zoomLevel={13}
              centerCoordinate={[
                CP_LOCATION[0].longitude,
                CP_LOCATION[0].latitude,
              ]}
              pitch={45}
            />
          </MapboxGL.MapView>
        </View>
  );
};