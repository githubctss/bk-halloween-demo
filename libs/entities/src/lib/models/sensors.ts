export enum Sensors {
  gyroscope = 'gyroscope',
  accelerometer = 'accelerometer',
  magnetometer = 'magnetometer',
  barometer = 'barometer',
}

export interface CoordinateSensorData {
  x: number; 
  y: number; 
  z: number; 
  timestamp: number;
}

export interface BarometerSensorData {
  pressure: number;
  timestamp: number;
}

export interface SensorData {
  [Sensors.gyroscope]: CoordinateSensorData;
  [Sensors.accelerometer]: CoordinateSensorData;
  [Sensors.magnetometer]: CoordinateSensorData;
  [Sensors.barometer]: BarometerSensorData;
}