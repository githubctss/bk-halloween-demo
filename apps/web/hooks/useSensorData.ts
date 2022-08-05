import { useLayoutEffect, useState } from 'react';
import { SensorData } from '@bk/entities';

export const useSensorData = () => {
  const [data, setData] = useState<SensorData>(null);

  useLayoutEffect(() => {
    window.loadSensorData = loadSensorData;
  }, []);

  function loadSensorData(data: SensorData) {
    setData(data);
  }

  return data;
}