//=============================================//

import UIKit
import WebKit
import ProgressHUD

//=============================================//

/** Class that manages messages for the hud module. */
class HudMessageManager: JavascriptMessageManager
{
  enum Errors: String
  {
    case invalidMessageBody = "HUD Error: Invalid message body."
    case commandNotProvided = "HUD Error: Command not provided."
    case invalidCommand = "HUD Error: Invalid command."
    case invalidMessage = "HUD Error: Invalid message."
    case invalidTimeout = "HUD Error: Invalid timeout value."
  }
  
  let errors = Errors.self;

  /**
   * Entry point for all JavaScript messages targeting the HUD module.
   *
   * This method validates the incoming message payload, extracts the
   * required command and optional parameters, and routes execution
   * to the appropriate HUD action.
   *
   * Invalid input or unsupported commands are logged using standardized
   * error messages and do not crash the application.
   *
   * Expected JavaScript input (dict):
   * - command (String): HUD command ("added", "failed", "loading", "succeed", "dismiss")
   * - message (String, optional): HUD display text
   * - timeout (Double, optional): Delay before auto-dismiss
   *
   * @param message The WKScriptMessage sent from JavaScript.
   * @param webView The WKWebView instance associated with the message.
   */
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
  {
    if let windowScene = UIApplication.shared.connectedScenes
      .compactMap({ $0 as? UIWindowScene })
      .first,
       let window = windowScene.windows.first(where: { $0.isKeyWindow })
    {
      window.overrideUserInterfaceStyle = .light
    }
    
    guard let dict = message.body as? [String: Any] else
    {
      let error = self.errors.invalidMessageBody.rawValue;
      print(error);
      return;
    }

    guard let command = dict["command"] as? String else
    {
      let error = self.errors.commandNotProvided.rawValue;
      print(error);
      return;
    }

    let hudMessage = dict["message"] as? String;
    let timeoutValue = dict["timeout"];

    var delay: Double = 0;
    if let timeout = timeoutValue
    {
      guard let parsedDelay = timeout as? Double else
      {
        let error = self.errors.invalidTimeout.rawValue;
        print(error);
        return;
      }
      delay = parsedDelay;
    }

    switch command
    {
      case "added":
        self.handleAdded(message: hudMessage, delay: delay)
      case "failed":
        self.handleFailed(message: hudMessage, delay: delay)
      case "loading":
        self.handleLoading(message: hudMessage)
      case "succeed":
        self.handleSucceed(message: hudMessage, delay: delay)
      case "dismiss":
        ProgressHUD.dismiss()
      default:
        let error = self.errors.invalidCommand.rawValue + " (\(command)).";
        print(error);
    }
  }

  /**
   * Displays a success-style HUD indicating an item was added.
   *
   * If a message is provided, it is displayed to the user.
   * If a delay is greater than zero, the HUD auto-dismisses after the delay.
   *
   * @param message Optional text to display in the HUD.
   * @param delay Optional delay before dismissal.
   */
  func handleAdded(message: String?, delay: Double)
  {
    if let msg = message { delay > 0 ? ProgressHUD.added(msg, delay: delay) : ProgressHUD.added(msg); }
    else { delay > 0 ? ProgressHUD.added(delay: delay) : ProgressHUD.added(); }
  }

  /**
   * Displays an error-style HUD indicating a failure occurred.
   *
   * If a message is provided, it is displayed to the user.
   * If a delay is greater than zero, the HUD auto-dismisses after the delay.
   *
   * @param message Optional text to display in the HUD.
   * @param delay Optional delay before dismissal.
   */
  func handleFailed(message: String?, delay: Double)
  {
    if let msg = message { delay > 0 ? ProgressHUD.failed(msg, delay: delay) : ProgressHUD.failed(msg); }
    else { delay > 0 ? ProgressHUD.failed(delay: delay) : ProgressHUD.failed(); }
  }

  /**
   * Displays a loading or indeterminate-progress HUD.
   *
   * If a message is provided, it is displayed alongside the animation.
   *
   * @param message Optional loading text to display.
   */
  func handleLoading(message: String?)
  {
    if let msg = message { ProgressHUD.animate(msg); }
    else { ProgressHUD.animate(); }
  }

  /**
   * Displays a success-style HUD indicating a successful operation.
   *
   * If a message is provided, it is displayed to the user.
   * If a delay is greater than zero, the HUD auto-dismisses after the delay.
   *
   * @param message Optional text to display in the HUD.
   * @param delay Optional delay before dismissal.
   */
  func handleSucceed(message: String?, delay: Double)
  {
    if let msg = message { delay > 0 ? ProgressHUD.succeed(msg, delay: delay) : ProgressHUD.succeed(msg); }
    else { delay > 0 ? ProgressHUD.succeed(delay: delay) : ProgressHUD.succeed(); }
  }
}

//=======================================================//