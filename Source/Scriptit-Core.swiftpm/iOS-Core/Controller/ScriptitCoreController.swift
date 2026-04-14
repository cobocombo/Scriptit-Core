//=======================================================//
// CORE VERSION: 2.0
// RELEASE DATE: 4/13/26
//=======================================================//

import UIKit
import WebKit

//=======================================================//

/** Class representing the main scriptit core controller object that manages the main webview of the app. */
class ScriptitCoreController: UIViewController, WKScriptMessageHandler
{
  var webView: WKWebView!
  var router: JavascriptMessageRouter!
  
  /** Method called when the main view is loaded in the controller. */
  override func viewDidLoad()
  {
    super.viewDidLoad();
    
    let filesMessageManager = FilesMessageManager();
    filesMessageManager.presentingController = self;
    filesMessageManager.webView = self.webView;
    
    self.router = JavascriptMessageRouter();
    self.router.registerHandler(ConsoleMessageManager(), forMessageName: "consoleMessageManager");
    self.router.registerHandler(BrowserMessageManager(), forMessageName: "browserMessageManager");
    self.router.registerHandler(DeviceMessageManager(), forMessageName: "deviceMessageManager");
    self.router.registerHandler(filesMessageManager, forMessageName: "filesMessageManager");
    self.router.registerHandler(HudMessageManager(), forMessageName: "hudMessageManager");
    
    let preferences = WKPreferences();
    preferences.setValue(true, forKey: "developerExtrasEnabled");
    preferences.setValue(true, forKey: "allowFileAccessFromFileURLs");
    
    let userContentController = WKUserContentController();
    userContentController.add(self, name: "consoleMessageManager");
    userContentController.add(self, name: "browserMessageManager");
    userContentController.add(self, name: "deviceMessageManager");
    userContentController.add(self, name: "filesMessageManager");
    userContentController.add(self, name: "hudMessageManager");
    
    let webViewConfiguration = WKWebViewConfiguration();
    webViewConfiguration.preferences = preferences;
    webViewConfiguration.allowsInlineMediaPlayback = true;
    webViewConfiguration.mediaTypesRequiringUserActionForPlayback = [];
    webViewConfiguration.userContentController = userContentController;
    
    self.webView = WKWebView(frame: view.bounds, configuration: webViewConfiguration);
    self.webView.autoresizingMask = [ .flexibleWidth, .flexibleHeight];
    
    if let htmlPath = Bundle.main.path(forResource: "main", ofType: "html")
    {
      let fileURL = URL(fileURLWithPath: htmlPath);
      let fileDirectory = fileURL.deletingLastPathComponent();
      self.webView.loadFileURL(fileURL, allowingReadAccessTo: fileDirectory);
      self.view.addSubview(self.webView);
    }
  }
  
  /** Method called when a message is recieved from the webview and routes it to the correct message manager. */
  func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage)
  {
    self.router.routeMessage(message, webView: self.webView);
  }
}

//=======================================================//