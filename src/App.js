import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import InGame from "./components/InGame";
import Login from "./components/Login";
import Config from "./components/Config";
import Demo from "./Demo";

const Stack = createStackNavigator();
const linking = {
  config: { Demo: "", InGame: "*" },
};

const App = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="InGame" component={InGame} />
        <Stack.Screen name="Demo" component={Demo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
