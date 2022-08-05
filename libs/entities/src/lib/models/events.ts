import { CoordinateSensorData, BarometerSensorData } from './sensors';

export enum Events {
  GyroscopeData = 'GyroscopeData',
  AccelerometerData = 'AccelerometerData',
  MagnetometerData = 'MagnetometerData',
  BarometerData = 'BarometerData',
}

export interface CustomEventMap {
  [Events.GyroscopeData]: CoordinateSensorData | undefined;
  [Events.AccelerometerData]: CoordinateSensorData | undefined;
  [Events.MagnetometerData]: CoordinateSensorData | undefined;
  [Events.BarometerData]: BarometerSensorData | undefined;
}

export type CustomListener<T extends keyof CustomEventMap> = (evt: CustomEventMap[T]) => void;