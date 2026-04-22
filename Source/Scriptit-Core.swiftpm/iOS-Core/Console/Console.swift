//=============================================//

import UIKit
import WebKit

//=============================================//

/** Class that manages messages from the console module. */
class ConsoleMessageManager: JavascriptMessageManager
{
  enum Errors: String
  {
    case heightNotProvided = "Console Error: Height value not provided."
    case fontNotProvided = "Console Error: Font value not provided."
    case fontSizeNotProvided = "Console Error: Font size value not provided."
    case invalidMessageBody = "Console Error: Invalid message body."
    case commandNotProvided = "Console Error: Command not provided."
    case invalidCommand = "Console Error: Invalid command."
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
      case "clear":
        self.clear();
      case "debug":
        guard let message = dict["message"] as? String else
        {
          let error = self.errors.messageNotProvided.rawValue;
          print(error);
          return;
        }
        TinyConsole.debug(message);
      case "error":
        guard let message = dict["message"] as? String else
        {
          let error = self.errors.messageNotProvided.rawValue;
          print(error);
          return;
        }
        TinyConsole.error(message);
      case "fullscreen":
        self.fullscreen();
      case "font":
        guard let value = dict["value"] as? String else
        {
          let error = self.errors.fontNotProvided.rawValue;
          print(error);
          return;
        }
        TinyConsole.setFont(name: value);
      case "fontSize":
        guard let value = dict["value"] as? CGFloat else
        {
          let error = self.errors.fontSizeNotProvided.rawValue;
          print(error);
          return;
        }
        TinyConsole.setFontSize(value);
      case "height":
        guard let value = dict["value"] as? CGFloat else
        {
          let error = self.errors.heightNotProvided.rawValue;
          print(error);
          return;
        }
        TinyConsole.setHeight(height: value);
      case "log":
        guard let message = dict["message"] as? String else
        {
          let error = self.errors.messageNotProvided.rawValue;
          print(error);
          return;
        }
        TinyConsole.log(message);
      case "toggle":
        TinyConsole.toggleWindowMode();
      case "uncaught":
        guard let message = dict["message"] as? String else
        {
          let error = self.errors.messageNotProvided.rawValue;
          print(error);
          return;
        }
        TinyConsole.uncaught(message);
      case "warn":
        guard let message = dict["message"] as? String else
        {
          let error = self.errors.messageNotProvided.rawValue;
          print(error);
          return;
        }
        TinyConsole.warn(message);
      default:
        let error = self.errors.invalidCommand.rawValue + " (\(command)).";
        print(error);
    }
  }
  
  func clear()
  {
    TinyConsole.clear();
  }
  
  func fullscreen()
  {
    TinyConsole.fullscreen();
  }
}

//=============================================//
