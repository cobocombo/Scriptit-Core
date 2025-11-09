//=======================================================//
// CORE VERSION: 1.4
// RELEASE DATE: 11/5/25
//=======================================================//

import UIKit
import WebKit
import SafariServices
import Files

//=======================================================//
// MAIN CORE CONTROLLER
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
    self.router.registerHandler(DeviceMessageManager(), forMessageName: "deviceMessageManager");
    self.router.registerHandler(FilesMessageManager(), forMessageName: "filesMessageManager");
    
    let preferences = WKPreferences();
    preferences.setValue(true, forKey: "developerExtrasEnabled");
    preferences.setValue(true, forKey: "allowFileAccessFromFileURLs");
    
    let userContentController = WKUserContentController();
    userContentController.add(self, name: "consoleMessageManager");
    userContentController.add(self, name: "browserMessageManager");
    userContentController.add(self, name: "deviceMessageManager");
    userContentController.add(self, name: "filesMessageManager");
    
    let webViewConfiguration = WKWebViewConfiguration();
    webViewConfiguration.preferences = preferences;
    webViewConfiguration.allowsInlineMediaPlayback = true;
    webViewConfiguration.mediaTypesRequiringUserActionForPlayback = [];
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
// MESSAGE MANAGER / ROUTER
//=======================================================//

protocol JavascriptMessageManager
{
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
}

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
// MESSAGE MANAGERS
//=======================================================//

class ConsoleMessageManager: JavascriptMessageManager
{
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
  {
    if let messageBody = message.body as? String { print(messageBody); }
  }
}

//=============================================//

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

//=============================================//

class DeviceMessageManager: JavascriptMessageManager
{
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
  {
    UIDevice.current.isBatteryMonitoringEnabled = true;
    
    let systemName = UIDevice.current.systemName;
    let systemVersion = UIDevice.current.systemVersion;
    let batteryLevel = UIDevice.current.batteryLevel;
    
    let batteryState: String;
    switch UIDevice.current.batteryState
    {
      case .charging: batteryState = "charging"
      case .full: batteryState = "full"
      case .unplugged: batteryState = "unplugged"
      case .unknown: fallthrough
      @unknown default: batteryState = "unknown"
    }
    
    let interfaceStyle: String;
    if #available(iOS 12.0, *)
    {
      let style = UIScreen.main.traitCollection.userInterfaceStyle;
      switch style
      {
        case .dark: interfaceStyle = "dark"
        case .light: interfaceStyle = "light"
        default: interfaceStyle = "unspecified"
      }
    }
    else { interfaceStyle = "unspecified" }

    let deviceInfo: [String: Any] = [
      "systemName": systemName,
      "systemVersion": systemVersion,
      "batteryLevel": batteryLevel,
      "batteryState": batteryState,
      "interfaceStyle": interfaceStyle
    ]

    if let jsonData = try? JSONSerialization.data(withJSONObject: deviceInfo, options: []),
       let jsonString = String(data: jsonData, encoding: .utf8)
      {
        let jsCallback = "device.receive(\(jsonString));"
        webView.evaluateJavaScript(jsCallback, completionHandler: nil)
      }
  }
}

//=============================================//

class FilesMessageManager: JavascriptMessageManager
{
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView) 
  {    
    let dict = message.body as? [String: Any];
    let command = dict!["command"] as? String;
    switch command 
    {
      case "createFolder":
        let folderName = dict!["folderName"] as? String;
        self.createFolder(dict: dict!, webView: webView, folderName: folderName!);
      case "deleteFolder":
        self.deleteFolder(dict: dict!, webView: webView);
      case "getFolder":
        self.getFolder(dict: dict!, webView: webView);
      case "renameFolder":
        let folderName = dict!["folderName"] as? String;
        self.renameFolder(dict: dict!, webView: webView, folderName: folderName!);
      default:
        print("FilesMessageManager Error: Unknown command '\(command!)'");
    }
  }
  
  func createFolder(dict: [String: Any], webView: WKWebView, folderName: String)
  {
    let root = dict["root"] as? String;
    let subpath = dict["subpath"] as? String;
    let base: Folder?;
    
    switch root 
    {
      case "Documents": base = Folder.documents;
      case "Library": base = Folder.library;
      case "tmp": base = Folder.temporary;
      default: base = nil
    }
    
    let validBase = base;
    let targetPath = subpath!.isEmpty ? validBase!.path : validBase!.path + subpath!;
  
    do 
    {
      let targetFolder = try Folder(path: targetPath);
      var uniqueName = folderName;
      var counter = 1;
  
      while targetFolder.containsSubfolder(named: uniqueName) 
      {
        uniqueName = "\(folderName)(\(counter))";
        counter += 1;
      }
      
      let createdFolder = try targetFolder.createSubfolder(named: uniqueName);
      let folderInfo = serializeFolder(createdFolder, relativeTo: validBase!.path);

      if let jsonData = try? JSONSerialization.data(withJSONObject: folderInfo), let jsonString = String(data: jsonData, encoding: .utf8)
      {
        let escaped = jsonString
          .replacingOccurrences(of: "\\", with: "\\\\")
          .replacingOccurrences(of: "'", with: "\\'")
          .replacingOccurrences(of: "\n", with: "\\n")
          .replacingOccurrences(of: "\r", with: "\\r");

        let js = "files._createdFolderFound(JSON.parse('\(escaped)'));";
        DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil); }
      }
    }
    catch 
    {
      print("❌ FilesMessageManager Error: Failed to create folder at \(targetPath): \(error)");
      let js = "files._createdFolderNotFound(null);"
      DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil); }
    }
  }
  
  func deleteFolder(dict: [String: Any], webView: WKWebView)
  {
    let root = dict["root"] as? String;
    let subpath = dict["subpath"] as? String;
    let base: Folder?;
    
    switch root 
    {
      case "Documents": base = Folder.documents;
      case "Library": base = Folder.library;
      case "tmp": base = Folder.temporary;
      default: base = nil
    }
    
    let validBase = base;
    let targetPath = subpath!.isEmpty ? validBase!.path : validBase!.path + subpath!;
    
    do 
    {
      let targetFolder = try! Folder(path: targetPath);
      try targetFolder.delete();
      let js = "files._folderDeleted();";
      DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil); } 
    }
    catch 
    {
      print("❌ FilesMessageManager Error: Failed to rename folder at \(targetPath): \(error)");
      let js = "files._folderNotDeleted(null);"
      DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil); }
    }
  }
  
  func getFolder(dict: [String: Any], webView: WKWebView)
  {
    let root = dict["root"] as? String;
    let subpath = dict["subpath"] as? String;
    let base: Folder?;
    
    switch root 
    {
      case "Documents": base = Folder.documents;
      case "Library": base = Folder.library;
      case "tmp": base = Folder.temporary;
      default: base = nil
    }
    
    let validBase = base;
    let targetPath = subpath!.isEmpty ? validBase!.path : validBase!.path + subpath!;
    
    do 
    {
      let resolvedFolder = try Folder(path: targetPath);
      let folderInfo = serializeFolder(resolvedFolder, relativeTo: validBase!.path);
      if let jsonData = try? JSONSerialization.data(withJSONObject: folderInfo), let jsonString = String(data: jsonData, encoding: .utf8) 
      {
        let escaped = jsonString
          .replacingOccurrences(of: "\\", with: "\\\\")
          .replacingOccurrences(of: "'", with: "\\'")
          .replacingOccurrences(of: "\n", with: "\\n")
          .replacingOccurrences(of: "\r", with: "\\r");
        let js = "files._folderFound(JSON.parse('\(escaped)'));";
        DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil); }
      }
    } 
    catch 
    {
      print("FilesMessageManager Error: Folder not found at \(targetPath)");
      let js = "files._folderNotFound(null);";
      DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil); }
    }
  }
  
  func renameFolder(dict: [String: Any], webView: WKWebView, folderName: String)
  {
    let root = dict["root"] as? String;
    let subpath = dict["subpath"] as? String;
    let base: Folder?;
    
    switch root 
    {
      case "Documents": base = Folder.documents;
      case "Library": base = Folder.library;
      case "tmp": base = Folder.temporary;
      default: base = nil
    }
    
    let validBase = base;
    let targetPath = subpath!.isEmpty ? validBase!.path : validBase!.path + subpath!;
    
    do 
    {
      let targetFolder = try! Folder(path: targetPath);
      let parentFolder = targetFolder.parent;
      var uniqueName = folderName;
      var counter = 1;
      while parentFolder!.containsSubfolder(named: uniqueName) 
      {
        uniqueName = "\(folderName)(\(counter))";
        counter += 1;
      }
      
      let oldPath = targetFolder.path;
      let newPath = parentFolder!.path + uniqueName + "/";
      try FileManager.default.moveItem(atPath: oldPath, toPath: newPath);
      let renamedFolder = try Folder(path: parentFolder!.path + uniqueName + "/");
      let folderInfo = serializeFolder(renamedFolder, relativeTo: validBase!.path);
      
      if let jsonData = try? JSONSerialization.data(withJSONObject: folderInfo), let jsonString = String(data: jsonData, encoding: .utf8)
      {
        let escaped = jsonString
          .replacingOccurrences(of: "\\", with: "\\\\")
          .replacingOccurrences(of: "'", with: "\\'")
          .replacingOccurrences(of: "\n", with: "\\n")
          .replacingOccurrences(of: "\r", with: "\\r");

        let js = "files._renamedFolderFound(JSON.parse('\(escaped)'));";
        DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil); }
      } 
    }
    catch 
    {
      print("❌ FilesMessageManager Error: Failed to rename folder at \(targetPath): \(error)");
      let js = "files._renamedFolderNotFound(null);"
      DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil); }
    }
  }
  
  func serializeFolder(_ folder: Folder, relativeTo rootPath: String) -> [String: Any] 
  {
    func normalizedRootName(from path: String) -> String 
    {
      if path.contains("/Documents") { return "Documents" }
      if path.contains("/Library") { return "Library" }
      if path.contains("/tmp") { return "tmp" }
      return "Unknown"
    }
    
    let normalizedRoot = normalizedRootName(from: rootPath);
    
    let relativePath: String;
    if folder.path.hasPrefix(rootPath) { relativePath = String(folder.path.dropFirst(rootPath.count)); } 
    else { relativePath = folder.path; }
  
    var folderInfo: [String: Any] = [
      "name": folder.name,
      "relativePath": relativePath,
      "root": normalizedRoot
    ];
  
    if let parent = folder.parent 
    {
      let parentRelativePath: String;
      if parent.path.hasPrefix(rootPath) { parentRelativePath = String(parent.path.dropFirst(rootPath.count)); }
      else { parentRelativePath = "none"; }
      folderInfo["parentFolder"] = [
        "name": parent.name,
        "relativePath": parentRelativePath,
        "root": normalizedRoot
      ];
    } 
    else { folderInfo["parentFolder"] = NSNull(); }
  
    let subfolderArray: [[String: Any]] = folder.subfolders.map 
    { 
      sub in
      let subRelativePath: String;
      if sub.path.hasPrefix(rootPath) { subRelativePath = String(sub.path.dropFirst(rootPath.count)); } 
      else { subRelativePath = sub.path; }
      return [
        "name": sub.name,
        "relativePath": subRelativePath,
        "root": normalizedRoot
      ]
    }
    
    folderInfo["subfolders"] = subfolderArray;
     
    let fileArray: [[String: Any]] = folder.files.map 
    { 
      file in
      let fileRelativePath: String;
      if file.path.hasPrefix(rootPath) { fileRelativePath = String(file.path.dropFirst(rootPath.count)) }
      else { fileRelativePath = file.path }
  
      var fileInfo: [String: Any] = [
        "extension": file.extension as Any,
        "name": file.name,
        "nameExcludingExtension": file.nameExcludingExtension,
        "relativePath": fileRelativePath,
        "root": normalizedRoot
      ]
  
      if let parent = file.parent 
      {
        let parentRelativePath: String;
        if parent.path.hasPrefix(rootPath) { parentRelativePath = String(parent.path.dropFirst(rootPath.count)) }
        else { parentRelativePath = parent.path }
  
        fileInfo["parentFolder"] = [
          "name": parent.name,
          "relativePath": parentRelativePath,
          "root": normalizedRoot
        ]
      } 
      else { fileInfo["parentFolder"] = NSNull(); }
      return fileInfo
    }
    
    folderInfo["files"] = fileArray;
  
    return folderInfo
  }
  
  func createTestFiles() 
  {
    do 
    {
      let docs = Folder.documents;
      let inputFile = try docs!.createFileIfNeeded(withName: "input.txt");
      let outputFile = try docs!.createFileIfNeeded(withName: "output.txt");
      try inputFile.write("This is a test input file created by FilesMessageManager.");
      try outputFile.write("This is a test output file created by FilesMessageManager.");
    } 
    catch 
    {
      print("❌ FilesMessageManager Error: Failed to create test files: \(error)")
    }
  }
}

//=======================================================//
