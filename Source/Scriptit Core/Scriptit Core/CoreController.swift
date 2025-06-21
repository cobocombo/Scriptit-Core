//=======================================================//

import UIKit
import WebKit

//=======================================================//

class CoreController: UIViewController, WKScriptMessageHandler
{
  var webView: WKWebView!
  var router: JavascriptMessageRouter!
  
  override func viewDidLoad()
  {
    super.viewDidLoad();
    
    let overrideConsole = """
    function log(emoji, type, args) {
      window.webkit.messageHandlers.consoleMessageHandler.postMessage(
        `${emoji} JS ${type}: ${Object.values(args)
          .map(v => typeof(v) === "undefined" ? "undefined" : typeof(v) === "object" ? JSON.stringify(v) : v.toString())
          .map(v => v.substring(0, 3000)) // Limit msg to 3000 chars
          .join(", ")}`
      )
    }

    let originalLog = console.log
    let originalWarn = console.warn
    let originalError = console.error
    let originalDebug = console.debug

    console.log = function() { log("📗", "log", arguments); originalLog.apply(null, arguments) }
    console.warn = function() { log("📙", "warning", arguments); originalWarn.apply(null, arguments) }
    console.error = function() { log("📕", "error", arguments); originalError.apply(null, arguments) }
    console.debug = function() { log("📘", "debug", arguments); originalDebug.apply(null, arguments) }

    window.addEventListener("error", function(e) {
       log("💥", "Uncaught", [`${e.message} at ${e.filename}:${e.lineno}:${e.colno}`])
    })
    """;
    let logUserScript = WKUserScript(source: overrideConsole, injectionTime: .atDocumentStart, forMainFrameOnly: false)
    
    self.router = JavascriptMessageRouter();
    self.router.registerHandler(ConsoleMessageHandler(), forMessageName: "consoleMessageHandler");
    
    let preferences = WKPreferences();
    preferences.setValue(true, forKey: "developerExtrasEnabled");
    
    let userContentController = WKUserContentController();
    
    userContentController.addUserScript(logUserScript)
    userContentController.add(self, name: "consoleMessageHandler");
    
    let webViewConfiguration = WKWebViewConfiguration();
    webViewConfiguration.preferences = preferences;
    webViewConfiguration.userContentController = userContentController;
    
    self.webView = WKWebView(frame: view.bounds, configuration: webViewConfiguration);
    self.webView.autoresizingMask = [ .flexibleWidth, .flexibleHeight];
    
    if let htmlPath = Bundle.main.path(forResource: "app", ofType: "html")
    {
      let fileURL = URL(fileURLWithPath: htmlPath);
      let fileDirectory = fileURL.deletingLastPathComponent();
      self.webView.loadFileURL(fileURL, allowingReadAccessTo: fileDirectory);
      self.view.addSubview(self.webView);
    }
  }
  
  func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage)
  {
    self.router.routeMessage(message, webView: self.webView);
  }
}

//=======================================================//

protocol JavascriptMessageHandler
{
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
}

//=======================================================//

class JavascriptMessageRouter
{
  private var handlers: [String: JavascriptMessageHandler] = [:]
  
  func registerHandler(_ handler: JavascriptMessageHandler, forMessageName name: String)
  {
    handlers[name] = handler;
  }
  
  func routeMessage(_ message: WKScriptMessage, webView: WKWebView )
  {
    if let handler = handlers[message.name]
    {
      handler.handleMessage(message, webView: webView);
    }
    else
    {
      print("No handler found for message: \(message.name)");
    }
  }
}

//=======================================================//

class ConsoleMessageHandler: JavascriptMessageHandler
{
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
  {
    if let messageBody = message.body as? String
    {
      print(messageBody);
    }
  }
}

//=======================================================//
