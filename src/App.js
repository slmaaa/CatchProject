import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import InGame from "./components/InGame";
import Login from "./components/Login";
import Config from "./components/Config";
import Map from "./components/Map";
import Demo from "./Demo";

const Stack = createStackNavigator();
const linking = {
  config: { InGame: "game", Config: "config", Login: " login " ,Map:"map"},
};

const App = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
      //initialRouteName="InGame"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="InGame" component={InGame} />
        <Stack.Screen name="Demo" component={Demo} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Config" component={Config} />
        <Stack.Screen name="Map" component={Map} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
