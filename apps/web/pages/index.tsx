import React from 'react';
import { useSensorData } from '@appWeb/hooks/useSensorData';

export function Index() {
  const sensorData = useSensorData();

  return (
    <>
      <div>
        <h1>Gyroscope Data</h1>
        {!!sensorData?.gyroscope && (
          <>
            <div>X: { sensorData.gyroscope.x }</div>
            <div>Y: { sensorData.gyroscope.y }</div>
            <div>Z: { sensorData.gyroscope.z }</div>
            <div>Timestamp: { sensorData.gyroscope.timestamp }</div>
          </>
        )}
      </div>
      <div>
        <h1>Accelerometer Data</h1>
        {!!sensorData?.accelerometer && (
          <>
            <div>X: { sensorData.accelerometer.x }</div>
            <div>Y: { sensorData.accelerometer.y }</div>
            <div>Z: { sensorData.accelerometer.z }</div>
            <div>Timestamp: { sensorData.accelerometer.timestamp }</div>
          </>
        )}
      </div>
      <div>
        <h1>Magnetometer Data</h1>
        {!!sensorData?.magnetometer && (
          <>
            <div>X: { sensorData.magnetometer.x }</div>
            <div>Y: { sensorData.magnetometer.y }</div>
            <div>Z: { sensorData.magnetometer.z }</div>
            <div>Timestamp: { sensorData.magnetometer.timestamp }</div>
          </>
        )}
      </div>
    </>
  );
}

export default Index;
