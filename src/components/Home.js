/*
HomeScreen:
Shown nearby player location and route player to screens
*/
import * as React from "react";
import { Text, SafeAreaView, Button } from "react-native";
const Home = ({ navigation }) => {
  return (
    <SafeAreaView>
      <Text>Home Screen</Text>
      <Button
        title={"Create game room"}
        onPress={() => {
          navigation.navigate("CreateGame");
        }}
      ></Button>
    </SafeAreaView>
  );
};
export default Home;
