import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import auth from "@react-native-firebase/auth";

import InGame from "./components/InGame/InGame";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
import Riddle from "./components/InGame/Riddle";
import Sudoku from "./components/InGame/Sudoku";
import CreateGame from "./components/CreateGame";
import Waiting from "./components/Waiting";
import LoadingHome from "./components/LoadingHome";
import setmap from "./components/setmap";
import MMKVStorage from "react-native-mmkv-storage";
import { color } from "./constants";

const MMKV = new MMKVStorage.Loader().initialize();
const Stack = createStackNavigator();
const ws = new WebSocket("ws://192.168.29.243:8765");

export const wsSend = async (data) => {
  await ws.send(data);
};
const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  MMKV.clearStore();
  ws.onopen = () => {
    // connection opened
    console.log("WebSocket Client Connected");
  };
  ws.onmessage = (e) => {
    // a message was received
    console.log("====================================");
    console.log(e.data);
    console.log("====================================");
    const data = JSON.parse(e.data);
    switch (data.header) {
      case "ERROR":
        console.error(data.content);
        break;
      case "CREATED":
        console.log("Game created");
        MMKV.setString("createdGameID", data.content + "");
        break;
      case "JOINED":
        console.log("Game joined");
        MMKV.setMap("joinedGame", data.content);
        break;
      case "ROOM_INFO":
        console.log("Recieved room info");
        MMKV.setMap("roomInfo", data.content);
        break;
      case "GAME_INFO":
        console.log("Recieved game info");
        MMKV.setMap("gameInfo", data.content);
        break;
      case "CLOSE_ACCOUNT":
        console.log("Recieved endStats");
        MMKV.setMap("endStats", data.content);
        break;  
      default:
        console.error("Unidentified data");
    }
  };
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
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPassword}
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
              name="setmap"
              component={setmap}
              options={{
                headerLeft: null,
                title: "Set CheckPoints",
                headerStyle: {
                  backgroundColor: color.blueOnBlack,
                },
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
              options={({ route }) => ({
                headerShown: false,
              })}
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
