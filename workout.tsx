import {ImageBackground} from 'react-native';
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Box, Center, Text, Heading, Progress, HStack, Spinner, CheckIcon} from 'native-base';
import useBLE from './useBLE';
import {SafeAreaView} from 'react-native';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import ChooseComp from './chooseWorkout';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from './chooseWorkout';
import {d} from './useBLE';
import {UseBLEHOOK} from './useBLE';
import {atob, btoa} from 'react-native-quick-base64';

type DestinationScreenRouteProp = RouteProp<
  RootStackParamList,
  'Destination'
>;

type Props = {
  route: DestinationScreenRouteProp;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
});

const WorkoutComp = ({route}: Props) => {
  const {data} = route.params;
  const {writeData, disconnectFromDevice, allDevices, currentDevice, readData} =
    UseBLEHOOK();

  const exerciseData = {
    bad: 0,
    good: 0,
    score: 0,
  };

  //iphone commands
  //0x01 = start   0x00 = stop      0x02 = start rep

  //both
  //0xFF = ACK

  //arduino commands
  //0x03 == rep finished   //0x10 keyframe 1 hit     //0x20 keyframe 2 hit      //0x30 keyframe 3 hit       //0x40 keyframe 4 hit
  const beginExercise = () => {
    // send start flag to pi send 0x01
    writeData(btoa('01'));

    //if successful start, begin else, alert error

    //read from pi
    // while reading not finished

    //wait for calculation of rep

    //update data and exercise data
  };

  return (
    <ImageBackground source={require('./assets/bc.jpg')} resizeMode="cover" style={styles.image}>
      <SafeAreaView>
        <Heading size="2xl" style={{marginTop: 50, marginBottom: 50}}>
          Exercise: {data.name}
        </Heading>

        <Text>Reps to Go!: {data.reps}</Text>

        <Button colorScheme="emerald" onPress={beginExercise}>
          Press to Start!
        </Button>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default WorkoutComp;
