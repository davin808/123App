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
const pi_CHARACTERISTIC = '0000';

interface BluetoothLowEnergyApi {
    requestPermissions(cb: VoidCallback): Promise<void>; // request permisison for refined location
    connectToDevice(device: Device): Promise<void>; // method for connecting
    scanForDevices(): void; // interface for scan for devices
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
    CALIBRATE = 1,
    WORKOUT = 2,
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


    const scanForDevices = () => {
        console.log("outside");
        bleManager.startDeviceScan(null, null, (error, device) => {
            //console.log('start scanning for devices');
            if(error){  // if error if some device declines permissions
                console.log("error",error);  
                return; 
            }
            
            if (device && device.name?.includes('B')) {
                console.log("Found",device.name, device.localName);
                setAllDevices(prevState => {
                  if (!isDuplicateDevice(prevState, device)) {
                    return [...prevState, device];
                  }
                  return prevState;
                });
            }
        });
        console.log("end");

    }

    const connectToDevice = async (device: Device) => {
        try{
            const deviceConnection = await bleManager.connectToDevice(device.id);
            setCurrentDevice(deviceConnection);
            await deviceConnection.discoverAllServicesAndCharacteristics();
            bleManager.stopDeviceScan();
            startStreamingData(deviceConnection);
        } catch (error1) {
            console.log('failed to connect', error1);
        }
    };

    const disconnectFromDevice = () => {
        if(currentDevice) {  // if status to connected device is not null
            bleManager.cancelDeviceConnection(currentDevice.id);  // stop connection
            setCurrentDevice(null);   //change status to null
            // setcommand(0);  //reset command
        }
    };

    const startStreamingData = async (device: Device) => {
        if(device){ // if device conneced start listening for data
            device.monitorCharacteristicForService(pi_UUID,pi_CHARACTERISTIC,() => {});
        }else { // no current device
            console.error('NO Device Connected'); 
        }
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
        command,
    };
}
