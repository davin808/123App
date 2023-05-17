import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { Button, Box, Center, Text , AlertDialog, alertBu} from "native-base";
import {UseBLEHOOK} from './useBLE';
import {BleManager, Device, NativeDevice} from 'react-native-ble-plx';
import { SafeAreaView} from 'react-native';
import {useState, useRef, useEffect} from 'react';
import{useNavigation} from "@react-navigation/native"
import deviceInfoModule from 'react-native-device-info';
import {d,KEY_FRAME_DATA_UUID, KEY_FRAME_HIT_UUID, CONTROL_BITS_UUID} from './useBLE';
import { atob, btoa } from 'react-native-quick-base64';


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

    const [deviceConnected, setConnect] = useState(false);
    //const [connect, setConnect] = useState("\n")
    //const [calibrate, setCalibrate] = useState("\n")
    const {writeData, disconnectFromDevice, allDevices, currentDevice, readData, hexString, isConnected} = UseBLEHOOK();

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

    useEffect(() => {
      console.log('Count has changed!');
    }, [hexString]);

    


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

    // const onContinue =() => {
    //   navigation.navigate("Choose Workout", {name: 'Here from pressing Scan button'});
    // }

    const onContinue = () => {
      console.log(isConnected)
      if (true) {
        navigation.navigate("Choose Workout", { name: 'Here from pressing Scan button' });
      }
    };
    

    const cancelRef = useRef(null);

    const openDC = async() => {
      await disconnectFromDevice();
      
      console.log("successfuly disconnected");
    }

    const unclickableButtonStyle = {
      opacity: 1.0,
      width: 200,
      height: 50,
      backgroundColor: '#FF0000',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    };
  
    const clickableButtonStyle = {
      width: 200,
      height: 50,
      backgroundColor: '#1a7045',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20
    };
  

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
      marginBottom: 75,
    };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ alignItems: 'center' }}>
            <Image source={require("./assets/title_card2.png")} style= {{width: 250,height: 240, marginTop: -300, marginLeft: "auto", marginRight: "auto"} } />
            <Box alignItems="center">

            
              <Button size="lg" style = {buttondiyaStyle} onPress={openScan}>CONNECT DEVICE</Button>
              <Button size="lg" style={true ? clickableButtonStyle : unclickableButtonStyle} onPress={onContinue}>START EXERCISE</Button>

              {/* <Button size="lg" style = {buttondiyaStyle} onPress={onContinue}>START EXCERCISE</Button> */}
              

              
            </Box>
          </View>
        </SafeAreaView>
    );
};

export default Scanning;