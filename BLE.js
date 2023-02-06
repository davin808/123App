import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import { Button, Box, Center } from "native-base";
import{useNavigation, useRoute} from "@react-navigation/native"

const styles = StyleSheet.create({
    one: {
      marginBottom: 15,
      alignSelf: 'center',
    },
    buttonContainer:{
      flexDirection: 'column',
      backgroundColor: '#aaa',
      borderWidth: 5,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
});

const Sentence = (props) => {
    return (
        <Box alignItems="center" style = {styles.one}>
            <Text style = {{marginBottom:10}}>Press to Connect to: {props.name}!</Text>
            <Button onPress={() => console.log("Connecting to", props.name)}>{props.name}</Button>
        </Box>
    );
};

const BLEcomp = () => {
  const navigation = useNavigation();
  const route = useRoute();

  return (

      <View style={styles.buttonContainer}>
        <Sentence name="iPhone" />
        <Sentence name="Arduino" />
        <Sentence name="TV" />
        <Text> Result:{route.params.name} </Text>
      </View>
  );

};




export default BLEcomp;