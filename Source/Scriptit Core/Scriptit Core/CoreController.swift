import UIKit
import WebKit

class CoreController: UIViewController, WKScriptMessageHandler
{
  override func viewDidLoad()
  {
    super.viewDidLoad();
    
    let userContentController = WKUserContentController();
    
    let overrideConsole = """
    function log(emoji, type, args) {
      window.webkit.messageHandlers.logging.postMessage(
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
    """
    
    let logUserScript = WKUserScript(source: overrideConsole, injectionTime: .atDocumentStart, forMainFrameOnly: false)
    userContentController.addUserScript(logUserScript)
    userContentController.add(self, name: "logging")
    
    let preferences = WKPreferences()
    preferences.setValue(true, forKey: "developerExtrasEnabled")
    
    let webViewConfig = WKWebViewConfiguration();
    webViewConfig.userContentController = userContentController;
    webViewConfig.preferences = preferences
    
    let webView = WKWebView(frame: view.bounds, configuration: webViewConfig);
    webView.autoresizingMask = [ .flexibleWidth, .flexibleHeight];
    
    if let htmlPath = Bundle.main.path(forResource: "app", ofType: "html")
    {
      let fileURL = URL(fileURLWithPath: htmlPath);
      let fileDirectory = fileURL.deletingLastPathComponent();
      webView.loadFileURL(fileURL, allowingReadAccessTo: fileDirectory);
      self.view.addSubview(webView);
    }
  }
  
  func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage)
  {
    print(message.body)
  }
}
