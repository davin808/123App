import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import { Button, Box, Center, Text , AlertDialog} from "native-base";
import useBLE from './useBLE';
import {BleManager, Device, NativeDevice} from 'react-native-ble-plx';
import { SafeAreaView} from 'react-native';
import {useState, useRef} from 'react';
import{useNavigation} from "@react-navigation/native"
import deviceInfoModule from 'react-native-device-info';




// const styles = StyleSheet.create({
//     one: {
//         marginBottom: 15,
//         alignSelf: 'center',
//       },
//       buttonContainer:{
//         flexDirection: 'column',
//         backgroundColor: '#aaa',
//         borderWidth: 5,
//         alignItems: 'flex-start',
//         justifyContent: 'center',
//       },
// });



const Scanning = () => {

    const navigation = useNavigation();
    // const {requestPermissions, scanForDevices, allDevices} = useBLE();
    // const dummyman = new BleManager();
    // const nativedum = new nativeDevice();
    // const dummy = new Device(dummyman);

    const [connect, setConnect] = useState("Not Connected")
    const [calibrate, setCalibrate] = useState("Not Calibrated")
    const {writeData, disconnectFromDevice, allDevices} = useBLE();
    //typeof allDevices[0] !== 'undefined'
    // const startScan = () => {
    //     requestPermissions(isGranted => {
    //       if (isGranted) {
    //         console.log("granted");
    //         scanForDevices();
    //         console.log("finished");
    //         //navigation.navigate('BLE', {name: 'Here from pressing Scan button'});
    //       }
    //     });
    //   };

    function switchConnect(){
      if(connect == "Not Connected"){
        setConnect("Connected") 
      }else{
        setConnect("Not Connected")
      } 
    }

    function switchCalibrate(){
      if(calibrate == "Not Calibrated"){
        setCalibrate("Calibrated") 
      }else{
        setCalibrate("Not Calibrated")
      
      }
    }

    


    // const openModal = async () => {
    //   requestPermissions(isGranted => {
    //     if (isGranted) {
    //       console.log("granted");
    //       scanForDevices();
    //       console.log("finished");
    //       //navigation.navigate('BLE', {name: 'Here from pressing Scan button'});
    //     }else{
    //       console.log("Not granted");
    //     }
    //   });

    // };

    const openCalibrate = () => {
      //writeData(allDevices[0]);

      navigation.navigate('Begin Calibration', {name: 'Here from pressing Calibrate button'});
      
    };

    const openScan = () => {
      navigation.navigate('Begin Scan', {name: 'Here from pressing Scan button'});

    };
    const [isOpen, setIsOpen] = useState(false);

    const onClose = () => {
      setIsOpen(false);
    }

    const onContinue =() => {
      navigation.navigate("Choose Workout", {name: 'Here from pressing Scan button'});
    }
    

    const cancelRef = useRef(null);

    const openDC = () => {
      disconnectFromDevice();
      console.log("successfuly disconnected");
    }

    const buttondiyaStyle = {
      width: 200,
      height: 50,
      backgroundColor: '#1a7045',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    };

    const alertbuttons = {
      width: 150,
      height: 50,
      backgroundColor: '#1a7045',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 100,
    };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
          <Text style = {{marginBottom:20, marginTop: 30}} fontSize="lg">       {connect}                      {calibrate}</Text>
          <Box alignItems="center">

            {/* <Text style = {{marginBottom:20, marginTop: 30}} fontSize="lg">Press to Connect to Scan For BLE Devices!</Text> */}
            {/* <Button onPress={() => navigation.navigate('BLE', {name: 'Here from pressing Scan button'})}> Scan </Button> */}
            {/* {allDevices.map((device: Device) => (
            <Text>{device.name}</Text>
            ))} */}
            <Button size="lg" style = {buttondiyaStyle} onPress={openScan}>CONNECT DEVICE</Button>
            {/* <TouchableOpacity onPress={openModal}> 
            <Text> {"Scan"} </Text>
            </TouchableOpacity> */}

            {/* <Text style = {{marginBottom:20, marginTop: 30}} fontSize="lg">Press to Calibrate Your BLE Device</Text> */}
            <Button size="lg" onPress={openCalibrate} style = {buttondiyaStyle}>CALIBRATE</Button>
            
            {/* <Text style = {{marginBottom:20, marginTop: 30}} fontSize="lg">Press to Disconnect Your BLE Device</Text> */}
            <Button size="lg" onPress={openDC} style = {buttondiyaStyle}>DISCONNECT</Button>
            
            {allDevices.map((device: Device) => (
                <Text fontSize="md" color={'blue.900'}>Connected Device: {device.name}</Text>
            ))}

            {/* <Text fontSize="md" color={'blue.900'}>Connected Device: {allDevices[0].name}</Text> */}

            <Button size="lg" onPress={() => writeData(allDevices[0])} style = {{marginBottom:10}}>Send 1</Button>
            

            <Button size="lg" style = {buttondiyaStyle} onPress={() => setIsOpen(!isOpen)}>START EXCERCISE</Button>
            <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
              <AlertDialog.Content style={{ backgroundColor: 'gray' }}>
                <AlertDialog.CloseButton />
                <AlertDialog.Header style={{textAlign: "center"}}>Please Check</AlertDialog.Header>
                <AlertDialog.Body>
                  Please double check that the device is connected and calibrated.
                </AlertDialog.Body>
                <AlertDialog.Footer>
                  <Button.Group space={8}flexDirection="row" justifyContent="center">
                    <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                      Back
                    </Button>
                    <Button style = {alertbuttons} onPress={onContinue}>Continue
                    </Button>
                  </Button.Group>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog>

            
          </Box>
          
        </SafeAreaView>
    );
};

export default Scanning;