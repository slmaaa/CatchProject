import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import InGame from "./components/InGame";
import Login from "./components/Login";
import Config from "./components/Config";

const Stack = createStackNavigator();
const linking = { config: { Ingame: "", Login: "login", Config: "config" } };

const App = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="InGame" component={InGame} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Config" component={Config} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
