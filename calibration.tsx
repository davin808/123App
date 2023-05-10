import React, { useEffect, useState } from 'react';
import { TouchableOpacity, SafeAreaView } from 'react-native';
import { Button, Center, CheckIcon, Heading, Spinner, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import useBLE from './useBLE';

export let calcomplete = false;

const Calibrationcomp = () => {
  const navigation = useNavigation();

  const [countdown, setCountdown] = useState(1);
  const [complete, setComplete] = useState(false);
  const [start, setStart] = useState(false);

  // wait for arduino to say the if completed calibration
  function switchComplete() {
    setComplete(true);
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

      <Button size="lg" style={{ marginLeft: 'auto', marginRight: 'auto' }} onPress={startTimer}>
        Begin Calibration
      </Button>

      {start ? (
        <Text> {countdown}</Text>
      ) : (
        <Text> Once You Press "Begin Calibration" Please Stand Like The Picture Below</Text>
      )}

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
