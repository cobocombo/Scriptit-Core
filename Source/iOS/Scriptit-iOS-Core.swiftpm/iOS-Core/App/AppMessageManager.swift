//=============================================//

import UIKit
import WebKit

//=============================================//

/** Class that manages messages from the app module. */
class AppMessageManager: JavascriptMessageManager
{
  enum Errors: String
  {
    case commandNotProvided = "App Error: Command not provided."
    case invalidCommand = "App Error: Invalid command."
    case invalidMessageBody = "App Error: Invalid message body."
    case messageNotProvided = "App Error: Message not provided."
    case requestIdNotProvided = "App Error: Request id not provided."
    case versionNotFound = "App Error: Could not retrieve app version."
  }
  
  let errors = Errors.self;
  
  /** Method to handle messages for the app module. */
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
  {
    guard let dict = message.body as? [String: Any] else
    {
      let error = self.errors.invalidMessageBody.rawValue;
      print(error);
      return;
    }
    
    guard let requestId = dict["requestId"] as? Int else
    {
      let error = self.errors.requestIdNotProvided.rawValue;
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
      case "getVersion":
        self.getVersion(webView: webView, requestId: requestId);
      
      default:
        let error = self.errors.invalidCommand.rawValue + " (\(command)).";
        print(error);
    }
  }
  
  /**
  * Public method to escape special characters in a Swift string for safe injection into JavaScript.
  *
  * This method ensures that backslashes, single quotes, and newline characters are properly escaped,
  * preventing syntax errors or unexpected behavior when the string is evaluated in a WKWebView.
  *
  * Typical use cases include sending error messages, file paths, or other dynamic strings
  * from Swift to JavaScript callbacks.
  *
  * @param value The Swift string to be escaped.
  * @return A new string with special characters escaped for JavaScript.
  */
  private func escapeForJavaScript(_ value: String) -> String
  {
    return value
      .replacingOccurrences(of: "\\", with: "\\\\")
      .replacingOccurrences(of: "'", with: "\\'")
      .replacingOccurrences(of: "\n", with: "\\n")
      .replacingOccurrences(of: "\r", with: "\\r");
  }
  
  /**
   * Public method to send a failure message from Swift back to JavaScript.
   *
   * This method constructs a JavaScript callback invocation containing an
   * error message describing why the requested operation failed. The error
   * string is escaped to ensure it can be safely injected into the evaluated
   * JavaScript code.
   *
   * An optional requestId may be included to associate the response with the
   * original asynchronous request made from JavaScript.
   *
   * The error payload is sent to the specified JavaScript failure callback
   * as an object containing the error message and optional request identifier.
   *
   * @param error A string describing the reason the operation failed.
   * @param jsCallback The name of the JavaScript failure callback function to invoke
   *                   (e.g. "_<methodName>Fail").
   * @param webView The WKWebView instance on which the JavaScript callback should be executed.
   * @param requestId An optional request identifier used to match the response with the
   *                  original JavaScript request.
   */
  private func dispatchFailure(error: String, jsCallback: String, webView: WKWebView, requestId: Int? = nil) 
  {
    var jsProps = "error: '\(self.escapeForJavaScript(error))'";
    
    if let id = requestId
    {
      jsProps = "requestId: \(id), " + jsProps;
    }
    
    let js = "app.\(jsCallback)({ \(jsProps) });";
  
    DispatchQueue.main.async
    {
      webView.evaluateJavaScript(js, completionHandler: nil);
    }
  }
  
  /**
   * Public method to send a success message from Swift back to JavaScript
   * when the payload is a plain string.
   *
   * The provided string is escaped to ensure it can be safely embedded within
   * a JavaScript string literal before being passed to the specified callback.
   * This prevents issues with characters such as quotes, backslashes, or
   * newlines that could otherwise break the injected JavaScript.
   *
   * An optional requestId may be included to associate the response with the
   * original asynchronous request made from JavaScript.
   *
   * @param data The string data to pass back to JavaScript.
   * @param jsCallback The name of the JavaScript success callback function to invoke
   *                   (e.g., "_<fileMethod>Success").
   * @param webView The WKWebView instance on which the JavaScript callback should be executed.
   * @param requestId An optional request identifier used to match the response with the
   *                  original JavaScript request.
   */
  private func dispatchSuccessString(data: String, jsCallback: String, webView: WKWebView, requestId: Int? = nil) 
  {
    var jsProps = "data: '\(self.escapeForJavaScript(data))'";
    
    if let id = requestId
    {
      jsProps = "requestId: \(id), " + jsProps;
    }
    
    let js = "app.\(jsCallback)({ \(jsProps) });";
  
    DispatchQueue.main.async
    {
      webView.evaluateJavaScript(js, completionHandler: nil);
    }
  }
  
  /** Private method called by handleMessage to get and return the app version. */
  private func getVersion(webView: WKWebView, requestId: Int)
  {
    guard let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String else
    {
      let error = self.errors.versionNotFound.rawValue;
      
      self.dispatchFailure(
        error: error,
        jsCallback: "_getVersionFail",
        webView: webView,
        requestId: requestId
      );
      
      return;
    }
    
    self.dispatchSuccessString(
      data: version,
      jsCallback: "_getVersionSuccess",
      webView: webView,
      requestId: requestId
    );
  }
}

//=============================================//