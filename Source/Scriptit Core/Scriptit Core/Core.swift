//=======================================================//

import UIKit
import WebKit
import SafariServices

//=======================================================//

class ScriptitCoreController: UIViewController, WKScriptMessageHandler
{
  var webView: WKWebView!
  var router: JavascriptMessageRouter!
  
  override func viewDidLoad()
  {
    super.viewDidLoad();
    
    self.router = JavascriptMessageRouter();
    self.router.registerHandler(ConsoleMessageManager(), forMessageName: "consoleMessageManager");
    self.router.registerHandler(BrowserMessageManager(), forMessageName: "browserMessageManager");
    
    let preferences = WKPreferences();
    preferences.setValue(true, forKey: "developerExtrasEnabled");
    
    let userContentController = WKUserContentController();
    userContentController.add(self, name: "consoleMessageManager");
    userContentController.add(self, name: "browserMessageManager");
    
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

protocol JavascriptMessageManager
{
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
}

//=======================================================//

class JavascriptMessageRouter
{
  private var handlers: [String: JavascriptMessageManager] = [:]
  
  func registerHandler(_ handler: JavascriptMessageManager, forMessageName name: String)
  {
    handlers[name] = handler;
  }
  
  func routeMessage(_ message: WKScriptMessage, webView: WKWebView )
  {
    if let handler = handlers[message.name] { handler.handleMessage(message, webView: webView); }
    else { print("No handler found for message: \(message.name)"); }
  }
}

//=======================================================//

class ConsoleMessageManager: JavascriptMessageManager
{
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
  {
    if let messageBody = message.body as? String { print(messageBody); }
  }
}

//=======================================================//

class BrowserMessageManager: NSObject, JavascriptMessageManager
{
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
  {
    let dict = message.body as? [String: Any];
    let urlString = (dict?["url"] as? String)!;
    let url = URL(string: urlString);
    
    let inApp = dict?["inApp"] as? Bool ?? false;
    let animated = dict?["animated"] as? Bool ?? true;
    
    let rootViewController = (UIApplication.shared.connectedScenes.first { $0.activationState == .foregroundActive } as? UIWindowScene)?.keyWindow?.rootViewController
    
    if(inApp == true)
    {
      let safariVC = SFSafariViewController(url: url!);
      safariVC.modalPresentationStyle = .overFullScreen;
      rootViewController?.present(safariVC, animated: animated, completion: nil);
    }
    else { UIApplication.shared.open(url!, options: [:], completionHandler: nil); }
  }
}

//=======================================================//
