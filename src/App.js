import "react-native-gesture-handler";
import * as React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import InGame from "./components/InGame";
import Map from "./components/Map";

const Stack = createStackNavigator();

const App = (props) => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="InGame">
        <Stack.Screen
          name="InGame"
          component={InGame}
          options={{
            headerLeft: null,
            title: null,
            headerStyle: {
              backgroundColor: "black",
            },
          }}
        />
        <Stack.Screen
          name="Map"
          component={Map}
          options={{
            headerLeft: null,
            title: null,
            headerStyle: {
              backgroundColor: "black",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
