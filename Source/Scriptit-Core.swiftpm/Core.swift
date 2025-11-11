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

//=======================================================//
