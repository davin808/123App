import React from 'react'
import { Button, Box, Center, Text, Heading, AlertDialog, AspectRatio, Stack, HStack, View, } from "native-base";
import { SafeAreaView, Image, TouchableHighlight} from 'react-native';
import {useState, useRef} from 'react';
import babelConfig from './babel.config';
import{useNavigation} from "@react-navigation/native"
import { BaseNavigationContainer } from '@react-navigation/native';
import WorkoutComp from "./workout";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


export type RootStackParamList = {
  Source: { data: { name: string; reps: number } };
  Destination: { data: { name: string; reps: number } };
};

type SourceScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Source'
>;

type Props = {
  navigationProp: SourceScreenNavigationProp;
};

export default function ChooseComp({ navigationProp }: Props) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [ename, setEname] = useState('');
  const navigation = useNavigation();

  const onClose = () => {
    setIsOpen(false);
  }
  

  const data = {
    name: 'Exercise',
    reps: 0,
  };


  const fiveRep =() => {
      data.reps = 5;
      data.name = ename;
      navigation.navigate("Begin Workout!", { data });
      
  }

  const tenRep =() => {
    data.reps = 10;
    data.name = ename;
    navigation.navigate("Begin Workout!", {data});
    
  }

  const cancelRef = useRef(null);

  
  
  return (
    <View> 
      <SafeAreaView>
          <Heading alignSelf= "center" size="2xl" style = {{marginTop:50, marginBottom:50}}>Choose a Workout</Heading>
          <TouchableHighlight  onPress={() => {setIsOpen(!isOpen); setEname('Bicep Curl');}}>
            <Image borderRadius={100} source={require('./assets/bc.jpg')} style={{width: 200, height: 200, marginLeft:100}} />
          </TouchableHighlight>

          <TouchableHighlight  onPress={() => {setEname('Squat'); setIsOpen(!isOpen);}}>
            <Image borderRadius={100} source={require('./assets/sq.jpg')} style={{width: 200, height: 200, marginLeft:100, marginTop: 100}} />
          </TouchableHighlight>



          <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                <AlertDialog.Content>
                  <AlertDialog.CloseButton />
                  <AlertDialog.Header>One More Step</AlertDialog.Header>
                  <AlertDialog.Body>
                    Choose Number of Reps for Your Exercise
                  </AlertDialog.Body>
                  <AlertDialog.Footer>
                    <Button.Group space={2}>
                      {/* <Slider w="3/4" maxW="300" defaultValue={5} minValue={0} maxValue={10} accessibilityLabel="Select Reps" step={1}>
                          <Slider.Track>
                            <Slider.FilledTrack />
                          </Slider.Track>
                        <Slider.Thumb />
                      </Slider> */}
                      <Button colorScheme="emerald" onPress={fiveRep}>
                        5
                      </Button>
                      <Button colorScheme="emerald" onPress={tenRep}>
                        10
                      </Button>
                    </Button.Group>
                  </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>

            

      </SafeAreaView>
      {/* <Text style = {{marginBottom:50000}}></Text> */}
      {/* <WorkoutComp reps={reps}/> */}

    </View>
    
)}
