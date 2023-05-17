import React from 'react'
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { Button, Box, Center, Text, Heading, Progress, HStack, Spinner, CheckIcon, AlertDialog} from "native-base";

import { SafeAreaView, Image} from 'react-native';
import {useState, useRef, useEffect} from 'react';
import{useNavigation} from "@react-navigation/native"
import ChooseComp from "./chooseWorkout"
import { RouteProp } from '@react-navigation/native';
import {RootStackParamList}  from './chooseWorkout';
import {d, KEY_FRAME_DATA_UUID, CONTROL_BITS_UUID, KEY_FRAME_HIT_UUID, hexStringGlobal} from './useBLE';
import {exerciseData} from './workout'
import {UseBLEHOOK} from './useBLE';
import { atob, btoa } from 'react-native-quick-base64';
import {calcomplete} from './calibration';



export default function ResultsScreen(){




  
  
  return (
    <View> 
      <SafeAreaView>
        <ScrollView>
            
        </ScrollView>
      </SafeAreaView>
      {/* <Text style = {{marginBottom:50000}}></Text> */}
      {/* <WorkoutComp reps={reps}/> */}

    </View>
    
)}
