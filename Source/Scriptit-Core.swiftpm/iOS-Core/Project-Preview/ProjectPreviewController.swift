//=======================================================//
// PROJECT PREVIEW CONTROLLER
//=======================================================//

import UIKit
import WebKit

//=======================================================//

class ProjectPreviewController: UIViewController, WKScriptMessageHandler
{
  var webView: WKWebView!;
  var router: JavascriptMessageRouter!;
  var project: String = "";
  
  override func viewDidLoad()
  {
    super.viewDidLoad()
    
    let filesMessageManager = FilesMessageManager();
    filesMessageManager.presentingController = self;
    
    self.router = JavascriptMessageRouter()
    self.router.registerHandler(ConsoleMessageManager(), forMessageName: "consoleMessageManager")
    self.router.registerHandler(BrowserMessageManager(), forMessageName: "browserMessageManager")
    self.router.registerHandler(DeviceMessageManager(), forMessageName: "deviceMessageManager")
    self.router.registerHandler(filesMessageManager, forMessageName: "filesMessageManager")
    self.router.registerHandler(HudMessageManager(), forMessageName: "hudMessageManager")
    
    let preferences = WKPreferences()
    preferences.setValue(true, forKey: "developerExtrasEnabled")
    preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
    
    let userContentController = WKUserContentController()
    userContentController.add(self, name: "consoleMessageManager")
    userContentController.add(self, name: "browserMessageManager")
    userContentController.add(self, name: "deviceMessageManager")
    userContentController.add(self, name: "filesMessageManager")
    userContentController.add(self, name: "hudMessageManager")
    
    let config = WKWebViewConfiguration()
    config.preferences = preferences
    config.userContentController = userContentController
    config.allowsInlineMediaPlayback = true
    config.mediaTypesRequiringUserActionForPlayback = []
    
    self.webView = WKWebView(frame: self.view.bounds, configuration: config)
    self.webView.autoresizingMask = [ .flexibleWidth, .flexibleHeight ]
    
    filesMessageManager.webView = self.webView;
    self.view.addSubview(self.webView);
    self.loadProject();
  }
  
  //=======================================================//
  
  func loadProject()
  {
    guard !self.project.isEmpty else
    {
      print("❌ ProjectPreviewController: project is empty")
      return
    }
    
    let fileManager = FileManager.default;
    guard let documentsURL = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first else
    {
      print("❌ Could not access Documents directory")
      return
    }
    
    let projectURL = documentsURL
      .appendingPathComponent("Projects")
      .appendingPathComponent(self.project)
    
    let indexURL = projectURL.appendingPathComponent("index.html")
    if !fileManager.fileExists(atPath: indexURL.path)
    {
      print("❌ index.html not found at:", indexURL.path)
      return;
    }
    
    self.webView.loadFileURL(indexURL, allowingReadAccessTo: projectURL)
  }
  
  //=======================================================//
  
  func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage)
  {
    self.router.routeMessage(message, webView: self.webView)
  }
}

//=======================================================//