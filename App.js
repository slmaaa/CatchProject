import 'react-native-gesture-handler';
import * as React from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Login from './components/Login';
import Home from './components/Home';
import Runner from './components/Runner';
import Map from './components/Map';

import * as colorCode from './ColorCode';
import Task from './components/TaskList';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Task"> //Change this to change screen
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
              backgroundColor: colorCode.primary,
            },
          }}
        />
        <Stack.Screen
          name="Runner"
          component={Runner}
          options={{
            headerLeft: null,
            title: null,
            headerStyle: {
              backgroundColor: colorCode.primary,
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
              backgroundColor: colorCode.primary,
            },
          }}
        />
        <Stack.Screen
          name="Task"
          component={Task}
          options={{
            headerLeft: null,
            title: null,
            headerStyle: {
              backgroundColor: colorCode.primary,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
