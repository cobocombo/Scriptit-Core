//=============================================//

import UIKit
import WebKit

//=============================================//

/** Class that manages messages the device module. */
class DeviceMessageManager: JavascriptMessageManager
{
  /** Method to handle messages for the device module. */
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
  {
    UIDevice.current.isBatteryMonitoringEnabled = true;
    
    let systemName = UIDevice.current.systemName;
    let systemVersion = UIDevice.current.systemVersion;
    let batteryLevel = UIDevice.current.batteryLevel;
    
    let batteryState: String;
    switch UIDevice.current.batteryState
    {
      case .charging: batteryState = "charging"
      case .full: batteryState = "full"
      case .unplugged: batteryState = "unplugged"
      case .unknown: fallthrough
      @unknown default: batteryState = "unknown"
    }
    
    let interfaceStyle: String;
    if #available(iOS 12.0, *)
    {
      let style = UIScreen.main.traitCollection.userInterfaceStyle;
      switch style
      {
        case .dark: interfaceStyle = "dark"
        case .light: interfaceStyle = "light"
        default: interfaceStyle = "unspecified"
      }
    }
    else { interfaceStyle = "unspecified" }

    let deviceInfo: [String: Any] = [
      "systemName": systemName,
      "systemVersion": systemVersion,
      "batteryLevel": batteryLevel,
      "batteryState": batteryState,
      "interfaceStyle": interfaceStyle
    ]

    if let jsonData = try? JSONSerialization.data(withJSONObject: deviceInfo, options: []),
       let jsonString = String(data: jsonData, encoding: .utf8)
      {
        let jsCallback = "device.receive(\(jsonString));"
        webView.evaluateJavaScript(jsCallback, completionHandler: nil)
      }
  }
}

//=============================================//