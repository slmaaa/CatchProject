import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import InGame from "./components/InGame/InGame";
import Login from "./components/Login";
import Home from "./components/Home";
import Flappy from "./components/InGame/FlappyBird/App";
import Riddle from "./components/InGame/Riddle";

import { color } from "./constants";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName="InGame" >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerLeft: null,
            title: null,
            headerStyle: {
              backgroundColor: color.primary,
            },
          }}
        />
        <Stack.Screen
          name="InGame"
          component={InGame}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Flappy"
          component={Flappy}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Riddle"
          component={Riddle}
          options={{
            title: "Riddle Time",
            headerStyle: {
              backgroundColor: color.blueOnBlack,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
