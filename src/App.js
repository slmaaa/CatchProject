import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import auth from "@react-native-firebase/auth";

import InGame from "./components/InGame/InGame";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import Home from "./components/Home";
import Flappy from "./components/InGame/FlappyBird/App";
import Riddle from "./components/InGame/Riddle";
import Sudoku from "./components/InGame/Sudoku";
import CreateGame from "./components/CreateGame";
import Waiting from "./components/Waiting";
import LoadingHome from "./components/LoadingHome";

import { color } from "./constants";

const Stack = createStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{
                headerShown: false,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="LoadingHome"
              component={LoadingHome}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{
                headerLeft: null,
                title: "Home",
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
              name="CreateGame"
              component={CreateGame}
              options={{
                title: "Create Game",
                headerStyle: {
                  backgroundColor: color.blueOnBlack,
                },
              }}
            />
            <Stack.Screen
              name="Waiting"
              component={Waiting}
              options={{
                title: "Waiting Room",
                headerStyle: {
                  backgroundColor: color.blueOnBlack,
                },
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
            <Stack.Screen
              name="Sudoku"
              component={Sudoku}
              options={{
                title: "Sudoku Time",
                headerStyle: {
                  backgroundColor: color.blueOnBlack,
                },
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
