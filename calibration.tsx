import React from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import { Button, Box, Center, Text, Heading, Progress, HStack, Spinner, CheckIcon} from "native-base";
import useBLE from './useBLE';
import { SafeAreaView} from 'react-native';
import {useState} from 'react';
import{useNavigation} from "@react-navigation/native"


const Calibrationcomp = () => {

    const [complete, setComplete] = useState(false);
    
    // wait for arduino to say the if completed calibration
    function switchComplete(){
        setComplete(true);
    }
  return (
    <SafeAreaView>
        <Heading size="2xl" style = {{marginTop:50, marginBottom:50}}>Calibration in Progress</Heading>
        
        {complete
            ? <Center> <CheckIcon size="5" mt="0.5" color="emerald.500" /> </Center>
            : <Center> <Spinner size="lg" /> </Center>
            
        }
        

    </SafeAreaView>
    
  )
}

export default Calibrationcomp