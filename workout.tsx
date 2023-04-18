import React from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import { Button, Box, Center, Text, Heading, Progress, HStack, Spinner, CheckIcon} from "native-base";
import useBLE from './useBLE';
import { SafeAreaView} from 'react-native';
import {useState} from 'react';
import{useNavigation} from "@react-navigation/native"
import ChooseComp from "./chooseWorkout"
import { RouteProp } from '@react-navigation/native';
import {RootStackParamList}  from './chooseWorkout';

// type ChildProps = {
//     reps: number;
// };

type DestinationScreenRouteProp = RouteProp<
  RootStackParamList,
  'Destination'
>;

type Props = {
  route: DestinationScreenRouteProp;
};


const WorkoutComp = ({ route }: Props) => {
  const { data } = route.params;

  const exerciseData = {
    bad: 0,
    good: 0,
    score: 0,
  };

  const beginExercise =() => {
    // send start flag to pi

    //if successful start, begin else, alert error


    //read from pi
    // while reading not finished 

    //wait for calculation of rep 

    //update data and exercise data
    
  }
    
    
  return (
    <SafeAreaView>
        <Heading size="2xl" style = {{marginTop:50, marginBottom:50}}>Exercise: {data.name}</Heading>
        
        <Text>Reps to Go!: {data.reps}</Text>
        
        <Button colorScheme="emerald" onPress={beginExercise}>
            Press to Start!
        </Button>
        

    </SafeAreaView>
  )

}


export default WorkoutComp

