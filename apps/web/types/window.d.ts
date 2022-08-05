declare global {
  interface Window {
    loadSensorData: (data: any) => void;
  }
}

export {};