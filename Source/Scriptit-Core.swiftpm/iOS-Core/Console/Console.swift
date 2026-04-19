//=============================================//

import UIKit
import WebKit

//=============================================//

/** Class that manages messages from the console module. */
class ConsoleMessageManager: JavascriptMessageManager
{
  enum Errors: String
  {
    case invalidMessageBody = "Console Error: Invalid message body."
    case commandNotProvided = "Console Error: Command not provided."
    case invalidCommand = "Console Error: Invalid command."
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
      case "toggle":
        TinyConsole.toggleWindowMode();
      default:
        let error = self.errors.invalidCommand.rawValue + " (\(command)).";
        print(error);
    }
  }
}

//=============================================//