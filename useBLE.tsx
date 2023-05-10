import {PermissionsAndroid, Platform} from 'react-native';
import {BleManager, Device,BleError, Characteristic, NativeDevice} from 'react-native-ble-plx';
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
const pi_CHARACTERISTIC = 'a59d3afb-5010-43f0-a241-1ad27e92d7b9';

const EXERCISE_INFO_CHARACTERISTIC_UUID = "f75061a7-e391-4b61-ae4b-95812a2086e3";
const datatoWrite = btoa("01");
let deviceID = '';

export let d: Device;
export let v: string;


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

    useEffect(() => {
        const connect = async() => {
            await connectToDevice();
            // await d.discoverAllServicesAndCharacteristics();
        }

        if(currentDevice != null){
            console.log("running the connect funciton");
            connect();
        }else if(currentDevice == null){
            console.log("current device went null");
        }else{
            console.log("Use effect called");
        }

        
        
        
    }, [currentDevice])
    

    
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


    
    const writeData =  async(value: string) => {
        try {
            //console.log(connectedDevice!.id);
            //console.log(device!.id);

            //count 2 because for somereason only after connecting twice it connects after pressing send 1
            for (i ; i < 2; i++){
                console.log('second connect', i);
                
                const dev = await d!.connect();
                await dev.discoverAllServicesAndCharacteristics();
               
                setIsConnected(true);
                
            }

            await bleManager.writeCharacteristicWithResponseForDevice(
                d!.id,
                '0000180a-0000-1000-8000-00805f9b34fb',  // service uuid
                '00002a57-0000-1000-8000-00805f9b34fb',  //characteristic
                value     //string to base64 data to write
                
            );
            console.log("successfully wrote:", value);
            
          } catch (e) {
            console.log('Error when Writing',e);
          }
          


        
        // console.log("Found in write function",allDevices[0].name, allDevices[0].localName);
    };
    
    
    const readData =  async() => {
        try {
            //console.log(connectedDevice!.id);
            //console.log(device!.id);

            //count 2 because for somereason only after connecting twice it connects after pressing send 1
            for (i; i < 3 ; i++){
                console.log('second connect', i);
                
                const dev = await d!.connect();
                await dev.discoverAllServicesAndCharacteristics();
               
                setIsConnected(true);
                d.monitorCharacteristicForService(
                    pi_SERVICE,
                    pi_CHARACTERISTIC,
                    (error, characteristic) => valueUpdate(error, characteristic),
                );  
                
                
            }
            console.log("successfully read");
            
            
            
            

            
        //     await bleManager.readCharacteristicForDevice(
        //         d!.id,
        //         '0000180a-0000-1000-8000-00805f9b34fb',  // service uuid
        //         '00002a57-0000-1000-8000-00805f9b34fb'  //characteristic         
        //     );
          } catch (e) {
            console.log('Error when Writing',e);
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