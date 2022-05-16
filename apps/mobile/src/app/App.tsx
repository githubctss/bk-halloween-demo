/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import { 
  gyroscope,
  accelerometer,
  magnetometer,
  barometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import { io } from 'socket.io-client';
import { combineLatest } from 'rxjs';
import { debounceTime } from 'rxjs/operators'

interface CoordinateSensorData {
  x: number; 
  y: number; 
  z: number; 
  timestamp: number;
}

interface BarometerSensorData {
  pressure: number;
  timestamp: number;
}

interface SensorData {
  gyroscope: CoordinateSensorData;
  accelerometer: CoordinateSensorData;
  magnetometer: CoordinateSensorData;
  barometer: BarometerSensorData;
}

setUpdateIntervalForType(SensorTypes.gyroscope, 500);
setUpdateIntervalForType(SensorTypes.accelerometer, 500);
setUpdateIntervalForType(SensorTypes.magnetometer, 500);
setUpdateIntervalForType(SensorTypes.barometer, 500);

export const App = () => {
  const [data, setData] = useState<SensorData | null>(null);
  const scrollViewRef = useRef<null | ScrollView>(null);

  useEffect(() => {
    const socket = io('http://172.20.10.7:3333', {
      path: '/device/socket.io/',
      extraHeaders: {
        'my-custom-header': 'abcd',
      },
    });

    const sensors$ = combineLatest([gyroscope, accelerometer, magnetometer, barometer]).pipe(debounceTime(0));
    const subscription = sensors$.subscribe(([
      gyroscopeSensor, 
      accelerometerSensor, 
      magnetometerSensor, 
      barometerSensor,
    ]: [CoordinateSensorData, CoordinateSensorData, CoordinateSensorData, BarometerSensorData]) => {
      const newData = {
        gyroscope: gyroscopeSensor,
        accelerometer: accelerometerSensor,
        magnetometer: magnetometerSensor,
        barometer: barometerSensor,
      }
      setData(newData);
      socket.emit('DEVICE_JOIN', newData);
    });

    return () => {
      subscription.unsubscribe();
    }
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          ref={(ref) => {
            scrollViewRef.current = ref;
          }}
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          <View style={styles.section}>
            <Text style={styles.title}>Gyroscope Data</Text>
            {data?.gyroscope && (
              <>
                <Text>{ data.gyroscope.x }</Text>
                <Text>{ data.gyroscope.y }</Text>
                <Text>{ data.gyroscope.z }</Text>
                <Text>{ data.gyroscope.timestamp }</Text>
              </>
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.title}>Accelerometer Data</Text>
            {data?.accelerometer && (
              <>
                <Text>{ data.accelerometer.x }</Text>
                <Text>{ data.accelerometer.y }</Text>
                <Text>{ data.accelerometer.z }</Text>
                <Text>{ data.accelerometer.timestamp }</Text>
              </>
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.title}>Magnetometer Data</Text>
            {data?.magnetometer && (
              <>
                <Text>{ data.magnetometer.x }</Text>
                <Text>{ data.magnetometer.y }</Text>
                <Text>{ data.magnetometer.z }</Text>
                <Text>{ data.magnetometer.timestamp }</Text>
              </>
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.title}>Barometer Data</Text>
            {data?.barometer && (
              <>
                <Text>{ data.barometer.pressure }</Text>
                <Text>{ data.barometer.timestamp }</Text>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  scrollView: {
    height: '100%',
    backgroundColor: '#ffffff',
  },
  section: {
    marginVertical: 24,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  }
});

export default App;
