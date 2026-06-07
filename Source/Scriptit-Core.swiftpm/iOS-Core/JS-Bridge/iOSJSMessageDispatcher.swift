//=======================================================//

import UIKit
import WebKit

//=======================================================//

/** Class representing the */
class iOSJavascriptMessageDispatcher
{
  enum DispatchSuccessTypes
  {
    case string
    case json
  }

  let dispatchSuccessTypes = DispatchSuccessTypes.self;

  /** Public method to send a failure message from Swift back to JavaScript. */
  func dispatchFailure(error: String, jsCallback: String, webView: WKWebView, requestId: Int? = nil)
  {
    var jsProps = "error: '\(self.escapeForJavaScript(error))'";
    if let id = requestId { jsProps = "requestId: \(id), " + jsProps; }
    let js = "files.\(jsCallback)({ \(jsProps) });";
  
    DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil); }
  }

  /** Public method to send a success message from Swift back to JavaScript based on dispatch type. */
  func dispatchSuccess(data: String, jsCallback: String, webView: WKWebView, requestId: Int? = nil, dispatchSuccessType: DispatchSuccessTypes)
  {
    var jsProps: String
    switch dispatchSuccessType 
    {
      case .string:
        jsProps = "data: '\(self.escapeForJavaScript(data))'"
      case .json:
        jsProps = "data: \(data)"
    }

    if let id = requestId 
    {
      jsProps = "requestId: \(id), " + jsProps
    }

    let js = "files.\(jsCallback)({ \(jsProps) });"
    DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil) }
  }

  /** Public method to escape special characters in a Swift string for safe injection into JavaScript. */
  func escapeForJavaScript(_ value: String) -> String
  {
    return value
      .replacingOccurrences(of: "\\", with: "\\\\")
      .replacingOccurrences(of: "'", with: "\\'")
      .replacingOccurrences(of: "\n", with: "\\n")
      .replacingOccurrences(of: "\r", with: "\\r");
  }
}

//=======================================================//