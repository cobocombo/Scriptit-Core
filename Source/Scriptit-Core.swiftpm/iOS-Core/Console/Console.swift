//=============================================//

import UIKit
import WebKit

//=============================================//

/** Class that manages messages from the console module. */
class ConsoleMessageManager: JavascriptMessageManager
{
  /** Method to handle messages for the console module. */
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
  {
    if let messageBody = message.body as? String 
    { 
      print(messageBody);
      TinyConsole.print(messageBody);
    }
  }
}

//=============================================//