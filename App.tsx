import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


import BLEcomp from './BLE';
import Scanning from './Home';
import { NativeBaseProvider} from "native-base";
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Calibrationcomp from './calibration';
import Scancomp from './scan';
import ChooseComp from './chooseWorkout';
import WorkoutComp from './workout';
import ResultsScreen from './results';


const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider>
        <NavigationContainer>
          {/* <Text style= {{paddingTop: 10, paddingBottom:10, alignSelf:'center', fontSize:30, fontStyle:'italic'}}>MOCOPI Exercise App</Text> */}
          <Stack.Navigator screenOptions={{headerTintColor:'black', headerStyle: { backgroundColor: 'white' }}}>
            <Stack.Screen name ="Home" component = {Scanning} ></Stack.Screen>
              {/* <View style={styles.container}>
                <StatusBar style="auto" />
              </View> */}
            <Stack.Screen name = "BLE" component = {BLEcomp}></Stack.Screen>
            <Stack.Screen name = "Begin Calibration" component = {Calibrationcomp} options={{presentation: "modal"}}></Stack.Screen>
            <Stack.Screen name = "Begin Scan" component = {Scancomp} ></Stack.Screen>
            <Stack.Screen name = "Choose Workout" component = {ChooseComp}></Stack.Screen>
            <Stack.Screen name = "Begin Workout!" component = {WorkoutComp}></Stack.Screen>
            <Stack.Screen name = "Workout Completed!" component = {ResultsScreen}></Stack.Screen>
          </Stack.Navigator>
        

        </NavigationContainer>
      
      </NativeBaseProvider>
  </GestureHandlerRootView>
    
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
