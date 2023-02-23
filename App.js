import React from 'react';
import { StyleSheet } from 'react-native';
import Onboarding from './screens/Onboarding';
import HomeScreen from './screens/HomeScreen';
import Profile from './screens/Profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Header from './screens/Header';


const Stack = createNativeStackNavigator();

export default function App() {
  const navigationRef = React.useRef(null);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          header: (props) => <Header {...props} />,
        }}
      >
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
