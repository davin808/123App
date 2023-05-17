import React, { useEffect, useState } from 'react';
import { TouchableOpacity, SafeAreaView } from 'react-native';
import { Button, Center, CheckIcon, Heading, Spinner, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import {UseBLEHOOK} from './useBLE';
import {d, KEY_FRAME_DATA_UUID, CONTROL_BITS_UUID, hexStringGlobal} from './useBLE';
import { atob, btoa } from 'react-native-quick-base64';

export let calcomplete = false;

const Calibrationcomp = () => {
  const navigation = useNavigation();
  const {writeData, disconnectFromDevice, allDevices, currentDevice, readData, hexString, connectToDevice} = UseBLEHOOK();
  const [countdown, setCountdown] = useState(1);
  const [wiggle, setWiggle] = useState(false);
  const [complete, setComplete] = useState(false);
  const [start, setStart] = useState(false);

  // wait for arduino to say the if completed calibration
  function switchComplete() {
    setComplete(true);
  }
  function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  //this use effect handles 5 second timer
  useEffect(() => {
    if (start === true) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000); // 1000 milliseconds = 1 second

      // Clear timeout if component unmounts or countdown reaches 0
      if (countdown === 0) {
        calcomplete = true;
        clearTimeout(timer);
        setComplete(true);
        writeData(btoa("03") , CONTROL_BITS_UUID);  //50
        console.log("sent calibrate control SENT MDE= decode to ascii from base64 ==01 ");
      }
      return () => clearTimeout(timer);
    } else {
      console.log('Start Not True');
    }
  }, [countdown, start]);

  // this function is called when calibration is complete
  const handleCalibrationComplete = () => {
    navigation.goBack(); // navigate back to the previous screen
  };

  const startTimer = () => {
    setCountdown(5); //begin countdown
    setComplete(false); //swithc to spinning ball
    setStart(true);
  };

  // listen for changes in the 'complete' state
  useEffect(() => {
    if (complete) {
      handleCalibrationComplete();
    }
  }, [complete]);


  const cal =  async() => {
    await writeData(btoa("01") , CONTROL_BITS_UUID);  //send 48 calibration end
    await delay(2000);
    while(1){
      await readData(CONTROL_BITS_UUID);
      
      if(hexStringGlobal == "31"){  //wait for calibrate done
        setWiggle(true);
        break;
      } 
      
    }



    startTimer();




  }


  return (
    <SafeAreaView>
      <Heading
        size="2xl"
        style={{
          marginTop: 100,
          marginBottom: 'auto',
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
        }}
      >
        Calibration in Progress
      </Heading>

      <Button size="lg" style={{ marginLeft: 'auto', marginRight: 'auto' }} onPress={cal}>
        Begin Calibration
      </Button>

      {start ? (
        <Text> Hold Still Like the Picture For {countdown} More Seconds</Text>   // NOTE add picture heree
      ) : (
        <Text></Text>
      )}

      {wiggle
          ? <Text></Text>  // NOTE  add checkmark for wiggle mwhen done?
          : <Text> Press Begin Calibration then wiggle your arms around til this text goes away</Text>
      }


      {complete ? (
        <Center>
          <TouchableOpacity onPress={handleCalibrationComplete}>
            <CheckIcon size="5" mt="0.5" color="emerald.500" />
            <Text> Calibration Success! Please Press the Back Button</Text>
          </TouchableOpacity>
        </Center>
      ) : (
        <Center>
          <Spinner size="lg" />
        </Center>
      )}
    </SafeAreaView>
  );
};

export default Calibrationcomp;
