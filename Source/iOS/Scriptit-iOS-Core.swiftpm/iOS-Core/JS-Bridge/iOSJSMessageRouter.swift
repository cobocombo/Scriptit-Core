//=======================================================//

import UIKit
import WebKit

//=======================================================//

/** Class representing the object that routes messages to the correct Javascript message manager. */
class JavascriptMessageRouter
{
  private var handlers: [String: JavascriptMessageManager] = [:]
  
  /** Method called to register a new handler for a message manager.*/
  func registerHandler(_ handler: JavascriptMessageManager, forMessageName name: String)
  {
    handlers[name] = handler;
  }
  
  /** Method to route the message to the correct Javascript message manager. */
  func routeMessage(_ message: WKScriptMessage, webView: WKWebView )
  {
    if let handler = handlers[message.name] { handler.handleMessage(message, webView: webView); }
    else { print("No handler found for message: \(message.name)"); }
  }
}

//=======================================================//