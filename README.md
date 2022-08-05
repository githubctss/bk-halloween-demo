# BK-Halloween mobile code snippets

## Android (Java)

Android snippet is developed using latest android sdk 32.

The sensor data is obtained and updated using the `SensorManager` from `android.hardware` which is part of the android sdk.

Application is reading accelerometer, magnetometer and gyroscope data and is sending to WebView from `​​android.webkit` which is also part of the android sdk.

Sensor data is sent to the WebView as a JSON object.

```
{
  "accelerometer": "[x, y, z]",
  "gyroscope": "[x, y, z]",
  "magnetometer": "[x, y, z]"
}
```

The application is not using any third party dependencies, everything is part of the Android API.

### Complete java implementation:

```java
package com.example.sensordatapoc;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Arrays;

public class MainActivity extends AppCompatActivity implements SensorEventListener {
  // TODO change this to production url e.q. https://example.com
  private static final String URL = "file:///android_asset/webApp.html";

  private SensorManager sensorManager;
  private Sensor accelerometer;
  private Sensor gyroscope;
  private Sensor magnetometer;
  private WebView webView;

  private String accelerometerData = "";
  private String gyroscopeData = "";
  private String magnetometerData = "";
  private String sensorData = null;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    initWebView();
    initSensors();
  }

  @SuppressLint("SetJavaScriptEnabled")
  private void initWebView() {
    webView = findViewById(R.id.webView);
    webView.loadUrl(URL);
    webView.getSettings().setJavaScriptEnabled(true);
  }

  private void passSensorData(String data) {
    webView.loadUrl(URL);
    webView.setWebViewClient(new WebViewClient() {
      @Override
      public void onPageFinished(WebView view, String url) {
        view.loadUrl("javascript:loadSensorData('" + data + "')");
      }
    });
  }

  private void initSensors() {
    sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
    accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
    gyroscope = sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE);
    magnetometer = sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD);
  }

  @Override
  public final void onSensorChanged(SensorEvent event) {
    if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
      accelerometerData = Arrays.toString(event.values);
    } else if (event.sensor.getType() == Sensor.TYPE_GYROSCOPE) {
      gyroscopeData = Arrays.toString(event.values);
    } else if (event.sensor.getType() == Sensor.TYPE_MAGNETIC_FIELD) {
      magnetometerData = Arrays.toString(event.values);
    }

    if (generateJSONSensorData().equals(sensorData)) {
      return;
    }

    sensorData = generateJSONSensorData();
    passSensorData(sensorData);
  }

  private String generateJSONSensorData() {
    String result = "";
    JSONObject json = new JSONObject();
    try {
      json.put("accelerometer", accelerometerData);
      json.put("gyroscope", gyroscopeData);
      json.put("magnetometer", magnetometerData);
      result = json.toString();
    } catch (JSONException e) {
      e.printStackTrace();
    }
    return result;
  }

  @Override
  public final void onAccuracyChanged(Sensor sensor, int accuracy) {
    // Do something here if sensor accuracy changes.
  }

  @Override
  protected void onResume() {
    super.onResume();
    sensorManager.registerListener(this, accelerometer, SensorManager.SENSOR_DELAY_NORMAL);
    sensorManager.registerListener(this, gyroscope, SensorManager.SENSOR_DELAY_NORMAL);
    sensorManager.registerListener(this, magnetometer, SensorManager.SENSOR_DELAY_NORMAL);
  }

  @Override
  protected void onPause() {
    super.onPause();
    sensorManager.unregisterListener(this);
  }
}
```

## iOS (SwiftUI)

iOS snippet is developed in Xcode using SwiftUI.

The sensor data is obtained using the `MotionManger`.

Application is reading accelerometer, magnetometer and gyroscope data and is sending to WebView.

Sensor data is sent to the WebView as a JSON object.

```
{
  "accelerometer": "[x, y, z]",
  "gyroscope": "[x, y, z]",
  "magnetometer": "[x, y, z]"
}
```

### Complete swift implementation

```swift
import Foundation

struct SensorDataModel: Encodable {
  var accelerometer: String
  var magnetometer: String
  var gyroscope: String
}
```

```swift
import Foundation
import Combine

class WebViewModel: ObservableObject {
  var valuePublisher = PassthroughSubject<String, Never>()
}

// For identifying what type of url should load into WebView
enum WebUrlType {
  case localUrl, publicUrl
}
```

```swift
import Combine
import CoreMotion
import SwiftUI

class MotionManager: ObservableObject {  
  private var motionManager: CMMotionManager
  private var accelerometerData: [Double] = [0.0, 0.0, 0.0]
  private var magnetometerData: [Double] = [0.0, 0.0, 0.0]
  private var gyroData: [Double] = [0.0, 0.0, 0.0]
  @Published var sensorDataJSON: String = "";
      
  init() {
    self.motionManager = CMMotionManager()
    updateAccelerometerData()
    updateMagnetometerData()
    updateGyroscopeData()
  }
  
  func updateAccelerometerData() {
    self.motionManager.accelerometerUpdateInterval = 1
    self.motionManager.startAccelerometerUpdates(to: .main) { (accelerometerData, error) in
      guard error == nil else {
        print(error!)
        return
      }
      
      if let aData = accelerometerData {
        self.accelerometerData[0] = aData.acceleration.x
        self.accelerometerData[1] = aData.acceleration.y
        self.accelerometerData[2] = aData.acceleration.z
      }
      self.createSensorDataJSON()
    }
  }
  
  func updateMagnetometerData() {
    self.motionManager.magnetometerUpdateInterval = 1
    self.motionManager.startMagnetometerUpdates(to: .main) { (magnetometerData, error) in
      guard error == nil else {
        print(error!)
        return
      }
      
      if let magnetData = magnetometerData {
        self.magnetometerData[0] = magnetData.magneticField.x
        self.magnetometerData[1] = magnetData.magneticField.y
        self.magnetometerData[2] = magnetData.magneticField.z
      }
      self.createSensorDataJSON()
    }
  }
  
  func updateGyroscopeData() {
    self.motionManager.gyroUpdateInterval = 1
    self.motionManager.startGyroUpdates(to: .main) { (gyroData, error) in
      guard error == nil else {
        print(error!)
        return
      }
      
      if let gData = gyroData {
        self.gyroData[0] = gData.rotationRate.x
        self.gyroData[1] = gData.rotationRate.y
        self.gyroData[2] = gData.rotationRate.z
      }
      self.createSensorDataJSON()
    }
  }
  
  private func createSensorDataJSON() {
    let sensorData = SensorDataModel(accelerometer: self.accelerometerData.description, magnetometer: self.magnetometerData.description, gyroscope: self.gyroData.description)
    do {
      let jsonData = try JSONEncoder().encode(sensorData)
      sensorDataJSON = String(data: jsonData, encoding: String.Encoding.utf8) ?? ""
    } catch {
      print(error)
    }
  }
}
```

```swift
import Foundation
import UIKit
import SwiftUI
import Combine
import WebKit

struct WebView: UIViewRepresentable {
  var urlType: WebUrlType
  var url: String
  @ObservedObject var viewModel: WebViewModel
  
  // Make a coordinator to co-ordinate with WKWebView's default delegate functions
  func makeCoordinator() -> Coordinator {
    Coordinator(self)
  }
  
  func makeUIView(context: Context) -> WKWebView {
    // Enable javascript in WKWebView
    let webView = WKWebView(frame: CGRect.zero)
    webView.navigationDelegate = context.coordinator
    return webView
  }
  
  func updateUIView(_ webView: WKWebView, context: Context) {
    if urlType == .localUrl {
      // Load local website
      if let url = Bundle.main.url(forResource: "webApp", withExtension: "html") {
        webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
      }
    } else if urlType == .publicUrl {
      // Load a public website, for example I used here google.com
      if let url = URL(string: "https://www.google.com") {
        webView.load(URLRequest(url: url))
      }
    }
  }
  
  class Coordinator : NSObject, WKNavigationDelegate {
    var parent: WebView
    var valueSubscriber: AnyCancellable? = nil
    var webViewNavigationSubscriber: AnyCancellable? = nil
    
    init(_ uiWebView: WebView) {
      self.parent = uiWebView
    }
    
    deinit {
      valueSubscriber?.cancel()
      webViewNavigationSubscriber?.cancel()
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
      /* An observer that observes 'viewModel.valuePublisher' to get value from TextField and
        pass that value to web app by calling JavaScript function */
      valueSubscriber = parent.viewModel.valuePublisher.receive(on: RunLoop.main).sink(receiveValue: { value in
        let javascriptFunction = "loadSensorData('\(value)');"
        webView.evaluateJavaScript(javascriptFunction) { (response, error) in
          if let error = error {
            print("Error calling javascript:loadSensorData()")
            print(error.localizedDescription)
          }
        }
      })
    }
  }
}
```

```swift
import SwiftUI

struct ContentView: View {
  @ObservedObject var viewModel = WebViewModel()
  @ObservedObject var motion: MotionManager = MotionManager()
  
  var body: some View {
    VStack {
      // WebView(urlType: .publicUrl, url: "https://example.com", viewModel: viewModel)
      WebView(urlType: .localUrl, url: "", viewModel: viewModel).onReceive(motion.$sensorDataJSON) { value in
        self.viewModel.valuePublisher.send(motion.sensorDataJSON)
      }
    }
  }
}
```

## React Native (iOS & Android)

React native requires `react-native-sensors` library to be installed in order to access sensor data. Also `rxjs` library is required as well to subscribe to sensor updates and emit values

### Installation

`npm install react-native-sensors rxjs --save`

> *react-native-sensors library requires further installation setup for each platform. Detailed instructions can be found at [react-native-sensors documentation](https://react-native-sensors.github.io/docs/Installation.html#installation) page.

Sensor data is sent to the WebView as a JSON object.

```
{
  "accelerometer": "[x, y, z]",
  "gyroscope": "[x, y, z]",
  "magnetometer": "[x, y, z]"
}
```

### Complete react-native implementation

```tsx
import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { 
  gyroscope,
  accelerometer,
  magnetometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import { combineLatest } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

interface CoordinateSensorData {
  x: number; 
  y: number; 
  z: number; 
  timestamp: number;
}

interface SensorData {
  [Sensors.gyroscope]: CoordinateSensorData;
  [Sensors.accelerometer]: CoordinateSensorData;
  [Sensors.magnetometer]: CoordinateSensorData;
  [Sensors.barometer]: BarometerSensorData;
}

setUpdateIntervalForType(SensorTypes.gyroscope, 500);
setUpdateIntervalForType(SensorTypes.accelerometer, 500);
setUpdateIntervalForType(SensorTypes.magnetometer, 500);

export const App = () => {
  const webViewRef = useRef<null | WebView>(null);
  const uri = 'https://example.com';

  const handleUpdateSensorData = (data: SensorData) => {
    const injected = `
      setTimeout(() => {
        window.loadSensorData(${JSON.stringify(data)});
      }, 100);
    `;
    webViewRef.current?.injectJavaScript(injected);
  }

  useEffect(() => {
    const sensors$ = combineLatest([gyroscope, accelerometer, magnetometer]).pipe(debounceTime(0));
    const subscription = sensors$.subscribe(([
      gyroscopeSensor, 
      accelerometerSensor, 
      magnetometerSensor, 
    ]: [CoordinateSensorData, CoordinateSensorData, CoordinateSensorData]) => {
      const data: SensorData = {
        gyroscope: gyroscopeSensor,
        accelerometer: accelerometerSensor,
        magnetometer: magnetometerSensor,
      }
      handleUpdateSensorData(data);
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
          source={{ uri }}
        />
      </SafeAreaView>
    </>
  );
};

export default App;
```