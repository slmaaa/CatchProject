import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import InGame from "./components/InGame";
import Login from "./components/Login";
import Config from "./components/Config";

const Stack = createStackNavigator();
const linking = { config: { Login: "", Ingame: "game", Config: "config" } };

const App = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="InGame"
          component={InGame}
          options={{
            headerLeft: null,
            title: null,
            headerShown: false,
            headerStyle: {
              backgroundColor: "black",
            },
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerLeft: null,
            title: null,
            headerShown: false,
            headerStyle: {
              backgroundColor: "black",
            },
          }}
        />
        <Stack.Screen
          name="Config"
          component={Config}
          options={{
            headerLeft: null,
            title: null,
            headerShown: false,
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
