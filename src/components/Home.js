/*
HomeScreen:
Shown nearby player location and route player to screens
*/
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
export default Home;
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    backgroundColor: "black",
  },
  notificationContainer: {
    width: "80%",
    backgroundColor: "#D32F2F",
    borderRadius: 10,
    height: "8%",
    justifyContent: "center",
    alignSelf: "center",
  },
  notificationText: {
    color: "black",
    textAlign: "center",
    textAlignVertical: "center",
  },
  mapContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#263238",
  },
  map: {
    flex: 1,
  },
  actionButton: {
    position: "absolute",
    bottom: "8%",
    left: "25%",
    height: 60,
    width: "50%",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#00E676",
    position: "absolute",
    shadowColor: "#FAFAFA",
    shadowRadius: 20,
    borderWidth: 0.5,
    borderColor: "white",
  },
  actionButtonText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: "white",
    fontFamily: "Poppins-Regular",
    fontSize: 20,
  },
});