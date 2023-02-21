import React from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import { Button, Box, Center, Text, Heading } from "native-base";
import useBLE from './useBLE';
import {BleManager, Device,} from 'react-native-ble-plx';
import { SafeAreaView} from 'react-native';
import {useState} from 'react';
import{useNavigation} from "@react-navigation/native"


export default function Scancomp() {
    const {requestPermissions, scanForDevices, allDevices, writeData} = useBLE();

    const openModal = async () => {
        requestPermissions(isGranted => {
          if (isGranted) {
            console.log("granted");
            scanForDevices();
            //console.log("found in scan", allDevices[0].name);
            //writeData(allDevices[0]);
            console.log('gfinished')
            //navigation.navigate('BLE', {name: 'Here from pressing Scan button'});
          }else{
            console.log("Not granted");

          }
        });
  
    };
    
    return (
    <SafeAreaView>
        <Box alignItems="center">
            <Heading size="md" style = {{marginTop: 30}}>Devices Found</Heading>
            {allDevices.map((device: Device) => (
                <Text fontSize="md" color={'blue.900'}>{device.name}</Text>
            ))}

            <Button size="lg" onPress={openModal} style = {{marginTop: 30}}>Scan</Button>
                
        
        </Box>
        
    </SafeAreaView>
  )
}
