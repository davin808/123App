import React from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import { Button, Box, Center, Text, Heading } from "native-base";
import {UseBLEHOOK} from './useBLE';
import {BleManager, Device,} from 'react-native-ble-plx';
import { SafeAreaView} from 'react-native';
import {useState} from 'react';
import{useNavigation} from "@react-navigation/native";
import {d} from './useBLE';


export default function Scancomp() {
    const {requestPermissions, scanForDevices, allDevices, writeData,currentDevice} = UseBLEHOOK();
    var connected = false
    const openModal = async () => {
        await requestPermissions(isGranted => {
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
            <Heading size="lg" style = {{marginTop: 50, fontSize: 32}}>Devices Found</Heading>
            {/* {currentDevice.map((device: Device) => (
                <Text fontSize="md" color={'blue.900'}>{currentDevice.name}</Text>
            ))} */}
           
            
          
          {(() => {
            if (d != null) {
              return (
                <>
                  <Text style={{ fontSize: 20, marginBottom: 20, marginTop: 10 }}>{d.name}</Text>
                  <Text style={{ color: 'green', fontSize: 20 }}>Connected</Text>
                </>
              )
            } else if (d == null) {
              return (
                <Text style={{ color: 'red', fontSize: 20 }}>Nothing Connected</Text>
              )
            } else {
              return (
                <Text>catch all</Text>
              )
            }
          })()}

            
            <Button size="lg" onPress={openModal} style={{ marginTop: 40, width: 200 }}>Scan</Button>
                      
        </Box>
        
    </SafeAreaView>
  )
}
