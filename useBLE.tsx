import {PermissionsAndroid, Platform} from 'react-native';
import {BleManager, Device,BleError, Characteristic} from 'react-native-ble-plx';
import { useState } from 'react';
import { getDeviceSync } from 'react-native-device-info';
import DeviceInfo from 'react-native-device-info';
import {PERMISSIONS, RESULTS, requestMultiple} from 'react-native-permissions';
import { atob, btoa } from 'react-native-quick-base64';



// request permissions in android
type VoidCallback =  (result: boolean) => void;

const bleManager = new BleManager();


const pi_UUID = '0000';
const pi_CHARACTERISTIC = '00002a57-0000-1000-8000-00805f9b34fb';
const pi_SERVICE = '0000180a-0000-1000-8000-00805f9b34fb';
const datatoWrite = btoa("01");


interface BluetoothLowEnergyApi {
    requestPermissions(cb: VoidCallback): Promise<void>; // request permisison for refined location
    connectToDevice(device: Device): Promise<void>;// method for connecting
    scanForDevices(): void; // interface for scan for devices
    writeData(device: Device): Promise<void>; // interface for writing to device
    currentDevice: Device | null;
    allDevices: Device[]; // devices state array of device structs
    disconnectFromDevice: () => void;
    command: number;

}

export interface CMD {
    opCode: BigInt;
    commandData: BigInt;
  }
  

export enum COMMAND_TYPE {  // use to decypher command type
    CALIBRATE = 1,  // send command?
    WORKOUT = 2,    // hearing response?
}



//hook
export default function useBLE(): BluetoothLowEnergyApi{
    //create state that will hold all devices in a array found on scan. 
    const [allDevices, setAllDevices] = useState<Device[]>([]);
    const [currentDevice, setCurrentDevice] = useState<Device | null>(null);
    const [command, setcommand] = useState<number>(0);

    

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


    const connectToDevice = async (device: Device) => {
        try{
            const deviceConnection = await bleManager.connectToDevice(device.id);
            setCurrentDevice(deviceConnection);
            await deviceConnection.discoverAllServicesAndCharacteristics();
            //log services and characteristic for a service
            const services = await device.services();
            //console.log(services);
            const characteristics = await device.characteristicsForService('0000180a-0000-1000-8000-00805f9b34fb');
            console.log(characteristics)
            //startStreamingData(deviceConnection);
            console.log('connected');
            writeData(allDevices[0]);
        } catch (error1) {
            console.log('failed to connect', error1);
        }
    };

    const scanForDevices = () => {
        console.log("outside");
        bleManager.startDeviceScan(null, null, (error, device) => {
            //console.log('start scanning for devices');
            if(error){  // if error if some device declines permissions
                console.log("error",error);  
                return; 
            }
            
            if (device && (device.name?.includes("Arduino") ||
            device.localName?.includes("DavinBLE"))) {
                const allDevicenew = [];
                allDevicenew[0] = device;
                setAllDevices(allDevicenew);  //update allDevice state
                setCurrentDevice(device);
                console.log("Found in scan",allDevices[0].name, device.localName);
                bleManager.stopDeviceScan();
                connectToDevice(device);
                console.log('after connect call')

                return(null);
                // setAllDevices(prevState => {
                //   if (!isDuplicateDevice(prevState, device)) {
                //     return [...prevState, device];
                //   }
                //   return prevState;
                // });
            }
        });
        console.log("end");

    }

    

    const disconnectFromDevice = () => {
        if(currentDevice) {  // if status to connected device is not null
            bleManager.cancelDeviceConnection(allDevices[0].id);  // stop connection
            setCurrentDevice(null);   //change status to null
            // setcommand(0);  //reset command
        }
    };

    // const startStreamingData = async (device: Device) => {
    //     if(device){ // if device conneced start listening for data
    //         device.monitorCharacteristicForService(pi_UUID,pi_CHARACTERISTIC,() => {});
    //     }else { // no current device
    //         console.error('NO Device Connected'); 
    //     }
    // };

    const writeData = async (device: Device) => {
        try {
            console.log(device.id);
            await bleManager.writeCharacteristicWithResponseForDevice(
                device.id,
                '0000180a-0000-1000-8000-00805f9b34fb',  // service uuid
                '00002a57-0000-1000-8000-00805f9b34fb',  //characteristic
                btoa("01")     //string to base64 data to write
                
            );
          } catch (e) {
            console.log(e);
          }
        console.log("Found in write function",allDevices[0].name, device.localName);
        // if (typeof(allDevices[0]) != 'undefined'){
        //     console.log('defined');
        //     allDevices[0].writeCharacteristicWithoutResponseForService(
        //         '0000180A-0000-1000-8000-00805F9B34FB',
        //         '00002A57-0000-1000-8000-00805F9B34FB',
        //         btoa("AQ==")
        //     )
        //     bleManager.writeCharacteristicWithoutResponseForDevice(
        //         allDevices[0].id,
        //         '0000180A-0000-1000-8000-00805F9B34FB',
        //         '00002A57-0000-1000-8000-00805F9B34FB',
        //         btoa("01")
        //     )
        //     console.log("finish write");
        // }else{
        //     console.log('undefined');
        // }

        //typeof device !== 'undefined'
    };
        
    //const onCommandUpdate = (  // on update read data
    //     error: BleError | null,
    //     characteristic: Characteristic | null
    // ) => {
    //     if(error) {
    //         console.error(error);
    //         return;
    //     }else if(!characteristic?.value) {
    //         console.error("No Characteristic Found");
    //         return;
    //     }
    //     const rawData = atob(characteristic.value);  
    //     const firstBit: number = Number(rawData) & 0x01;   //get first bit of data. can be used like a sign bit for commmand type
    // }

    
    return {
        requestPermissions, 
        scanForDevices,
        connectToDevice,
        allDevices,
        currentDevice,
        disconnectFromDevice,
        writeData,
        command,
    };
}
