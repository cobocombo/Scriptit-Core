//=======================================================//

import UIKit
import WebKit

//=======================================================//

/** Class that manages previewing a users project created in Scriptit */
class ProjectPreviewController: UIViewController, WKScriptMessageHandler
{
  var webView: WKWebView!
  var router: JavascriptMessageRouter!
  var project: String = ""
  
  private let closeButton = UIButton(type: .system)
  private let titleLabel = UILabel()
  
  /** Method called when the view is loaded. */
  override func viewDidLoad()
  {
    super.viewDidLoad();
    self.view.backgroundColor = .white;
    
    let filesMessageManager = FilesMessageManager();
    filesMessageManager.presentingController = self;
    
    self.router = JavascriptMessageRouter()
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
    
    let config = WKWebViewConfiguration();
    config.preferences = preferences;
    config.userContentController = userContentController;
    config.allowsInlineMediaPlayback = true;
    config.mediaTypesRequiringUserActionForPlayback = [];
    
    self.webView = WKWebView(frame: .zero, configuration: config);
    self.webView.backgroundColor = .white;
    self.webView.translatesAutoresizingMaskIntoConstraints = false;
    
    filesMessageManager.webView = self.webView;
    
    self.view.addSubview(self.webView);
    self.view.addSubview(self.closeButton);
    self.view.addSubview(self.titleLabel)
    
    self.setupCloseButton();
    self.setupTitleLabel();
    self.setupConstraints();
    
    self.loadProject();
  }
    
  /** Method to set up the project title label. */
  private func setupTitleLabel()
  {
    self.titleLabel.text = "\(self.project) Preview";
    self.titleLabel.textColor = .black;
    self.titleLabel.font = UIFont.systemFont(ofSize: 18, weight: .medium);
    self.titleLabel.textAlignment = .center
    self.titleLabel.translatesAutoresizingMaskIntoConstraints = false
  }
  
  /** Method to setup the close button. */
  private func setupCloseButton()
  {
    let closeImage = UIImage(
      systemName: "xmark",
      withConfiguration: UIImage.SymbolConfiguration(
        pointSize: 14,
        weight: .bold
      )
    )
    
    self.closeButton.setImage(closeImage, for: .normal)
    self.closeButton.tintColor = UIColor(hex: "#FFCC00")
    self.closeButton.applyMiniStyle()
    
    self.closeButton.addTarget(
      self,
      action: #selector(self.closeTapped),
      for: .touchUpInside
    )
    
    self.closeButton.translatesAutoresizingMaskIntoConstraints = false
  }
  
  /** Method to setup constraints for the subviews. */
  private func setupConstraints()
  {
    // Close button (top-right)
    self.closeButton.topAnchor
      .constraint(equalTo: self.view.safeAreaLayoutGuide.topAnchor, constant: 8)
      .isActive = true
    
    self.view.safeAreaLayoutGuide.rightAnchor
      .constraint(equalTo: self.closeButton.rightAnchor, constant: 8)
      .isActive = true
    
    // Title label (centered, aligned with top bar)
    self.titleLabel.centerXAnchor
      .constraint(equalTo: self.view.centerXAnchor)
      .isActive = true
    
    self.titleLabel.centerYAnchor
      .constraint(equalTo: self.closeButton.centerYAnchor)
      .isActive = true
    
    // WebView (below top bar)
    self.webView.topAnchor
      .constraint(equalTo: self.closeButton.bottomAnchor, constant: 8)
      .isActive = true
    
    self.webView.leftAnchor
      .constraint(equalTo: self.view.leftAnchor)
      .isActive = true
    
    self.webView.rightAnchor
      .constraint(equalTo: self.view.rightAnchor)
      .isActive = true
    
    self.webView.bottomAnchor
      .constraint(equalTo: self.view.bottomAnchor)
      .isActive = true
  }
  
  /** Method called when the user taps the close button. */
  @objc private func closeTapped()
  {
    self.dismiss(animated: true)
  }
  
  /** Method called to load the project index.html into the webview. */
  func loadProject()
  {
    guard !self.project.isEmpty else
    {
      print("❌ ProjectPreviewController: project is empty")
      return
    }
    
    let fileManager = FileManager.default
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
      return
    }
    
    self.webView.loadFileURL(indexURL, allowingReadAccessTo: projectURL)
  }
  
  /** Method called when a message is recieved from the webview and routes it to the correct message manager. */
  func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage)
  {
    self.router.routeMessage(message, webView: self.webView)
  }
}

//=======================================================//

extension UIColor
{
  convenience init(hex: String)
  {
    var hexSanitized = hex.trimmingCharacters(in: .whitespacesAndNewlines)
    hexSanitized = hexSanitized.replacingOccurrences(of: "#", with: "")
    
    var rgb: UInt64 = 0
    Scanner(string: hexSanitized).scanHexInt64(&rgb)
    
    let r = CGFloat((rgb & 0xFF0000) >> 16) / 255.0
    let g = CGFloat((rgb & 0x00FF00) >> 8) / 255.0
    let b = CGFloat(rgb & 0x0000FF) / 255.0
    
    self.init(red: r, green: g, blue: b, alpha: 1.0)
  }
}

//=======================================================//
