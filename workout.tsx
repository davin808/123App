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
import {UseBLEHOOK} from './useBLE';
import { atob, btoa } from 'react-native-quick-base64';
import {calcomplete} from './calibration';



//////////////////////////////////////////
//    NOTES
//     
//     -I use calcomplete to determine button color, if false show blue button, true then show green
//
//
//    BUGS
//    - after going back after calibrating, button turns blue to green only after pressing, needs to be green after backing
//
//////////////////////////////////////////



// type ChildProps = {
//     reps: number;
// };

let kfdata: number[] = [0.0, 20.0, 45.0, 90.0 ];

const alertbuttons = {
  width: 150,
  height: 50,
  backgroundColor: '#1a7045',
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 75,
};

type DestinationScreenRouteProp = RouteProp<
  RootStackParamList,
  'Destination'
>;

// type RootStackParamList = {
//   Home: undefined;
//   Destination: { data: number };
// };

type Props = {
  route: DestinationScreenRouteProp;
  //route: RouteProp<RootStackParamList, 'Destination'>; // Add route property to Props type
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    //DIYA
    width: 50,
    height: 50,
    resizeMode: 'contain',

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

let currentState = 1; 
//let imageSource = require('./assets/step1.png'); 

const WorkoutComp = ({ route }: Props) => {
  const { data } = route.params;
  const {writeData, disconnectFromDevice, allDevices, currentDevice, readData, hexString} = UseBLEHOOK();
  const navigation = useNavigation();
  const [exStart, setexStart] = useState(false);
  const [exEnd, setexEnd] = useState(false);
  const [imageNum, setimageNum] = useState(1);
  const [score, setScore] = useState(9);
  const [imgSrc, setimgSrc] = useState(
    require('./assets/step1.png'),
  );
  const exerciseData = {
    bad: 0,
    good: 0,
    score:  0
  };

  function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  //iphone commands
  //0x01 = start   0x00 = stop      0x02 = start rep     

  //both
  //0xFF = ACK


  //arduino commands
  //0x03 == rep finished   //0x10 keyframe 1 hit     //0x20 keyframe 2 hit      //0x30 keyframe 3 hit       //0x40 keyframe 4 hit
  // Wrote pseudocode to do beginexercise kinda incorrect
  let badFlag = false;
  const beginExercise = async() => {
    // send start flag to pi send 0x01
    
    setexStart(true);
  
    let r = data.reps;
    
    for (let i = 0; i < r; i++) {
      // send to pi look for kf 1 & update image to kf 1
      let kfstring = String(kfdata[0]);
      
      await writeData(btoa(kfstring), KEY_FRAME_DATA_UUID);  //8 bytes
      
      setimgSrc(require('./assets/step1.png'));
      
      // wait for kf 1 result
      //while 1 break after timout or hit timout or hit timeout or hit
      while(1){
        await readData(KEY_FRAME_HIT_UUID);
        // console.log("read value:", hexString);
        // console.log(hexString);
        if(hexStringGlobal == "01" || hexStringGlobal == "00"){
          break;
        } 
        //await delay(1000);
        
      }

      //await delay(1000);
      //if timeout
      if (hexStringGlobal == '00') {  
        console.log("TIMOUT: missed keyframe 1");
        // if read kf missed start from top of for loop (reset rep).
        // have 3 sec timer to let patient ready to get ready & show incorrect image
        setimgSrc(require('./assets/incorrect.png'));
        //wait for 3 seconds and prompt that rep is restarting in x time
        // to reset rep
        //data.reps+=1;
        i-=1;
        badFlag = true; // raise flag for mistake was made during rep;
        continue;
      }

      console.log("Hit keyframe 1");
      setimgSrc(require('./assets/step2.png'));
      kfstring = String(kfdata[1]);
      await writeData(btoa(kfstring), KEY_FRAME_DATA_UUID);  //8 bytes

      // wait for kf 2 result
      //while 1 break after timout or hit timout or hit timeout or hit
      while(1){
        await readData(KEY_FRAME_HIT_UUID);
        // console.log("read value:", hexString);
        // console.log(hexString);
        if(hexStringGlobal == "01" || hexStringGlobal == "00"){
          break;
        }
        
      }

      //await delay(1000);
      //if timeout
      if (hexStringGlobal == '00') {  
        console.log("TIMOUT: missed keyframe 2");
        // if read kf missed start from top of for loop (reset rep).
        // have 3 sec timer to let patient ready to get ready & show incorrect image
        setimgSrc(require('./assets/incorrect.png'));
        //wait for 3 seconds and prompt that rep is restarting in x time
        // to reset rep
        //data.reps+=1;
        i-=1;
        badFlag = true; // raise flag for mistake was made during rep;
        continue;
      }

      console.log("Hit keyframe 2");
      setimgSrc(require('./assets/step3.png'));
      kfstring = String(kfdata[2]);
      await writeData(btoa(kfstring), KEY_FRAME_DATA_UUID);  //8 bytes

      
      // wait for kf 3 result
      //while 1 break after timout or hit timout or hit timeout or hit
      while(1){
        await readData(KEY_FRAME_HIT_UUID);
        // console.log("read value:", hexString);
        // console.log(hexString);
        if(hexStringGlobal == "01" || hexStringGlobal == "00"){
          break;
        }
        
      }

      //await delay(1000);
      //if timeout
      if (hexStringGlobal == '00') {  
        console.log("TIMOUT: missed keyframe 3");
        // if read kf missed start from top of for loop (reset rep).
        // have 3 sec timer to let patient ready to get ready & show incorrect image
        setimgSrc(require('./assets/incorrect.png'));
        //wait for 3 seconds and prompt that rep is restarting in x time
        // to reset rep
        //data.reps+=1;
        i-=1;
        badFlag = true; // raise flag for mistake was made during rep;
        continue;
      }

      console.log("Hit keyframe 3");
      setimgSrc(require('./assets/step4.png'));
      kfstring = String(kfdata[3]);
      await writeData(btoa(kfstring), KEY_FRAME_DATA_UUID);  //8 bytes


      // wait for kf 4 result
      //while 1 break after timout or hit timout or hit timeout or hit
      while(1){
        await readData(KEY_FRAME_HIT_UUID);
        // console.log("read value:", hexString);
        // console.log(hexString);
        if(hexStringGlobal == "01" || hexStringGlobal == "00"){
          break;
        }
        
      }
      //await delay(1000);
      //if timeout
      if (hexStringGlobal == '00') {  
        console.log("TIMOUT: missed keyframe 4");
        // if read kf missed start from top of for loop (reset rep).
        // have 3 sec timer to let patient ready to get ready & show incorrect image
        setimgSrc(require('./assets/incorrect.png'));
        //wait for 3 seconds and prompt that rep is restarting in x time
        // to reset rep
    
        i-=1;
        badFlag = true; // raise flag for mistake was made during rep;
        continue;
      }

      console.log("Hit keyframe 4");

      console.log(`Rep ${i} completed`);
      data.reps -= 1;

      if(badFlag == true){
        exerciseData.bad +=1;
        badFlag =true;
      }else{
        exerciseData.good +=1;
      }
      
    }
    
    data.reps =0;
    exerciseData.score = exerciseData.good / r;
    exerciseData.score *=100;
    setScore(exerciseData.score);
    
    console.log("workout score:", exerciseData.score, exerciseData.bad, exerciseData.good);
    
    setexEnd(true);
  };
   
  //setting the states 
  // let smth = 0; // checking if the key frame was hit 
  // if(smth == 0x10){
  //   currentState = 1
    
  // }
  // else if(smth == 0x20){
  //   currentState = 2;
  // }
  // else if(smth == 0x30){
  //   currentState = 3; 
  // }
  // else if(smth = 0x40){
  //   currentState = 4; 
  // }
  // //incorrect flag 
  // else{
  //   incorrect_flag = 1; 
  //   currentState = 5; 

  // } 


  // useEffect(() => {
  //     //first key frame 
  //     if (imageNum == 1) {
  //       setimgSrc(require('./assets/step1.png'));
  //       console.log('1');
  //     //second key frame 
  //     } else if (imageNum == 2) {
  //       setimgSrc(require('./assets/step2.png'));
  //     //third key frame 
  //     } else if (imageNum == 3) {
  //       setimgSrc(require('./assets/step3.png'));
  //       console.log('3');
  //     }
  //     //fourth key frame 
  //     else if (imageNum == 4) {
  //       setimgSrc(require('./assets/step4.png'));
  //     }
  //     //incorrect key frame 
  //     else if (imageNum == 5) {
  //       setimgSrc(require('./assets/incorrect.png'));
  //       console.log('5');
  //     }

  // }, [imageNum]);
  

  const openCalibrate = () => {
    //writeData(allDevices[0]);

    navigation.navigate('Begin Calibration', {name: 'Here from pressing Calibrate button'});
    
  };

  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  }

  const cancelRef = useRef(null);

  const handleButton = () => {
    setimgSrc(require('./assets/incorrect.png'));
    console.log("updated", imgSrc);
  };
    
    
  return (
    <SafeAreaView>
      <ScrollView>
        <Heading size="2xl" style = {{marginTop:50, marginBottom:50}}>Exercise: {data.name}</Heading>
        
        <Text>Reps to Go!: {data.reps}</Text>

        <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
              <AlertDialog.Content style={{ backgroundColor: 'gray' }}>
                <AlertDialog.CloseButton />
                <AlertDialog.Header style={{textAlign: "center"}}>Please Check</AlertDialog.Header>
                <AlertDialog.Body>
                  Before Starting Please Calibrate Your Device!
                </AlertDialog.Body>
                <AlertDialog.Footer justifyContent="center">
                  <Button style={{alertbuttons, backgroundColor: '#1a7045'}} size="lg" onPress={openCalibrate}>Calibrate</Button>
                </AlertDialog.Footer>
              </AlertDialog.Content>
        </AlertDialog>

        

        {calcomplete
            ? <Button style = {{marginLeft: "auto", marginRight: "auto"}} colorScheme="emerald" onPress={beginExercise}> START </Button>
            : <Button style = {{marginLeft: "auto", marginRight: "auto"}} size="lg" onPress={() => setIsOpen(!isOpen)}> START </Button>
            
        }

        {exEnd
            ? <Text>Exercise Completed! Score = {score}%</Text>
            : <Text></Text>
        }

        
        {exStart
            ? <Image source={imgSrc} style={{width: 250, height: 500, marginTop: 20, marginLeft: "auto", marginRight: "auto"}} />
            : <Text></Text>
        }

        

        
        

        <Button size="lg" style = {{marginLeft: "auto", marginRight: "auto"}} onPress={() => setimgSrc(require('./assets/step3.png'))}> Other keyframe </Button>
        <Text></Text>
        <Button size="lg" style = {{marginLeft: "auto", marginRight: "auto"}} onPress={handleButton}> Incorrect </Button>


        
      </ScrollView>
    </SafeAreaView>
  )

}


export default WorkoutComp

