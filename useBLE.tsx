import {PermissionsAndroid, Platform} from 'react-native';
import {BleManager, Device,BleError, Characteristic} from 'react-native-ble-plx';
import { useState } from 'react';
import { getDeviceSync } from 'react-native-device-info';
import DeviceInfo from 'react-native-device-info';
import {PERMISSIONS, RESULTS, requestMultiple} from 'react-native-permissions';


// request permissions in android
type VoidCallback =  (result: boolean) => void;

const bleManager = new BleManager();


interface BluetoothLowEnergyApi {
    requestPermissions(cb: VoidCallback): Promise<void>; // request permisison for refined location
    scanForDevices(): void; // interface for scan for devices
    allDevices: Device[]; // devices state array of device structs
}




//hook
export default function useBLE(): BluetoothLowEnergyApi{
    //create state that will hold all devices in a array found on scan. 
    const [allDevices, setAllDevices] = useState<Device[]>([]);
    
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
        
      
    return {
        requestPermissions, 
        scanForDevices,
        allDevices,

    };
}
