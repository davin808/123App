import React from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import { Button, Box, Center, Text, Heading, Progress, HStack, Spinner, CheckIcon} from "native-base";
import useBLE from './useBLE';
import { SafeAreaView} from 'react-native';
import {useState, useEffect} from 'react';
import{useNavigation} from "@react-navigation/native"


export let calcomplete = false;

const Calibrationcomp = () => {
  const navigation = useNavigation();

  const [countdown, setCountdown] = useState(1);

  const [complete, setComplete] = useState(false);  //used to tell when calibration is done
  
  const [start, setStart] = useState(false);   // when start is true then count down. this was added because timer immediatly counts down after navigating to page
  
  // wait for arduino to say the if completed calibration
  function switchComplete(){
      setComplete(true);
  }


  //this use effect handles 5 second timer 
  useEffect(() => {
    if (start == true){
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000); // 1000 milliseconds = 1 second

      // Clear timeout if component unmounts or countdown reaches 0
      if (countdown === 0) {
        calcomplete = true;
        clearTimeout(timer);
        setComplete(true);   //set complete to true and add checkmark
        
        //send calibrate to pi?
      }
      return () => clearTimeout(timer);
    }else{
      console.log(" Start Not True");
    }
    
  }, [countdown]);


  


  const startTimer = () => {
    setCountdown(5);      //begin countdown
    setComplete(false);  //swithc to spinning ball 
    setStart(true);
    //send start timer to pi?      
    
  };


  return (
    <SafeAreaView>
        <Heading size="2xl" style = {{marginTop:100, marginBottom:"auto", marginLeft:"auto", marginRight:"auto", textAlign:"center"}}>Calibration in Progress</Heading>
        
        <Button size="lg" onPress={startTimer}> Begin Calibration </Button>
        
        {start
            ? <Text> {countdown}</Text>
            : <Text> Once You Press "Begin Calibration" Please Stand Like The Picture Below</Text>
            
        }
        
        {complete
            ? <Center> <CheckIcon size="5" mt="0.5" color="emerald.500" /> <Text> Calibration Success! Please Press the Back Button</Text> </Center>
            : <Center> <Spinner size="lg" />  </Center>
            
        }
        

    </SafeAreaView>
    
  )
}

export default Calibrationcomp
