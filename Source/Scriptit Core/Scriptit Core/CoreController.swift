import UIKit
import WebKit

class CoreController: UIViewController, WKScriptMessageHandler
{
  override func viewDidLoad()
  {
    super.viewDidLoad();
    
    let userContentController = WKUserContentController();
    
    // Inject JS to capture console.log
    let consoleLogScript = """
    (function() {
      var oldLog = console.log;
      console.log = function(...args) {
        window.webkit.messageHandlers.consoleLog.postMessage(args.join(" "));
        oldLog.apply(console, args);
      };
    })();
    """
    
    // Inject JS to capture window.onerror (uncaught errors)
    let errorCaptureScript = """
    window.onerror = function(message, source, lineno, colno, error) {
      window.webkit.messageHandlers.jsError.postMessage(
        'JS Error: ' + message + ' at ' + source + ':' + lineno + ':' + colno
      );
    };
    """
    
    // Add the scripts to the controller
    let logUserScript = WKUserScript(source: consoleLogScript, injectionTime: .atDocumentStart, forMainFrameOnly: false)
    let errorUserScript = WKUserScript(source: errorCaptureScript, injectionTime: .atDocumentStart, forMainFrameOnly: false)
    
    userContentController.addUserScript(logUserScript)
    userContentController.addUserScript(errorUserScript)

    // Register handlers for messages
    userContentController.add(self, name: "consoleLog")
    userContentController.add(self, name: "jsError")
    
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
    switch message.name
    {
      case "consoleLog":
        print("JS console.log: \(message.body)")
      case "jsError":
        print("JS Error:", message.body)
      default:
        break
    }
  }
}
