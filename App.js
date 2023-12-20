import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Button, View } from 'react-native';
import InputView from './InputView';
import DisplayView from './DisplayView';

// Import necessary Firebase functions
import { initializeApp, getApps } from 'firebase/app';
import MyMapView from './MyMapView';
import UserEditView from './EditView';

// Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyC2eMMfToONxQWICk99vGdGAw2zrJUFTWo",
//   authDomain: "inno2-7e420.firebaseapp.com",
//   databaseURL:
//     "https://inno2-7e420-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "inno2-7e420",
//   storageBucket: "inno2-7e420.appspot.com",
//   messagingSenderId: "34529192707",
//   appId: "1:34529192707:web:a3ceae51882021affb5736",
//   measurementId: "G-QX682WX4SK",
// };

const firebaseConfig = {
  apiKey: 'AIzaSyC9yRSfRHj3ZiZYe6MWJEHkUETjsv6hAc0',
  authDomain: 'rastheone-8ccde.firebaseapp.com',
  databaseURL:
    'https://rastheone-8ccde-default-rtdb.europe-west1.firebasedatabase.app',
  // https://rastheone-8ccde-default-rtdb.europe-west1.firebasedatabase.app/
  projectId: 'rastheone-8ccde',
  storageBucket: 'rastheone-8ccde.appspot.com',
  messagingSenderId: '370262673988',
  appId: '1:370262673988:web:f73ef16d3e4c13dce6ca11',
};

// Check if there are no apps initialized yet, then initialize Firebase
if (getApps().length === 0) {
  initializeApp(firebaseConfig);
  console.log('Firebase On!');
}

const Stack = createStackNavigator();

// Homescreen with our 3 buttons for input, list and our map
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Go to Input View"
        onPress={() => navigation.navigate('Inputview')}
      />
      <Button
        title="Go to Display View"
        onPress={() => navigation.navigate('Displayview')}
      />
      <Button
        title="MapView"
        onPress={() => navigation.navigate('MyMapView')}
      />
    </View>
  );
}

// This tells the app which screens are available
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="EditUser" component={InputView} />
        <Stack.Screen name="Inputview" component={InputView} />
        <Stack.Screen name="UserEditView" component={UserEditView} />
        <Stack.Screen name="Displayview" component={DisplayView} />
        <Stack.Screen name="MyMapView" component={MyMapView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
