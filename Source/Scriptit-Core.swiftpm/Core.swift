//=======================================================//
// CORE VERSION: 1.4
// RELEASE DATE: 11/5/25
//=======================================================//

import UIKit
import WebKit
import SafariServices
import Files
import ProgressHUD

//=======================================================//
// MAIN CORE CONTROLLER
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
    
    // Setup custom Javascript message router and register message manager classes.
    self.router = JavascriptMessageRouter();
    self.router.registerHandler(ConsoleMessageManager(), forMessageName: "consoleMessageManager");
    self.router.registerHandler(BrowserMessageManager(), forMessageName: "browserMessageManager");
    self.router.registerHandler(DeviceMessageManager(), forMessageName: "deviceMessageManager");
    self.router.registerHandler(FilesMessageManager(), forMessageName: "filesMessageManager");
    self.router.registerHandler(HudMessageManager(), forMessageName: "hudMessageManager");
    
    // Setup webkit preferences.
    let preferences = WKPreferences();
    preferences.setValue(true, forKey: "developerExtrasEnabled");
    preferences.setValue(true, forKey: "allowFileAccessFromFileURLs");
    
    // Setup webkit content controller with each message manager.
    let userContentController = WKUserContentController();
    userContentController.add(self, name: "consoleMessageManager");
    userContentController.add(self, name: "browserMessageManager");
    userContentController.add(self, name: "deviceMessageManager");
    userContentController.add(self, name: "filesMessageManager");
    userContentController.add(self, name: "hudMessageManager");
    
    // Setup webview configuration with preferences and content controller.
    let webViewConfiguration = WKWebViewConfiguration();
    webViewConfiguration.preferences = preferences;
    webViewConfiguration.allowsInlineMediaPlayback = true;
    webViewConfiguration.mediaTypesRequiringUserActionForPlayback = [];
    webViewConfiguration.userContentController = userContentController;
    
    // Create and configure webview.
    self.webView = WKWebView(frame: view.bounds, configuration: webViewConfiguration);
    self.webView.autoresizingMask = [ .flexibleWidth, .flexibleHeight];
    
    // Load app.html file and load in webview.
    if let htmlPath = Bundle.main.path(forResource: "app", ofType: "html")
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
// MESSAGE MANAGER / ROUTER
//=======================================================//

/** Protocol representing what functionality a Javascript message manager should have. */
protocol JavascriptMessageManager
{
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
}

/** Class representing the object that routes messages to the correct Javascript message manager. */
class JavascriptMessageRouter
{
  private var handlers: [String: JavascriptMessageManager] = [:]
  
  /** Method called to register a new handler for a message manager.*/
  func registerHandler(_ handler: JavascriptMessageManager, forMessageName name: String)
  {
    handlers[name] = handler;
  }
  
  /** Method to route the message to the correct Javascript message manager. */
  func routeMessage(_ message: WKScriptMessage, webView: WKWebView )
  {
    if let handler = handlers[message.name] { handler.handleMessage(message, webView: webView); }
    else { print("No handler found for message: \(message.name)"); }
  }
}

//=======================================================//
// MESSAGE MANAGERS
//=======================================================//

/** Class that manages messages from the console module. */
class ConsoleMessageManager: JavascriptMessageManager
{
  /** Method to handle messages for the console module. */
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
  {
    if let messageBody = message.body as? String { print(messageBody); }
  }
}

//=============================================//

/** Class that manages messages from the browser module. */
class BrowserMessageManager: NSObject, JavascriptMessageManager
{
  /** Method to handle messages for the browser module. */
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

/** Class that manages messages the device module. */
class DeviceMessageManager: JavascriptMessageManager
{
  /** Method to handle messages for the device module. */
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

/** Class that manages messages the files module. */
class FilesMessageManager: JavascriptMessageManager
{
  /** Method to handle messages for the files module. Calls the the correct file method as needed. */
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView) 
  {    
    let dict = message.body as? [String: Any];
    let command = dict!["command"] as? String;
    switch command 
    {
      case "createFile":
        let fileName = dict!["fileName"] as? String;
        self.createFile(dict: dict!, webView: webView, fileName: fileName!);
      case "createFolder":
        let folderName = dict!["folderName"] as? String;
        self.createFolder(dict: dict!, webView: webView, folderName: folderName!);
      case "deleteFile":
        self.deleteFile(dict: dict!, webView: webView);
      case "deleteFolder":
        self.deleteFolder(dict: dict!, webView: webView);
      case "getFile":
        self.getFile(dict: dict!, webView: webView);
      case "getFolder":
        self.getFolder(dict: dict!, webView: webView);
      case "moveFile":
        self.moveFile(dict: dict!, webView: webView);
      case "moveFolder":
        self.moveFolder(dict: dict!, webView: webView);
      case "readFile":
        self.readFile(dict: dict!, webView: webView);
      case "renameFile":
        let fileName = dict!["fileName"] as? String;
        self.renameFile(dict: dict!, webView: webView, fileName: fileName!);
      case "renameFolder":
        let folderName = dict!["folderName"] as? String;
        self.renameFolder(dict: dict!, webView: webView, folderName: folderName!);
      case "writeToFile":
        self.writeToFile(dict: dict!, webView: webView);
      default:
        print("FilesMessageManager Error: Unknown command '\(command!)'");
    }
  }
  
  /** Method to create a new file at the specified path. */
  func createFile(dict: [String: Any], webView: WKWebView, fileName: String) 
  {
    let root = dict["root"] as? String;
    let subpath = dict["subpath"] as? String;
    let base: Folder?;
  
    switch root 
    {
      case "Documents": base = Folder.documents
      case "Library": base = Folder.library
      case "tmp": base = Folder.temporary
      default: base = nil
    }
  
    let validBase = base;
    let targetPath = subpath!.isEmpty ? validBase!.path : validBase!.path + subpath!;
  
    do 
    {
      let targetFolder = try Folder(path: targetPath);
      var uniqueName = fileName;
      var counter = 1;
      while targetFolder.containsFile(named: uniqueName) 
      {
        uniqueName = "\(fileName)(\(counter))";
        counter += 1;
      }
  
      let createdFile = try targetFolder.createFile(named: uniqueName);
      let fileInfo = serializeFile(createdFile, relativeTo: validBase!.path);
  
      if let jsonData = try? JSONSerialization.data(withJSONObject: fileInfo), let jsonString = String(data: jsonData, encoding: .utf8) 
      {
        let escaped = jsonString
          .replacingOccurrences(of: "\\", with: "\\\\")
          .replacingOccurrences(of: "'", with: "\\'")
          .replacingOccurrences(of: "\n", with: "\\n")
          .replacingOccurrences(of: "\r", with: "\\r");
  
        let js = "files._createdFileFound(JSON.parse('\(escaped)'));";
        DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil); }
      }
    } 
    catch 
    {
      print("❌ FilesMessageManager Error: Failed to create file at \(targetPath): \(error)");
      let js = "files._createdFileNotFound(null);"
      DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil); }
    }
  }

  /** Method to create a new folder at the specified path. */
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
  
  /** Method to delete a file at the specified path. */
  func deleteFile(dict: [String: Any], webView: WKWebView)
  {
    let root = dict["root"] as? String;
    let subpath = dict["subpath"] as? String;
    let base: Folder?;
    
    switch root
    {
      case "Documents": base = Folder.documents
      case "Library": base = Folder.library
      case "tmp": base = Folder.temporary
      default: base = nil
    }
    
    let validBase = base; 
    let targetPath = subpath!.isEmpty ? validBase!.path : validBase!.path + subpath!;
    
    do
    {
      let targetFile = try File(path: targetPath);
      try targetFile.delete();
      let js = "files._fileDeleted();";
      DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil); };
    }
    catch
    {
      print("❌ FilesMessageManager Error: Failed to delete file at \(targetPath): \(error)");
      let js = "files._fileNotDeleted(null);";
      DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil); }
    }
  }

  /** Method to delete a folder at the specified path. */
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
  
  /** Method to return a file at the specified path. */
  func getFile(dict: [String: Any], webView: WKWebView)
  {
    let root = dict["root"] as? String
    let subpath = dict["subpath"] as? String
    let base: Folder?
    
    switch root
    {
      case "Documents": base = Folder.documents
      case "Library": base = Folder.library
      case "tmp": base = Folder.temporary
      default: base = nil
    }
    
    let validBase = base;
    let targetPath = subpath!.isEmpty ? validBase!.path : validBase!.path + subpath!
    
    do
    {
      let resolvedFile = try File(path: targetPath)
      let fileInfo = serializeFile(resolvedFile, relativeTo: validBase!.path)
      
      if let jsonData = try? JSONSerialization.data(withJSONObject: fileInfo), let jsonString = String(data: jsonData, encoding: .utf8)
      {
        let escaped = jsonString
          .replacingOccurrences(of: "\\", with: "\\\\")
          .replacingOccurrences(of: "'", with: "\\'")
          .replacingOccurrences(of: "\n", with: "\\n")
          .replacingOccurrences(of: "\r", with: "\\r")
        
        let js = "files._fileFound(JSON.parse('\(escaped)'));"
        DispatchQueue.main.async {
          webView.evaluateJavaScript(js, completionHandler: nil)
        }
      }
    }
    catch
    {
      print("FilesMessageManager Error: File not found at \(targetPath)")
      let js = "files._fileNotFound(null);"
      DispatchQueue.main.async {
        webView.evaluateJavaScript(js, completionHandler: nil)
      }
    }
  }

  /** Method to return a folder at the specified path. */
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
  
  /** Method to move a file from the old path to new path. */
  func moveFile(dict: [String: Any], webView: WKWebView)
  {
    let oldRoot = dict["oldRoot"] as? String;
    let newRoot = dict["newRoot"] as? String;
    let oldSubpath = dict["oldSubpath"] as? String;
    let newSubpath = dict["newSubpath"] as? String;
    
    func baseFolder(for root: String) -> Folder?
    {
      switch root {
        case "Documents": return Folder.documents
        case "Library":   return Folder.library
        case "tmp":       return Folder.temporary
        default:          return nil
      }
    }
    
    let oldBase = baseFolder(for: oldRoot!);
    let newBase = baseFolder(for: newRoot!);
    let oldPath = oldSubpath!.isEmpty ? oldBase!.path : oldBase!.path + oldSubpath!;
    let newParentPath = newSubpath!.isEmpty ? newBase!.path : newBase!.path + newSubpath!;
    
    do
    {
      let sourceFile = try File(path: oldPath);
      let destinationParent = try Folder(path: newParentPath);
      
      var uniqueName = sourceFile.name;
      let fileExtension = sourceFile.extension ?? "";
      let baseName = fileExtension.isEmpty ? uniqueName : String(uniqueName.dropLast(fileExtension.count + 1));
      var counter = 1;
      
      while destinationParent.containsFile(named: uniqueName)
      {
        uniqueName = fileExtension.isEmpty ? "\(baseName)(\(counter))" : "\(baseName)(\(counter)).\(fileExtension)";
        counter += 1;
      }
      
      let destinationPath = destinationParent.path + uniqueName;
      try FileManager.default.moveItem(atPath: sourceFile.path, toPath: destinationPath);
      
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.05)
      {
        do
        {
          let movedFile = try File(path: destinationPath);
          let fileInfo = self.serializeFile(movedFile, relativeTo: newBase!.path);
          let jsonData = try? JSONSerialization.data(withJSONObject: fileInfo);
          let jsonString = String(data: jsonData!, encoding: .utf8);
          let escaped = jsonString!
              .replacingOccurrences(of: "\\", with: "\\\\")
              .replacingOccurrences(of: "'", with: "\\'")
              .replacingOccurrences(of: "\n", with: "\\n")
              .replacingOccurrences(of: "\r", with: "\\r");
          let js = "files._movedFileFound(JSON.parse('\(escaped)'));";
          webView.evaluateJavaScript(js, completionHandler: nil);
        }
        catch
        {
          print("❌ FilesMessageManager Error: Could not verify moved file at \(destinationPath): \(error)");
        }
      }
    }
    catch
    {
      print("❌ FilesMessageManager Error: Failed to move file from \(oldPath) to \(newParentPath): \(error)")
      let js = "files._movedFileNotFound(null);"
      DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil) }
    }
  }

  /** Method to move a folder from the old path to new path. */
  func moveFolder(dict: [String: Any], webView: WKWebView)
  {
    let oldRoot = dict["oldRoot"] as? String;
    let newRoot = dict["newRoot"] as? String;
    let oldSubpath = dict["oldSubpath"] as? String;
    let newSubpath = dict["newSubpath"] as? String;
    
    func baseFolder(for root: String) -> Folder? 
    {
      switch root {
        case "Documents": return Folder.documents
        case "Library":   return Folder.library
        case "tmp":       return Folder.temporary
        default:          return nil
      }
    }
    
    let oldBase = baseFolder(for: oldRoot!);
    let newBase = baseFolder(for: newRoot!);
    let oldPath = oldSubpath!.isEmpty ? oldBase!.path : oldBase!.path + oldSubpath!;
    let newParentPath = newSubpath!.isEmpty ? newBase!.path : newBase!.path + newSubpath!;
    
    do 
    {
      let sourceFolder = try Folder(path: oldPath);
      let destinationParent = try Folder(path: newParentPath);
  
      var uniqueName = sourceFolder.name;
      var counter = 1;
      while destinationParent.containsSubfolder(named: uniqueName) 
      {
        uniqueName = "\(sourceFolder.name)(\(counter))";
        counter += 1;
      }
  
      let destinationPath = destinationParent.path + uniqueName + "/";
      try FileManager.default.moveItem(atPath: sourceFolder.path, toPath: destinationPath);
      
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) 
      {
        do 
        {
          let movedFolder = try Folder(path: destinationPath);
          let folderInfo = self.serializeFolder(movedFolder, relativeTo: newBase!.path);
  
          if let jsonData = try? JSONSerialization.data(withJSONObject: folderInfo),let jsonString = String(data: jsonData, encoding: .utf8)
          {
            let escaped = jsonString
              .replacingOccurrences(of: "\\", with: "\\\\")
              .replacingOccurrences(of: "'", with: "\\'")
              .replacingOccurrences(of: "\n", with: "\\n")
              .replacingOccurrences(of: "\r", with: "\\r");
  
            let js = "files._movedFolderFound(JSON.parse('\(escaped)'));";
            webView.evaluateJavaScript(js, completionHandler: nil);
          }
        } 
        catch 
        {
          print("❌ FilesMessageManager Error: Could not verify moved folder at \(destinationPath): \(error)");
        }
      }
    }
    catch 
    {
      print("❌ FilesMessageManager Error: Failed to move folder from \(oldPath) to \(newParentPath): \(error)");
      let js = "files._movedFolderNotFound(null);";
      DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil) };
    }
  }
  
  /** Method to read the string data from a file at the specified path. */
  func readFile(dict: [String: Any], webView: WKWebView)
  {
    let root = dict["root"] as? String;
    let subpath = dict["subpath"] as? String;
    let base: Folder?;
    
    switch root
    {
      case "Documents": base = Folder.documents
      case "Library": base = Folder.library
      case "tmp": base = Folder.temporary
      default: base = nil
    }
    
    let validBase = base;
    let targetPath = subpath!.isEmpty ? validBase!.path : validBase!.path + subpath!;
    
    do
    {
      let file = try File(path: targetPath);
      let content = try file.readAsString();
      
      let escapedContent = content
        .replacingOccurrences(of: "\\", with: "\\\\")
        .replacingOccurrences(of: "'", with: "\\'")
        .replacingOccurrences(of: "\n", with: "\\n")
        .replacingOccurrences(of: "\r", with: "\\r");
      
      let js = "files._fileRead('\(escapedContent)');";
      DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil); }
    }
    catch
    {
      print("❌ FilesMessageManager Error: Failed to read file at \(targetPath): \(error)");
      let js = "files._fileNotRead(null);"
      DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil); }
    }
  }

  /** Method to rename a file at the specified path. */
  func renameFile(dict: [String: Any], webView: WKWebView, fileName: String)
  {
    let root = dict["root"] as? String;
    let subpath = dict["subpath"] as? String;
    let base: Folder?;
    
    switch root 
    {
      case "Documents": base = Folder.documents
      case "Library": base = Folder.library
      case "tmp": base = Folder.temporary
      default: base = nil
    }
    
    let validBase = base;
    let targetPath = subpath!.isEmpty ? validBase!.path : validBase!.path + subpath!;
    
    do 
    {
      let targetFile = try File(path: targetPath);
      let parentFolder = targetFile.parent;
      
      var uniqueName = fileName;
      var counter = 1;
      while parentFolder!.containsFile(named: uniqueName)
      {
        uniqueName = "\(fileName)(\(counter))";
        counter += 1;
      }
      
      let oldPath = targetFile.path;
      let newPath = parentFolder!.path + uniqueName;
      try FileManager.default.moveItem(atPath: oldPath, toPath: newPath);
      
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.05)
      {
        do
        {
          let renamedFile = try File(path: newPath);
          let fileInfo = self.serializeFile(renamedFile, relativeTo: validBase!.path);
          let jsonData = try? JSONSerialization.data(withJSONObject: fileInfo);
          let jsonString = String(data: jsonData!, encoding: .utf8);
    
          let escaped = jsonString!
            .replacingOccurrences(of: "\\", with: "\\\\")
            .replacingOccurrences(of: "'", with: "\\'")
            .replacingOccurrences(of: "\n", with: "\\n")
            .replacingOccurrences(of: "\r", with: "\\r");
          
          let js = "files._renamedFileFound(JSON.parse('\(escaped)'));";
          DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil); }
        }
        catch
        {
          print("❌ FilesMessageManager Error: Could not verify renamed file at \(error)");
        }
      }
    }
    catch
    {
      print("❌ FilesMessageManager Error: Failed to rename file at \(targetPath): \(error)");
      let js = "files._renamedFileNotFound(null);";
      DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil); }
    }
  }

  /** Method to rename a folder at the specified path. */
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
      
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) 
      {
        do
        {
          let renamedFolder = try Folder(path: parentFolder!.path + uniqueName + "/");
          let folderInfo = self.serializeFolder(renamedFolder, relativeTo: validBase!.path);
          
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
          print("❌ FilesMessageManager Error: Could not verify renamed folder at \(error)");
        }
      }
    }
    catch 
    {
      print("❌ FilesMessageManager Error: Failed to rename folder at \(targetPath): \(error)");
      let js = "files._renamedFolderNotFound(null);"
      DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil); }
    }
  }
  
  /** Method to serialize a file from a specified path and return it as a File model. */
  func serializeFile(_ file: File, relativeTo rootPath: String) -> [String: Any]
  {
    func normalizedRootName(from path: String) -> String
    {
      if path.contains("/Documents") { return "Documents" }
      if path.contains("/Library") { return "Library" }
      if path.contains("/tmp") { return "tmp" }
      return "Unknown"
    }
    
    let normalizedRoot = normalizedRootName(from: rootPath)
    
    let relativePath: String
    if file.path.hasPrefix(rootPath)
    {
      relativePath = String(file.path.dropFirst(rootPath.count))
    }
    else
    {
      relativePath = file.path
    }
    
    var fileInfo: [String: Any] = [
      "name": file.name,
      "nameExcludingExtension": file.nameExcludingExtension,
      "extension": file.extension as Any,
      "relativePath": relativePath,
      "root": normalizedRoot
    ]
    
    if let parent = file.parent
    {
      let parentRelativePath: String
      if parent.path.hasPrefix(rootPath)
      {
        parentRelativePath = String(parent.path.dropFirst(rootPath.count))
      }
      else
      {
        parentRelativePath = parent.path
      }
      
      fileInfo["parentFolder"] = [
        "name": parent.name,
        "relativePath": parentRelativePath,
        "root": normalizedRoot
      ]
    }
    else
    {
      fileInfo["parentFolder"] = NSNull()
    }
    
    return fileInfo
  }

  /** Method to serialize a folder from a specified path and return it as a Folder model. */
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
  
  /** Method to write string data to a file at a specified path. */
  func writeToFile(dict: [String: Any], webView: WKWebView)
  {
    let root = dict["root"] as? String;
    let subpath = dict["subpath"] as? String;
    let content = dict["content"] as? String;
    let replace = dict["replace"] as? Bool ?? false;
    let newline = dict["newline"] as? Bool ?? true;
    let base: Folder?;
    
    switch root 
    {
      case "Documents": base = Folder.documents
      case "Library": base = Folder.library
      case "tmp": base = Folder.temporary
      default: base = nil
    }
    
    let validBase = base;
    let targetPath = subpath!.isEmpty ? validBase!.path : validBase!.path + subpath!;
    
    do
    {
      let filePathURL = URL(fileURLWithPath: targetPath);
      let parentFolderPath = filePathURL.deletingLastPathComponent().path;
      let fileName = filePathURL.lastPathComponent;
      let parentFolder = try Folder(path: parentFolderPath);  
      let file = try parentFolder.file(named: fileName); 
  
      var finalContent = "";
      if replace { finalContent = content ?? ""; } 
      else 
      {
        var existingContent = try file.readAsString()
        if newline && !existingContent.isEmpty { existingContent.append("\n"); }
        existingContent.append(content ?? "");
        finalContent = existingContent;
      }
      
      try file.write(finalContent);
      let js = "files._fileWrittenTo();"
      DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil); }
    }
    catch
    {
      print("❌ FilesMessageManager Error: Failed to write to file at \(targetPath): \(error)");
      let js = "files._fileNotWrittenTo(null);";
      DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil); }
    }
  }
}

//=============================================//

/** Class that manages messages the hud module. */
class HudMessageManager: JavascriptMessageManager 
{
  /** Method to handle messages for the hud module. Calls the the correct hud method as needed. */
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView) 
  {
    let dict = message.body as? [String: Any];
    let command = dict!["command"] as? String;
    let hudMessage = dict!["message"] as? String;
    let delay = dict!["timeout"] as? Double;

    switch command 
    {
      case "added":
        if let msg = hudMessage { delay! > 0 ? ProgressHUD.added(msg, delay: delay) : ProgressHUD.added(msg) } 
        else { delay! > 0 ? ProgressHUD.added(delay: delay) : ProgressHUD.added() }
      case "failed":
        if let msg = hudMessage { delay! > 0 ? ProgressHUD.failed(msg, delay: delay) : ProgressHUD.failed(msg) } 
        else { delay! > 0 ? ProgressHUD.failed(delay: delay) : ProgressHUD.failed() }
      case "loading":
        if let msg = hudMessage { ProgressHUD.animate(msg) } 
        else { ProgressHUD.animate() }
      case "succeed":
        if let msg = hudMessage { delay! > 0 ? ProgressHUD.succeed(msg, delay: delay) : ProgressHUD.succeed(msg)} 
        else { delay! > 0 ? ProgressHUD.succeed(delay: delay) : ProgressHUD.succeed() }
      case "dismiss":
        ProgressHUD.dismiss()
      default:
        print("❌ HudMessageManager Error: Unknown command");
        return;
    }
  }
}


//=======================================================//
