import UIKit
import WebKit

class CoreController: UIViewController
{
  override func viewDidLoad()
  {
    super.viewDidLoad();
    
    let userContentController = WKUserContentController();
    
    let webViewConfig = WKWebViewConfiguration();
    webViewConfig.userContentController = userContentController;
    
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
}
