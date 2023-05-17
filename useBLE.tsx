import {PermissionsAndroid, Platform} from 'react-native';
import {BleManager, Device,BleError, Characteristic, NativeDevice, Base64} from 'react-native-ble-plx';
import { useState, useEffect} from 'react';
import { getDeviceSync } from 'react-native-device-info';
import DeviceInfo from 'react-native-device-info';
import {PERMISSIONS, RESULTS, requestMultiple} from 'react-native-permissions';
import { atob, btoa } from 'react-native-quick-base64';
import { parsePackageNameFromAndroidManifestFile } from '@react-native-community/cli-platform-android/build/config/getAndroidProject';


// request permissions in android
type VoidCallback =  (result: boolean) => void;


const pi_UUID = '0000';
// const pi_CHARACTERISTIC = '00002a57-0000-1000-8000-00805f9b34fb';
// const pi_SERVICE = '0000180a-0000-1000-8000-00805f9b34fb';

const pi_SERVICE = '0c35e466-ad83-4651-88fa-0ff9d70fbf8c';
//06:E1:44:FC:4B:4B
//central id^



export const KEY_FRAME_DATA_UUID = "b26dd24c-6bff-417c-aa16-c857b25b9c28";
export const KEY_FRAME_HIT_UUID =  "0180ef1a-ef68-11ed-a05b-0242ac120003";
export const CONTROL_BITS_UUID = "a10fb559-3be8-40e2-aaca-27721b853a71";




const datatoWrite = btoa("01");
let deviceID = '';

export let d: Device;
export let v: string;
export let hexStringGlobal: string;


let i = 0;   //counter for write and read
// let j = 0;      // coutner for read

export function UseBLEHOOK() {
    const bleManager = new BleManager();
    //create state that will hold all devices in a array found on scan. 
    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [currentDevice, setCurrentDevice] = (useState<Device | null>(null));
    const [connectedDevice, setConnectedDevice] = (useState<Device | null>(null));
    const [command, setcommand] = useState<number>(0);
    const [isConnected, setIsConnected] = useState(false);
    const [hexString, sethexString] = useState('');

    const connect = async() => {
        await connectToDevice();
        // await d.discoverAllServicesAndCharacteristics();
    }

    // useEffect(() => {
        
    //     if(currentDevice != null){
    //         console.log("running the connect funciton");
    //         connect();
    //     }else if(currentDevice == null){
    //         console.log("current device went null");
    //     }
    // }, [currentDevice])
    

    
    // request permission from user
    const requestPermissions = async (cb: VoidCallback) => {
        //check os
        if (Platform.OS === 'android') {
            const apiLevel = await DeviceInfo.getApiLevel();

            if (apiLevel < 31) { // less than android 12
                // request for a status for location permission on android
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    { 
                        title: 'Location Permission',
                        message: 'Bluetooth Low Energy requires Location',
                        buttonNeutral: 'Ask Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                // return and chekc if the granted status is equal to granted
                cb(granted === PermissionsAndroid.RESULTS.GRANTED); 
            }else{
                const result = await requestMultiple([
                    PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
                    PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
                    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                    //   PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
                ]);

                const isGranted =
                    result['android.permission.BLUETOOTH_CONNECT'] ===
                        PermissionsAndroid.RESULTS.GRANTED &&
                    result['android.permission.BLUETOOTH_SCAN'] ===
                        PermissionsAndroid.RESULTS.GRANTED &&
                    result['android.permission.ACCESS_FINE_LOCATION'] ===
                        PermissionsAndroid.RESULTS.GRANTED;
                    //   result['android.permission.ACCESS_BACKGROUND_LOCATION'] ===
                    //     PermissionsAndroid.RESULTS.GRANTED;
        
                cb(isGranted);
            }
        } else { // here if ios
            cb(true);
        }
    };

    // funciton to filter out if device advertised itself twice
    // if new device is already in the array then dont add it
    const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
        devices.findIndex(device => nextDevice.id === device.id) > -1;


    const scanForDevices = () => {
        console.log("outside");
        bleManager.startDeviceScan(null, null, (error, device) => {
            //console.log('start scanning for devices');
            if(error){  // if error if some device declines permissions
                console.log("error",error);  
                return; 
            }
            
            if (device && (device.localName?.includes("MoCopy (central)"))) {
                // const allDevicenew = [];
                // allDevicenew[0] = device;
                // setAllDevices(allDevicenew);  //update allDevice state
                setCurrentDevice(device);
                //console.log("Found in scan",allDevices[0].name, device.localName);
                bleManager.stopDeviceScan();
                deviceID = device.id;
                
                //connect();
                
                connectToDevice();

                console.log('after connect call')
                return(null);
            }
        });

    }

    const connectToDevice = async () => {
        try {
            d= await bleManager.connectToDevice(currentDevice!.id);
            // d = await currentDevice!.connect();
            await d.discoverAllServicesAndCharacteristics();
            console.log("discovered services and characteristics");
            console.log("connected to id below");
            console.log(d!.id);
            console.log(d!.id);
            
            setConnectedDevice(d);
            // const services = await device.services();
            
            
            // const characteristics = await device.characteristicsForService('0000180a-0000-1000-8000-00805f9b34fb');
            // console.log(characteristics);
            
            
            
            // for some reason device is only connected here when back out to home connected devices go low
            //await writeData();

        } catch (error) {
            console.log('Error connecting to device:', error);
            
            // if (error == "TypeError: Cannot read property 'id' of null"){
            //     connectToDevice();
            // }
        }
    };

    const disconnectFromDevice = async () => {
        try {
            
            console.log('current id disc from');
            console.log(currentDevice!.id);
            console.log(connectedDevice!.id);
            await bleManager.cancelDeviceConnection(currentDevice!.id);

            await connectedDevice!.cancelConnection();

            setIsConnected(false);
            
            
        } catch (error) {
            console.log('Error disconnecting from device:', error);
        }
    };


    
    const writeData =  async(value: Base64, characteristic: string) => {
        try {
            //console.log(connectedDevice!.id);
            //console.log(device!.id);

            //count 2 because for somereason only after connecting twice it connects after pressing send 1
            
                // console.log('write connect', i);
            // for (i; i < 3 ; i++){
            //     const dev = await d!.connect();
            //     await dev.discoverAllServicesAndCharacteristics();
            //     console.log("write", i);
            //     setIsConnected(true);

            // } 
            

            await bleManager.writeCharacteristicWithResponseForDevice(
                deviceID,
                pi_SERVICE,  // service uuid
                characteristic,  //characteristic
                value     //string to base64 data to write
                
            );
            console.log("successfully wrote:", value);
            
          } catch (e) {
            

            if(e == "BleError: Device ? is already connected"){
                console.log("already connected exception")
                await bleManager.writeCharacteristicWithoutResponseForDevice(
                    deviceID,
                    pi_SERVICE,  // service uuid
                    characteristic,  //characteristic
                    value     //string to base64 data to write
                    
                );
            }else if (e == "BleError: Device 06:E1:44:FC:4B:4B is not connected"){
                console.log("not connected exception");
                try{
                    const dev = await d!.connect();
                    await dev.discoverAllServicesAndCharacteristics();
                    await writeData(value, characteristic);
                }catch(err){
                    if(e == "BleError: Device 06:E1:44:FC:4B:4B was disconnected"){
                        console.log("catch connect ex");
                        const dev = await d!.connect();
                        await dev.discoverAllServicesAndCharacteristics();
                        await writeData(value, characteristic);
                    }
                }
                

            }else{
                console.log('Error in Writing funciton',e);
            }
            
          }
          


        
        // console.log("Found in write function",allDevices[0].name, allDevices[0].localName);
    };
    
    
    const readData =  async(characteristic: string) => {
        try {
            //console.log(connectedDevice!.id);
            //console.log(device!.id);

            //count 2 because for somereason only after connecting twice it connects after pressing send 1
            // for (i; i < 3 ; i++){
            //     console.log('read connect', i);

                const c = await bleManager.readCharacteristicForDevice(
                    deviceID,
                    pi_SERVICE,
                    characteristic,
                );  
                
                if (c != null){
                    const byteCharacters = atob(c?.value);
                    const byteNumbers = new Array(byteCharacters.length);

                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);

                    // Convert byte array to hex string
                    const hexString1 = Array.from(byteArray)
                    .map((byte) => {
                        return ('0' + byte.toString(16)).slice(-2);
                    })
                    .join('');

                    sethexString(hexString1);
                    hexStringGlobal = hexString1;
                    
                    console.log("value: ", hexString1);
                }else{
                    console.log("read characteristic is null");
                }
                
            // }
            console.log("successfully read value", hexStringGlobal);
            
            
        //     await bleManager.readCharacteristicForDevice(
        //         d!.id,
        //         '0000180a-0000-1000-8000-00805f9b34fb',  // service uuid
        //         '00002a57-0000-1000-8000-00805f9b34fb'  //characteristic         
        //     );
          } catch (e) {
            

            if(e == "BleError: Device ? is already connected"){
                let c = await bleManager.readCharacteristicForDevice(
                    deviceID,
                    pi_SERVICE,  // service uuid
                    characteristic,  //characteristic
                    
                );

            }else if (e == "BleError: Device 06:E1:44:FC:4B:4B is not connected"){
                console.log("Read not connected exception")
                try{
                    const dev = await d!.connect();
                    await dev.discoverAllServicesAndCharacteristics();
                    await readData(characteristic);
                }catch(err){
                    if(e == "BleError: Device 06:E1:44:FC:4B:4B was disconnected"){
                        console.log("catch connect ex");
                        const dev = await d!.connect();
                        await dev.discoverAllServicesAndCharacteristics();
                        await readData(characteristic);
                    }
                }
                
                console.log("Read");
            }else if(e == "BleError: Device 06:E1:44:FC:4B:4B was disconnected"){
                console.log("Read disconnected xception");
                try{
                    const dev = await d!.connect();
                    await dev.discoverAllServicesAndCharacteristics();
                    await readData(characteristic);
                }catch(err){
                    if(e == "BleError: Device 06:E1:44:FC:4B:4B was disconnected"){
                        console.log("catch connect ex");
                        const dev = await d!.connect();
                        await dev.discoverAllServicesAndCharacteristics();
                        await readData(characteristic);
                    }
                }
                
                console.log("Read");

            }else{
                console.log('Error in Reading funciton',e);
            }
            
          }
          


        
        // console.log("Found in write function",allDevices[0].name, allDevices[0].localName);
    };

    const valueUpdate = (
        error: BleError | null,
        characteristic: Characteristic | null,
      ) => {
        
        if (error) {
          console.log(error);
          return -1;
        } else if (!characteristic?.value) {
          console.log('No Data was recieved');
          return -1;
        }

        const byteCharacters = atob(characteristic.value);

        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Convert byte array to hex string
        const hexString1 = Array.from(byteArray)
        .map((byte) => {
            return ('0' + byte.toString(16)).slice(-2);
        })
        .join('');

        sethexString(hexString1);
        
        console.log("value: ", hexString);

    }


    return {
        requestPermissions, 
        scanForDevices,
        connectToDevice,
        allDevices,
        currentDevice,
        disconnectFromDevice,
        writeData,
        command,
        readData, 
        valueUpdate,
        hexString
    };
}