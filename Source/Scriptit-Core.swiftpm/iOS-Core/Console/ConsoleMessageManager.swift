//=============================================//

import UIKit
import WebKit

//=============================================//

/** Class that manages messages from the console module. */
class ConsoleMessageManager: JavascriptMessageManager
{
  enum Errors: String
  {
    case commandNotProvided = "Console Error: Command not provided."
    case heightNotProvided = "Console Error: Height value not provided."
    case fontNotProvided = "Console Error: Font value not provided."
    case fontSizeNotProvided = "Console Error: Font size value not provided."
    case invalidCommand = "Console Error: Invalid command."
    case invalidMessageBody = "Console Error: Invalid message body."
    case messageNotProvided = "Console Error: Message not provided."
  }
  
  let errors = Errors.self;
  
  /** Method to handle messages for the console module. */
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
  {
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
    
    switch command
    {
      case "clear": self.clear();
      case "debug": self.debug(dict);
      case "error": self.error(dict);
      case "fullscreen": self.fullscreen();
      case "font": self.setFont(dict);
      case "fontSize": self.setFontSize(dict);
      case "height": self.setHeight(dict);
      case "log": self.log(dict);
      case "toggle": self.toggle();
      case "uncaught": self.uncaught(dict);
      case "warn": self.warn(dict);
      default:
        let error = self.errors.invalidCommand.rawValue + " (\(command)).";
        print(error);
    }
  }
  
  /** Private method called by handleMessage to clear TinyConsole. */
  private func clear()
  {
    TinyConsole.clear();
  }
  
  /** Private method called by handleMessage to call the debug method of TinyConsole. */
  private func debug(_ dict: [String: Any])
  {
    guard let message = self.getMessage(dict) else { return }
    TinyConsole.debug(message);
  }
  
  /** Private method called by handleMessage to call the error method of TinyConsole. */
  private func error(_ dict: [String: Any])
  {
    guard let message = self.getMessage(dict) else { return }
    TinyConsole.error(message);
  }
  
  /** Private method called by handleMessage to call the fullscreen method of TinyConsole. */
  private func fullscreen()
  {
    TinyConsole.fullscreen();
  }
  
  /** Private method to extract the message property from the dict variable passed into handleMessage. */
  private func getMessage(_ dict: [String: Any]) -> String?
  {
    guard let message = dict["message"] as? String else
    {
      print(self.errors.messageNotProvided.rawValue)
      return nil
    }
    return message
  }
  
  /** Private method called by handleMessage to call the log method of TinyConsole. */
  private func log(_ dict: [String: Any])
  {
    guard let message = self.getMessage(dict) else { return }
    TinyConsole.log(message);
  }
  
  /** Private method called by handleMessage to call the toggle method of TinyConsole. */
  private func toggle()
  {
    TinyConsole.toggleWindowMode();
  }
  
  /** Private method called by handleMessage to call the setFont method of TinyConsole. */
  private func setFont(_ dict: [String: Any])
  {
    guard let value = dict["value"] as? String else
    {
      let error = self.errors.fontNotProvided.rawValue;
      print(error);
      return;
    }
    TinyConsole.setFont(name: value);
  }
  
  /** Private method called by handleMessage to call the setFontSize method of TinyConsole. */
  private func setFontSize(_ dict: [String: Any])
  {
    guard let value = dict["value"] as? CGFloat else
    {
      let error = self.errors.fontSizeNotProvided.rawValue;
      print(error);
      return;
    }
    TinyConsole.setFontSize(value);
  }
  
  /** Private method called by handleMessage to call the setHeight method of TinyConsole. */
  private func setHeight(_ dict: [String: Any])
  {
    guard let value = dict["value"] as? CGFloat else
    {
      let error = self.errors.heightNotProvided.rawValue;
      print(error);
      return;
    }
    TinyConsole.setHeight(height: value);
  }
  
  /** Private method called by handleMessage to call the uncaught method of TinyConsole. */
  private func uncaught(_ dict: [String: Any])
  {
    guard let message = self.getMessage(dict) else { return }
    TinyConsole.uncaught(message);
  }
  
  /** Private method called by handleMessage to call the warn method of TinyConsole. */
  private func warn(_ dict: [String: Any])
  {
    guard let message = self.getMessage(dict) else { return }
    TinyConsole.warn(message);
  }
}

//=============================================//
