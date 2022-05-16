import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

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

export function Index() {
  const [data, setData] = useState<SensorData | null>(null);

  useEffect(() => {
    const socket = io('http://172.20.10.7:3333', {
      path: '/device/socket.io/',
      extraHeaders: {
        'my-custom-header': 'abcd',
      },
    });

    socket.on('DEVICE_SENSOR_INFO', (data) => {
      setData(data)
    });

    return () => {
      socket.off('DEVICE_SENSOR_INFO');
    }
  }, []);

  return (
    <>
      <div>
        <h1>Gyroscope Data</h1>
        {data?.gyroscope && (
          <>
            <div>X: { data.gyroscope.x }</div>
            <div>Y: { data.gyroscope.y }</div>
            <div>Z: { data.gyroscope.z }</div>
            <div>Timestamp: { data.gyroscope.timestamp }</div>
          </>
        )}
      </div>
      <div>
        <h1>Accelerometer Data</h1>
        {data?.accelerometer && (
          <>
            <div>X: { data.accelerometer.x }</div>
            <div>Y: { data.accelerometer.y }</div>
            <div>Z: { data.accelerometer.z }</div>
            <div>Timestamp: { data.accelerometer.timestamp }</div>
          </>
        )}
      </div>
      <div>
        <h1>Magnetometer Data</h1>
        {data?.magnetometer && (
          <>
            <div>X: { data.magnetometer.x }</div>
            <div>Y: { data.magnetometer.y }</div>
            <div>Z: { data.magnetometer.z }</div>
            <div>Timestamp: { data.magnetometer.timestamp }</div>
          </>
        )}
      </div>
      <div>
        <h1>Barometer Data</h1>
        {data?.barometer && (
          <>
            <div>Pressure: { data.barometer.pressure }</div>
            <div>Timestamp: { data.barometer.timestamp }</div>
          </>
        )}
      </div>
    </>
  );
}

export default Index;
