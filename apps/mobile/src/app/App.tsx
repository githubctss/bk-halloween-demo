import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { 
  gyroscope,
  accelerometer,
  magnetometer,
  barometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import { combineLatest } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { 
  CoordinateSensorData, 
  BarometerSensorData, 
  SensorData,
} from '@bk/entities';

setUpdateIntervalForType(SensorTypes.gyroscope, 500);
setUpdateIntervalForType(SensorTypes.accelerometer, 500);
setUpdateIntervalForType(SensorTypes.magnetometer, 500);
setUpdateIntervalForType(SensorTypes.barometer, 500);

export const App = () => {
  const [data, setData] = useState<SensorData | null>(null);
  const webViewRef = useRef<null | WebView>(null);

  const handleUpdateSensorData = (data: SensorData) => {
    const injected = `
      if (window.loadSensorData) {
        window.loadSensorData(${JSON.stringify(data)});
      }
    `;
    webViewRef.current?.injectJavaScript(injected);
  }

  useEffect(() => {
    const sensors$ = combineLatest([gyroscope, accelerometer, magnetometer, barometer]).pipe(debounceTime(0));
    const subscription = sensors$.subscribe(([
      gyroscopeSensor, 
      accelerometerSensor, 
      magnetometerSensor, 
      barometerSensor,
    ]: [CoordinateSensorData, CoordinateSensorData, CoordinateSensorData, BarometerSensorData]) => {
      const data: SensorData = {
        gyroscope: gyroscopeSensor,
        accelerometer: accelerometerSensor,
        magnetometer: magnetometerSensor,
        barometer: barometerSensor,
      }
      handleUpdateSensorData(data);
      setData(data);
    });

    return () => {
      subscription.unsubscribe();
    }
  }, []);

  return (
    <>
      <SafeAreaView
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <WebView
          ref={webViewRef}
          source={{ uri: 'http://192.168.1.28:4200' }}
        />
      </SafeAreaView>
    </>
  );
};

export default App;
