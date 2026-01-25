//=======================================================//
// CORE VERSION: 1.7
// RELEASE DATE: TBD
//=======================================================//

import UIKit
import WebKit
import SafariServices
import Files
import ProgressHUD
import UniformTypeIdentifiers

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
class FilesMessageManager: NSObject, JavascriptMessageManager, UIDocumentPickerDelegate
{
  var presentingController: UIViewController?
  var webView: WKWebView?
  var importDestinationRoot: String?;
  var importDestinationSubpath: String?
  var importAllowedExtensions: [String]?;
  
  enum Errors: String
  {
    case controllerUnavailable = "Files Message Manager Error: Presenting controller not available."
    case createFileFailed      = "Files Message Manager Error: File could not be created at path:"
    case createFolderFailed    = "Files Message Manager Error: Folder could not be created at path:"
    case deleteFileFailed      = "Files Message Manager Error: File could not be deleted at path:"
    case deleteFolderFailed    = "Files Message Manager Error: Folder could not be deleted at path:"
    case fileNotFound          = "Files Message Manager Error: File not found at path:"
    case folderNotFound        = "Files Message Manager Error: Folder not found at path:"
    case importFileFailed      = "Files Message Manager Error: File could not be imported at path:"
    case invalidFileTypes      = "Files Message Manager Error: Invalid file type."
    case invalidMessageBody    = "Files Message Manager Error: Message body not found."
    case invalidRoot           = "Files Message Manager Error: Invalid root provided."
    case jsonEncodingFailed    = "Files Message Manager Error: Failed to encode JSON."
    case missingCommand        = "Files Message Manager Error: Command not found."
    case missingFileName       = "Files Message Manager Error: File name was not found."
    case missingFolderName     = "Files Message Manager Error: Folder name was not found."
    case moveFileFailed        = "Files Message Manager Error: File could not be moved at path:"
    case moveFolderFailed      = "Files Message Manager Error: Folder could not be moved at path:"
    case parentFolderNotFound  = "Files Message Manager Error: Parent folder not found."
    case readFileFailed        = "Files Message Manager Error: File could not be read at path:"
    case renameFileFailed      = "Files Message Manager Error: File could not be renamed at path:"
    case renameFolderFailed    = "Files Message Manager Error: Folder could not be renamed at path:"
    case rootNotProvided       = "Files Message Manager Error: Root was not provided."
    case subpathNotProvided    = "Files Message Manager Error: Subpath was not provided."
    case unknownCommand        = "Files Message Manager Error: Unknown command."
    case writeToFileFailed     = "Files Message Manager Error: File could not be written to at path:"
  }
  
  let errors = Errors.self;
  
  /**
  * Public method to send an error or failure message from Swift back to JavaScript.
  *
  * This method takes a string describing the error, escapes it for safe use in JavaScript,
  * constructs a JS callback call, and evaluates it on the provided WKWebView.
  * The error is also printed to the console for debugging purposes.
  *
  * This is used throughout the file system methods to notify JavaScript when an operation
  * fails, such as file not found, invalid root, move/copy failure, or JSON serialization errors.
  *
  * @param error A descriptive string explaining the failure.
  * @param jsCallback The name of the JavaScript callback function to invoke (e.g., "_moveFileFail").
  * @param webView The WKWebView instance on which the JavaScript callback should be executed.
  */
  func dispatchFailure(error: String, jsCallback: String, webView: WKWebView)
  {
    let escaped = escapeForJavaScript(error);
    let js = "files.\(jsCallback)('\(escaped)');";
    DispatchQueue.main.async
    {
      print(error);
      webView.evaluateJavaScript(js, completionHandler: nil)
    }
  }
  
  /**
   * Public method to send a success message from Swift back to JavaScript.
   *
   * This method optionally takes a payload (already serialized as a JSON string),
   * escapes it for safe JavaScript injection, constructs the appropriate JavaScript
   * success callback, and evaluates it on the provided WKWebView.
   *
   * This is used throughout file system methods to notify JavaScript when an operation
   * completes successfully, such as creating, deleting, renaming, moving, or retrieving
   * files and folders.
   *
   * If no payload is provided, the callback is invoked without arguments.
   *
   * @param jsCallback The name of the JavaScript success callback function to invoke
   *                   (e.g., "_createFolderSuccess", "_folderFound").
   * @param payload An optional JSON string to pass to the callback.
   * @param webView The WKWebView instance on which the JavaScript callback should be executed.
   */
  func dispatchSuccess(jsCallback: String, payload: String? = nil, webView: WKWebView)
  {
    let js: String;
    if let payload = payload
    {
      let escaped = self.escapeForJavaScript(payload);
      js = "files.\(jsCallback)(JSON.parse('\(escaped)'));";
    }
    else { js = "files.\(jsCallback)();"; }
    DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil); }
  }
  
  /**
  * Public method to escape special characters in a Swift string for safe injection into JavaScript.
  *
  * This method ensures that backslashes, single quotes, and newline characters are properly escaped,
  * preventing syntax errors or unexpected behavior when the string is evaluated in a WKWebView.
  *
  * Typical use cases include sending error messages, file paths, or other dynamic strings
  * from Swift to JavaScript callbacks.
  *
  * @param value The Swift string to be escaped.
  * @return A new string with special characters escaped for JavaScript.
  */
  func escapeForJavaScript(_ value: String) -> String
  {
    return value
      .replacingOccurrences(of: "\\", with: "\\\\")
      .replacingOccurrences(of: "'", with: "\\'")
      .replacingOccurrences(of: "\n", with: "\\n")
      .replacingOccurrences(of: "\r", with: "\\r");
  }
  
  /**
  * Public method to handle messages received from JavaScript for the Files module.
  *
  * This method parses the message body, determines the intended command, and calls the appropriate
  * internal file or folder operation. It ensures that required parameters (like fileName, folderName,
  * or root paths) are present and logs errors if any are missing.
  *
  * Supported commands:
  * - createFile, createFolder, deleteFile, deleteFolder
  * - getFile, getFolder, importFile
  * - moveFile, moveFolder
  * - readFile, renameFile, renameFolder
  * - writeToFile
  *
  * @param message The WKScriptMessage object containing the command and arguments from JavaScript.
  * @param webView The WKWebView instance used for evaluating JavaScript callbacks.
  */
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
  {
    guard let dict = message.body as? [String: Any] else
    {
      print(self.errors.invalidMessageBody.rawValue);
      return;
    }
  
    guard let command = dict["command"] as? String else
    {
      print(self.errors.missingCommand.rawValue);
      return;
    }
  
    switch command
    {
      case "createFile":
        if let fileName = dict["fileName"] as? String { self.createFile(dict: dict, webView: webView, fileName: fileName); }
        else { print(self.errors.missingFileName.rawValue); }  
      case "createFolder":
        if let folderName = dict["folderName"] as? String { self.createFolder(dict: dict, webView: webView, folderName: folderName); }
        else { print(self.errors.missingFolderName.rawValue); }
      case "deleteFile":
        self.deleteFile(dict: dict, webView: webView);
      case "deleteFolder":
        self.deleteFolder(dict: dict, webView: webView);
      case "getFile":
        self.getFile(dict: dict, webView: webView);
      case "getFolder":
        self.getFolder(dict: dict, webView: webView);
      case "importFile":
        self.importFile(dict: dict, webView: webView);
      case "moveFile":
        self.moveFile(dict: dict, webView: webView);
      case "moveFolder":
        self.moveFolder(dict: dict, webView: webView);
      case "readFile":
        self.readFile(dict: dict, webView: webView);
      case "renameFile":
        if let fileName = dict["fileName"] as? String { self.renameFile(dict: dict, webView: webView, fileName: fileName); }
        else { print(self.errors.missingFileName.rawValue); }
      case "renameFolder":
        if let folderName = dict["folderName"] as? String { self.renameFolder(dict: dict, webView: webView, folderName: folderName); }
        else { print(self.errors.missingFolderName.rawValue); }
      case "writeToFile":
        self.writeToFile(dict: dict, webView: webView);
      default:
        print(self.errors.unknownCommand.rawValue);
    }
  }
  
  /**
  * Public method used to resolve a base Folder instance from a JavaScript-provided root string.
  *
  * This method accepts a root identifier string (e.g., "Documents", "Library", "tmp")
  * and returns the corresponding Folder object from the Files package.
  * If the root string is nil or unrecognized, the method logs an error and returns nil.
  *
  * Supported root strings:
  * - "Documents" -> Folder.documents
  * - "Library"   -> Folder.library
  * - "tmp"       -> Folder.temporary
  *
  * Any other value will trigger a printed error message.
  *
  * @param root Optional string representing the root folder name from JavaScript.
  * @return A Folder instance corresponding to the root, or nil if invalid.
  */
  func resolveBaseFolder(from root: String?) -> Folder?
  {
    guard let root = root else
    {
      print(self.errors.rootNotProvided.rawValue);
      return nil;
    }
  
    switch root
    {
      case "Documents":
        return Folder.documents;
      case "Library":
        return Folder.library;
      case "tmp":
        return Folder.temporary;
      default:
        print(self.errors.invalidRoot.rawValue);
        return nil;
    }
  }
  
  /**
   * Internal method used to serialize a File into a dictionary representation.
   *
   * This method converts a File instance into a lightweight metadata object
   * suitable for passing back to JavaScript or for internal processing.
   * It determines the file’s root directory using the provided base folder
   * and calculates paths relative to that root when possible.
   *
   * The returned dictionary includes:
   * - File name and extension information
   * - The file’s relative path from the resolved root folder
   * - The normalized root identifier ("Documents", "Library", "tmp")
   * - Parent folder metadata when available
   *
   * @param file The File instance to serialize.
   * @param baseFolder The resolved base Folder the file is relative to.
   * @return A dictionary containing serialized file metadata.
   */
  func serializeFile(_ file: File, relativeTo baseFolder: Folder) -> [String: Any]
  {
    let rootPath = baseFolder.path;
    let rootName: String;
  
    switch baseFolder
    {
      case Folder.documents:
        rootName = "Documents"
      case Folder.library:
        rootName = "Library"
      case Folder.temporary:
        rootName = "tmp"
      default:
        rootName = "Unknown"
    }
  
    let relativePath: String;
    if file.path.hasPrefix(rootPath) { relativePath = String(file.path.dropFirst(rootPath.count)); }
    else { relativePath = file.path; }
  
    var fileInfo: [String: Any] =
    [
      "name": file.name,
      "nameExcludingExtension": file.nameExcludingExtension,
      "extension": file.extension as Any,
      "relativePath": relativePath,
      "root": rootName
    ]
  
    if let parent = file.parent
    {
      let parentRelativePath: String
      if parent.path.hasPrefix(rootPath) { parentRelativePath = String(parent.path.dropFirst(rootPath.count)); }
      else { parentRelativePath = parent.path; }
      
      fileInfo["parentFolder"] =
      [
        "name": parent.name,
        "relativePath": parentRelativePath,
        "root": rootName
      ]
    }
    else { fileInfo["parentFolder"] = NSNull(); }
    return fileInfo;
  }

  /**
    * Internal method used to serialize a Folder into a dictionary representation.
    *
    * This method converts a Folder instance into a lightweight metadata object
    * suitable for passing back to JavaScript or for internal processing.
    * It determines the folder’s root directory using the provided base path
    * and calculates paths relative to that root when possible.
    *
    * The returned dictionary includes:
    * - Folder name
    * - Relative path from the resolved root folder
    * - The normalized root identifier ("Documents", "Library", "tmp")
    * - Parent folder metadata when available
    * - An array of subfolders and files, each serialized with the same structure
    *
    * @param folder The Folder instance to serialize.
    * @param rootPath The resolved base path the folder is relative to.
    * @return A dictionary containing serialized folder metadata.
    */
  func serializeFolder(_ folder: Folder, relativeTo rootPath: String) -> [String: Any]
  {
    func normalizedRootName(from path: String) -> String
    {
      if path.contains("/Documents") { return "Documents"; }
      if path.contains("/Library") { return "Library"; }
      if path.contains("/tmp") { return "tmp"; }
      return "Unknown";
    }
  
    let rootName = normalizedRootName(from: rootPath);
    let relativePath: String;
    if folder.path.hasPrefix(rootPath) { relativePath = String(folder.path.dropFirst(rootPath.count)); }
    else { relativePath = folder.path; }
  
    var folderInfo: [String: Any] = [
      "name": folder.name,
      "relativePath": relativePath,
      "root": rootName
    ];
  
    if let parent = folder.parent
    {
      let parentRelativePath: String;
      if parent.path.hasPrefix(rootPath) { parentRelativePath = String(parent.path.dropFirst(rootPath.count)); }
      else { parentRelativePath = parent.path; }
  
      folderInfo["parentFolder"] = [
        "name": parent.name,
        "relativePath": parentRelativePath,
        "root": rootName
      ];
    }
    else { folderInfo["parentFolder"] = NSNull(); }
    let subfolderArray: [[String: Any]] = folder.subfolders.map
    {
      subfolder in
      let subRelativePath: String;
      if subfolder.path.hasPrefix(rootPath) { subRelativePath = String(subfolder.path.dropFirst(rootPath.count)); }
      else { subRelativePath = subfolder.path; }
  
      return [
        "name": subfolder.name,
        "relativePath": subRelativePath,
        "root": rootName
      ];
    }
  
    folderInfo["subfolders"] = subfolderArray;
    let fileArray: [[String: Any]] = folder.files.map
    {
      file in
      let fileRelativePath: String;
      if file.path.hasPrefix(rootPath) { fileRelativePath = String(file.path.dropFirst(rootPath.count)); }
      else { fileRelativePath = file.path; }
  
      var fileInfo: [String: Any] = [
        "name": file.name,
        "nameExcludingExtension": file.nameExcludingExtension,
        "extension": file.extension as Any,
        "relativePath": fileRelativePath,
        "root": rootName
      ];
  
      if let parent = file.parent
      {
        let parentRelativePath: String;
        if parent.path.hasPrefix(rootPath) { parentRelativePath = String(parent.path.dropFirst(rootPath.count)); }
        else { parentRelativePath = parent.path; }
  
        fileInfo["parentFolder"] = [
          "name": parent.name,
          "relativePath": parentRelativePath,
          "root": rootName
        ];
      }
      else { fileInfo["parentFolder"] = NSNull(); }
      return fileInfo;
    }
  
    folderInfo["files"] = fileArray;
    return folderInfo;
  }
  
  /**
   * Public method called from JavaScript to create a new file at a specified path.
   *
   * This method resolves the base folder using a JavaScript-provided root value,
   * appends the provided subpath, and attempts to create a new file within the
   * target directory. If a file with the same name already exists, a unique
   * filename is generated automatically.
   *
   * Upon successful creation, the newly created file is serialized and returned
   * to JavaScript via a success callback. If any step fails, a standardized error
   * is dispatched back to JavaScript and logged to the console.
   *
   * Expected JavaScript input (dict):
   * - root (String): The base directory to resolve ("Documents", "Library", "tmp").
   * - subpath (String): The relative path to the target directory.
   *
   * JavaScript callbacks:
   * - files._createFileSuccess(fileInfo): Called when the file is successfully created.
   * - files._createFileFail(error): Called when file creation fails.
   *
   * @param dict A dictionary of arguments passed from JavaScript.
   * @param webView The WKWebView instance used to evaluate JavaScript callbacks.
   * @param fileName The desired name of the file to be created.
   */
  func createFile(dict: [String: Any], webView: WKWebView, fileName: String)
  {
    guard let baseFolder = self.resolveBaseFolder(from: dict["root"] as? String) else
    {
      let error = self.errors.invalidRoot.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_createFileFail", webView: webView);
      return;
    }
  
    guard let subpath = dict["subpath"] as? String else
    {
      let error = self.errors.subpathNotProvided.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_createFileFail", webView: webView);
      return;
    }
  
    let targetPath = subpath.isEmpty ? baseFolder.path : baseFolder.path + subpath;
    let targetFolder: Folder;
    do { targetFolder = try Folder(path: targetPath); }
    catch
    {
      let error = self.errors.folderNotFound.rawValue + " (\(targetPath)).";
      self.dispatchFailure(error: error, jsCallback: "_createFileFail", webView: webView);
      return;
    }
  
    var uniqueName = fileName;
    var counter = 1;
    while targetFolder.containsFile(named: uniqueName)
    {
      uniqueName = "\(fileName)(\(counter))";
      counter += 1;
    }
  
    let createdFile: File;
    do { createdFile = try targetFolder.createFile(named: uniqueName); }
    catch
    {
      let error = self.errors.createFileFailed.rawValue + " (\(uniqueName)).";
      self.dispatchFailure(error: error, jsCallback: "_createFileFail", webView: webView);
      return;
    }
  
    let fileInfo = self.serializeFile(createdFile, relativeTo: baseFolder)
    let jsonData: Data;
    do { jsonData = try JSONSerialization.data(withJSONObject: fileInfo); }
    catch
    {
      let error = self.errors.jsonEncodingFailed.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_createFileFail", webView: webView);
      return;
    }
  
    guard let jsonString = String(data: jsonData, encoding: .utf8) else
    {
      let error = self.errors.jsonEncodingFailed.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_createFileFail", webView: webView);
      return;
    }
  
    self.dispatchSuccess(jsCallback: "_createFileSuccess", payload: jsonString, webView: webView);
  }

  /**
    * Public method called from JavaScript to create a new folder at a specified path.
    *
    * This method resolves the base folder using a JavaScript-provided root value,
    * appends the provided subpath, and attempts to create a new folder within the
    * target directory. If a folder with the same name already exists, a unique
    * folder name is generated automatically.
    *
    * Upon successful creation, the newly created folder is serialized and returned
    * to JavaScript via a success callback. If any step fails, a standardized error
    * is dispatched back to JavaScript and logged to the console.
    *
    * Expected JavaScript input (dict):
    * - root (String): The base directory to resolve ("Documents", "Library", "tmp").
    * - subpath (String): The relative path to the target directory.
    * - folderName (String): The desired name of the folder to be created.
    *
    * JavaScript callbacks:
    * - files._createFolderSuccess(folderInfo): Called when the folder is successfully created.
    * - files._createFolderFail(error): Called when folder creation fails.
    *
    * @param dict A dictionary of arguments passed from JavaScript.
    * @param webView The WKWebView instance used to evaluate JavaScript callbacks.
    * @param folderName The desired name of the folder to create.
    */
  func createFolder(dict: [String: Any], webView: WKWebView, folderName: String)
  {
    guard let baseFolder = self.resolveBaseFolder(from: dict["root"] as? String) else
    {
      let error = self.errors.invalidRoot.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_createFolderFail", webView: webView);
      return;
    }
  
    guard let subpath = dict["subpath"] as? String else
    {
      let error = self.errors.subpathNotProvided.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_createFolderFail", webView: webView);
      return;
    }
  
    let targetPath = subpath.isEmpty ? baseFolder.path : baseFolder.path + subpath;
    let targetFolder: Folder;
    do { targetFolder = try Folder(path: targetPath); }
    catch
    {
      let error = self.errors.folderNotFound.rawValue + " (\(targetPath)).";
      self.dispatchFailure(error: error, jsCallback: "_createFolderFail", webView: webView);
      return;
    }
  
    var uniqueName = folderName;
    var counter = 1;
    while targetFolder.containsSubfolder(named: uniqueName)
    {
      uniqueName = "\(folderName)(\(counter))";
      counter += 1;
    }
  
    let createdFolder: Folder;
    do { createdFolder = try targetFolder.createSubfolder(named: uniqueName); }
    catch
    {
      let error = self.errors.createFolderFailed.rawValue + " (\(uniqueName)).";
      self.dispatchFailure(error: error, jsCallback: "_createFolderFail", webView: webView);
      return;
    }
  
    let folderInfo = self.serializeFolder(createdFolder, relativeTo: baseFolder.path);
    let jsonData: Data;
    do { jsonData = try JSONSerialization.data(withJSONObject: folderInfo); }
    catch
    {
      let error = self.errors.jsonEncodingFailed.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_createFolderFail", webView: webView);
      return;
    }
  
    guard let jsonString = String(data: jsonData, encoding: .utf8) else
    {
      let error = self.errors.jsonEncodingFailed.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_createFolderFail", webView: webView);
      return;
    }
  
    self.dispatchSuccess(jsCallback: "_createFolderSuccess", payload: jsonString, webView: webView);
  }
  
  /**
   * Public method called from JavaScript to delete a file at a specified path.
   *
   * This method resolves the base folder using a JavaScript-provided root value,
   * appends the provided subpath, and attempts to locate and delete the file.
   * If successful, a success callback is invoked in JavaScript. If any step
   * fails, a standardized error message is dispatched back to JavaScript and
   * logged to the console.
   *
   * Expected JavaScript input (dict):
   * - root (String): The base directory to resolve ("Documents", "Library", "tmp").
   * - subpath (String): The relative path to the file within the base directory.
   *
   * JavaScript callbacks:
   * - files._deleteFileSuccess(): Called when the file is successfully deleted.
   * - files._deleteFileFail(error): Called when the file cannot be deleted.
   *
   * @param dict A dictionary of arguments passed from JavaScript.
   * @param webView The WKWebView instance used to evaluate JavaScript callbacks.
   */
  func deleteFile(dict: [String: Any], webView: WKWebView)
  {
    guard let baseFolder = self.resolveBaseFolder(from: dict["root"] as? String) else
    {
      let error = self.errors.invalidRoot.rawValue;
      self.dispatchFailure(error: error,jsCallback: "_deleteFileFail", webView: webView);
      return;
    }
  
    guard let subpath = dict["subpath"] as? String else
    {
      let error = self.errors.subpathNotProvided.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_deleteFileFail",webView: webView);
      return;
    }
  
    let targetPath = subpath.isEmpty ? baseFolder.path : baseFolder.path + subpath;
    let targetFile: File;
    do { targetFile = try File(path: targetPath); }
    catch
    {
      let error = self.errors.fileNotFound.rawValue + " (\(targetPath)).";
      self.dispatchFailure(error: error, jsCallback: "_deleteFileFail", webView: webView);
      return;
    }
  
    do { try targetFile.delete(); }
    catch
    {
      let error = self.errors.deleteFileFailed.rawValue + " (\(targetPath)).";
      self.dispatchFailure(error: error, jsCallback: "_deleteFileFail", webView: webView);
      return;
    }
  
    self.dispatchSuccess(jsCallback: "_deleteFileSuccess", webView: webView);
  }

  /**
    * Public method called from JavaScript to delete a folder at a specified path.
    *
    * This method resolves the base folder using a JavaScript-provided root value,
    * appends the provided subpath, and attempts to delete the folder at that path.
    * Any failure during folder resolution or deletion is reported back to JavaScript
    * via the standardized `dispatchFailure` method.
    *
    * Expected JavaScript input (dict):
    * - root (String): The base directory ("Documents", "Library", "tmp").
    * - subpath (String): The relative path to the folder to be deleted.
    *
    * JavaScript callbacks:
    * - files._deleteFolderSuccess(): Called when the folder is successfully deleted.
    * - files._deleteFolderFail(error): Called when folder deletion fails.
    *
    * @param dict A dictionary of arguments passed from JavaScript.
    * @param webView The WKWebView instance used to evaluate JavaScript callbacks.
    */
  func deleteFolder(dict: [String: Any], webView: WKWebView)
  {
    guard let baseFolder = resolveBaseFolder(from: dict["root"] as? String) else
    {
      let error = self.errors.invalidRoot.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_deleteFolderFail", webView: webView);
      return;
    }
  
    guard let subpath = dict["subpath"] as? String else
    {
      let error = self.errors.subpathNotProvided.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_deleteFolderFail", webView: webView);
      return;
    }
  
    let targetPath = subpath.isEmpty ? baseFolder.path : baseFolder.path + subpath;
    let targetFolder: Folder;
    do { targetFolder = try Folder(path: targetPath); }
    catch
    {
      let error = self.errors.folderNotFound.rawValue + " (\(targetPath)).";
      self.dispatchFailure(error: error, jsCallback: "_deleteFolderFail", webView: webView);
      return;
    }
  
    do
    {
      try targetFolder.delete();
      self.dispatchSuccess(jsCallback: "_deleteFolderSuccess", webView: webView);
    }
    catch
    {
      let error = self.errors.deleteFolderFailed.rawValue + " (\(targetPath)).";
      self.dispatchFailure(error: error, jsCallback: "_deleteFolderFail", webView: webView);
    }
  }
  
  /**
   * Public method called from JavaScript to retrieve a file at a specified path.
   *
   * This method resolves the base folder using a JavaScript-provided root value,
   * appends the provided subpath, and attempts to locate and serialize the file.
   * If successful, the file metadata is returned to JavaScript via a success
   * callback. If any step fails, a standardized error is dispatched back to
   * JavaScript and logged to the console.
   *
   * Expected JavaScript input (dict):
   * - root (String): The base directory to resolve ("Documents", "Library", "tmp").
   * - subpath (String): The relative path to the file within the base directory.
   *
   * JavaScript callbacks:
   * - files._getFileSuccess(data): Called when the file is successfully found.
   * - files._getFileFail(error): Called when the file cannot be resolved or processed.
   *
   * @param dict A dictionary of arguments passed from JavaScript.
   * @param webView The WKWebView instance used to evaluate JavaScript callbacks.
   */
  func getFile(dict: [String: Any], webView: WKWebView)
  {
    guard let baseFolder = self.resolveBaseFolder(from: dict["root"] as? String) else { return }
    guard let subpath = dict["subpath"] as? String else
    {
      let error = self.errors.subpathNotProvided.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_getFileFail", webView: webView);
      return;
    }
    
    let targetPath = subpath.isEmpty ? baseFolder.path : baseFolder.path + subpath;
    let resolvedFile: File;
      
    do { resolvedFile = try File(path: targetPath); }
    catch
    {
      let error = self.errors.fileNotFound.rawValue + " (\(targetPath)).";
      self.dispatchFailure(error: error, jsCallback: "_getFileFail", webView: webView);
      return;
    }
    
    let fileInfo = self.serializeFile(resolvedFile, relativeTo: baseFolder)
    let jsonData: Data;
    do { jsonData = try JSONSerialization.data(withJSONObject: fileInfo); }
    catch
    {
      let error = self.errors.jsonEncodingFailed.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_getFileFail", webView: webView);
      return;
    }
    
    guard let jsonString = String(data: jsonData, encoding: .utf8) else
    {
      let error = self.errors.jsonEncodingFailed.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_getFileFail", webView: webView);
      return;
    }
  
    self.dispatchSuccess(jsCallback: "_getFileSuccess", payload: jsonString, webView: webView);
  }

  /**
    * Public method called from JavaScript to retrieve a folder at a specified path.
    *
    * This method resolves the base folder using a JavaScript-provided root value,
    * appends the provided subpath, attempts to locate the folder using the Files
    * package, serializes it, and returns the result to JavaScript.
    *
    * Any failure during folder resolution, lookup, or serialization is reported
    * back to JavaScript via the standardized `dispatchFailure` method.
    *
    * Expected JavaScript input (dict):
    * - root (String): The base directory ("Documents", "Library", "tmp").
    * - subpath (String): The relative path to the folder.
    *
    * JavaScript callbacks:
    * - files._getFolderSuccess(folderInfo): Called when the folder is found.
    * - files._getFolderFail(error): Called when the folder cannot be found.
    *
    * @param dict A dictionary of arguments passed from JavaScript.
    * @param webView The WKWebView instance used to evaluate JavaScript callbacks.
    */
  func getFolder(dict: [String: Any], webView: WKWebView)
  {
    guard let baseFolder = resolveBaseFolder(from: dict["root"] as? String) else
    {
      let error = self.errors.invalidRoot.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_getFolderFail", webView: webView);
      return;
    }
  
    guard let subpath = dict["subpath"] as? String else
    {
      let error = self.errors.subpathNotProvided.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_getFolderFail", webView: webView);
      return;
    }
  
    let targetPath = subpath.isEmpty ? baseFolder.path : baseFolder.path + subpath;
    let resolvedFolder: Folder;
  
    do { resolvedFolder = try Folder(path: targetPath); }
    catch
    {
      let error = self.errors.folderNotFound.rawValue + " (\(targetPath)).";
      self.dispatchFailure(error: error, jsCallback: "_getFolderFail", webView: webView);
      return;
    }
  
    do
    {
      let folderInfo = self.serializeFolder(resolvedFolder, relativeTo: baseFolder.path);
      let jsonData = try JSONSerialization.data(withJSONObject: folderInfo);
  
      guard let jsonString = String(data: jsonData, encoding: .utf8) else
      {
        let error = self.errors.jsonEncodingFailed.rawValue;
        self.dispatchFailure(error: error, jsCallback: "_getFolderFail", webView: webView);
        return;
      }
      
      self.dispatchSuccess(jsCallback: "_getFolderSuccess", payload: jsonString, webView: webView);
    }
    catch
    {
      let error = self.errors.jsonEncodingFailed.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_getFolderFail", webView: webView);
    }
  }
  
  /**
   * Public method called from JavaScript to import a file using the system document picker.
   *
   * Expected JavaScript input (dict):
   * - root (String): One of "Documents", "Library", or "tmp"
   * - subpath (String): Destination subpath relative to the root
   * - fileExtensions ([String], optional): Allowed file extensions (e.g. ["js", "json"])
   *
   * JavaScript callbacks:
   * - files._importFileSuccess(data)
   * - files._importFileFail(error)
   */
  func importFile(dict: [String: Any], webView: WKWebView)
  {
    guard let controller = self.presentingController else
    {
      let error = self.errors.controllerUnavailable.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_importFileFail", webView: webView);
      return;
    }
  
    guard let root = dict["root"] as? String else
    {
      let error = self.errors.rootNotProvided.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_importFileFail", webView: webView);
      return;
    }
  
    guard let _ = self.resolveBaseFolder(from: root) else
    {
      let error = self.errors.invalidRoot.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_importFileFail", webView: webView);
      return;
    }
  
    guard let subpath = dict["subpath"] as? String else
    {
      let error = self.errors.subpathNotProvided.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_importFileFail", webView: webView);
      return;
    }
  
    let extensions = dict["fileExtensions"] as? [String];
    let normalizedExtensions = extensions?
      .map { $0.lowercased().trimmingCharacters(in: .whitespacesAndNewlines) }
      .filter { !$0.isEmpty };
    let contentTypes: [UTType];
    if let exts = normalizedExtensions, !exts.isEmpty
    {
      contentTypes = exts.compactMap { UTType(filenameExtension: $0) };
      if contentTypes.isEmpty
      {
        let error = self.errors.invalidFileTypes.rawValue;
        self.dispatchFailure(error: error, jsCallback: "_importFileFail", webView: webView);
        return;
      }
    }
    else 
    { 
      contentTypes =
      [
        UTType(filenameExtension: "css")!,
        .commaSeparatedText,
        .html, 
        UTType(filenameExtension: "js")!, 
        .json, 
        UTType(filenameExtension: "log")!, 
        UTType(filenameExtension: "md")!, 
        .plainText, 
        UTType(filenameExtension: "swift")!,
        .xml
      ];
    }
  
    self.webView = webView;
    self.importDestinationRoot = root;
    self.importDestinationSubpath = subpath;
    self.importAllowedExtensions = normalizedExtensions;
  
    let picker = UIDocumentPickerViewController(forOpeningContentTypes: contentTypes, asCopy: true);
    picker.delegate = self;
    picker.allowsMultipleSelection = false;
    picker.modalPresentationStyle = .formSheet;
    controller.present(picker, animated: true);
  }
  
  /**
   * UIDocumentPicker delegate callback invoked after the user selects files.
   *
   * Copies supported files into the destination root + subpath, ensuring
   * imported filenames are unique. Imported files are serialized and
   * returned to JavaScript. Any failure is routed through standardized
   * error dispatch.
   */
  func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL])
  {
    guard
      let webView = self.webView,
      let root = self.importDestinationRoot,
      let subpath = self.importDestinationSubpath,
      let baseFolder = self.resolveBaseFolder(from: root)
    else { return; }
  
    let destinationPath = subpath.isEmpty ? baseFolder.path : baseFolder.path + subpath;
    do
    {
      let destinationFolder = try Folder(path: destinationPath);
      var importedFiles: [[String: Any]] = [];
      for url in urls
      {
        let ext = url.pathExtension.lowercased();
        if let allowed = self.importAllowedExtensions,
           !allowed.contains(ext) { continue; }
        let baseName = url.deletingPathExtension().lastPathComponent;
        var index = 0;
        var finalName = "\(baseName).\(ext)";
        while destinationFolder.containsFile(named: finalName)
        {
          index += 1;
          finalName = "\(baseName)(\(index)).\(ext)";
        }
  
        let importedFile = try destinationFolder.createFile(named: finalName, contents: try Data(contentsOf: url));
        let info = self.serializeFile(importedFile, relativeTo: baseFolder);
        importedFiles.append(info);
      }
  
      let jsonData = try JSONSerialization.data(withJSONObject: importedFiles);
      let jsonString = String(data: jsonData, encoding: .utf8)!;
      self.dispatchSuccess(jsCallback: "_importFileSuccess", payload: jsonString, webView: webView);
    }
    catch
    {
      let error = self.errors.importFileFailed.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_importFileFail", webView: webView);
    }
  
    self.importDestinationRoot = nil;
    self.importDestinationSubpath = nil;
    self.importAllowedExtensions = nil;
    self.webView = nil;
  }
  
  /**
   * Public method called from JavaScript to move a file from one location to another.
   *
   * This method resolves the source and destination base folders using JavaScript-
   * provided root values, constructs the full source and destination paths, and
   * moves the file while ensuring name uniqueness at the destination.
   *
   * If the move succeeds, the moved file is serialized and returned to JavaScript
   * via a success callback. If any step fails, a standardized error message is
   * dispatched back to JavaScript and logged to the console.
   *
   * Expected JavaScript input (dict):
   * - oldRoot (String): The source base directory ("Documents", "Library", "tmp").
   * - oldSubpath (String): Relative path to the source file.
   * - newRoot (String): The destination base directory.
   * - newSubpath (String): Relative path to the destination folder.
   *
   * JavaScript callbacks:
   * - files._moveFileSuccess(fileInfo): Called when the file is successfully moved.
   * - files._moveFileFail(error): Called when the file cannot be moved.
   *
   * @param dict A dictionary of arguments passed from JavaScript.
   * @param webView The WKWebView instance used to evaluate JavaScript callbacks.
   */
  func moveFile(dict: [String: Any], webView: WKWebView)
  {
    guard let oldBase = self.resolveBaseFolder(from: dict["oldRoot"] as? String) else
    {
      let error = self.errors.invalidRoot.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_moveFileFail", webView: webView);
      return;
    }
  
    guard let newBase = self.resolveBaseFolder(from: dict["newRoot"] as? String) else
    {
      let error = self.errors.invalidRoot.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_moveFileFail", webView: webView);
      return;
    }
  
    guard let oldSubpath = dict["oldSubpath"] as? String,
          let newSubpath = dict["newSubpath"] as? String else
    {
      let error = self.errors.subpathNotProvided.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_moveFileFail", webView: webView);
      return;
    }
  
    let sourcePath = oldSubpath.isEmpty ? oldBase.path : oldBase.path + oldSubpath;
    let destinationParentPath = newSubpath.isEmpty ? newBase.path : newBase.path + newSubpath;
    let sourceFile: File;
    let destinationFolder: Folder;
    do { sourceFile = try File(path: sourcePath); }
    catch
    {
      let error = self.errors.fileNotFound.rawValue + " (\(sourcePath)).";
      self.dispatchFailure(error: error, jsCallback: "_moveFileFail", webView: webView);
      return;
    }
  
    do { destinationFolder = try Folder(path: destinationParentPath); }
    catch
    {
      let error = self.errors.folderNotFound.rawValue + " (\(destinationParentPath)).";
      self.dispatchFailure(error: error, jsCallback: "_moveFileFail", webView: webView);
      return;
    }
  
    let fileExtension = sourceFile.extension ?? "";
    let baseName = sourceFile.nameExcludingExtension;
    var uniqueName = sourceFile.name;
    var counter = 1;
  
    while destinationFolder.containsFile(named: uniqueName)
    {
      uniqueName = fileExtension.isEmpty
        ? "\(baseName)(\(counter))"
        : "\(baseName)(\(counter)).\(fileExtension)";
      counter += 1;
    }
  
    do
    {
      _ = destinationFolder.path + uniqueName;
      let destinationFile = try destinationFolder.createFile(named: uniqueName);
      try destinationFile.write(sourceFile.read());
      try sourceFile.delete();
      let fileInfo = self.serializeFile(destinationFile, relativeTo: newBase);
      let jsonData = try JSONSerialization.data(withJSONObject: fileInfo);
      guard let jsonString = String(data: jsonData, encoding: .utf8) else
      {
        let error = self.errors.jsonEncodingFailed.rawValue;
        self.dispatchFailure(error: error, jsCallback: "_moveFileFail", webView: webView);
        return;
      }
      
      self.dispatchSuccess(jsCallback: "_moveFileSuccess", payload: jsonString, webView: webView);
    }
    catch
    {
      let error = self.errors.moveFileFailed.rawValue + " (\(destinationParentPath + uniqueName)).";
      self.dispatchFailure(error: error, jsCallback: "_moveFileFail", webView: webView);
    }
  }

  /**
    * Public method called from JavaScript to move a folder from one path to another.
    *
    * This method resolves the source and destination base folders using JavaScript-provided root values,
    * constructs the full source and destination paths, ensures the folder name is unique at the destination,
    * moves the folder by copying all files and subfolders inline, deletes the original folder,
    * serializes the result, and returns it to JavaScript. Any failure is reported via `dispatchFailure`.
    *
    * Expected JavaScript input (dict):
    * - oldRoot (String): Source base directory ("Documents", "Library", "tmp").
    * - oldSubpath (String): Relative path to the source folder.
    * - newRoot (String): Destination base directory.
    * - newSubpath (String): Relative path to the destination folder.
    *
    * JavaScript callbacks:
    * - files._moveFolderSuccess(folderInfo): Called on successful move.
    * - files._moveFolderFail(null): Called on failure.
    *
    * @param dict Dictionary of arguments from JavaScript.
    * @param webView WKWebView to evaluate JavaScript callbacks.
    */
  func moveFolder(dict: [String: Any], webView: WKWebView)
  {
    guard let oldBase = resolveBaseFolder(from: dict["oldRoot"] as? String) else
    {
      let error = self.errors.invalidRoot.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_moveFolderFail", webView: webView);
      return;
    }
  
    guard let newBase = resolveBaseFolder(from: dict["newRoot"] as? String) else
    {
      let error = self.errors.invalidRoot.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_moveFolderFail", webView: webView);
      return;
    }
  
    guard let oldSubpath = dict["oldSubpath"] as? String,
          let newSubpath = dict["newSubpath"] as? String else
    {
      let error = self.errors.subpathNotProvided.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_moveFolderFail", webView: webView);
      return;
    }
  
    let sourcePath = oldSubpath.isEmpty ? oldBase.path : oldBase.path + oldSubpath;
    let destinationParentPath = newSubpath.isEmpty ? newBase.path : newBase.path + newSubpath;
    let sourceFolder: Folder;
    let destinationParent: Folder;
  
    do { sourceFolder = try Folder(path: sourcePath); }
    catch
    {
      let error = self.errors.folderNotFound.rawValue + " (\(sourcePath)).";
      self.dispatchFailure(error: error, jsCallback: "_moveFolderFail", webView: webView);
      return;
    }
  
    do { destinationParent = try Folder(path: destinationParentPath); }
    catch
    {
      let error = self.errors.folderNotFound.rawValue + " (\(destinationParentPath)).";
      self.dispatchFailure(error: error, jsCallback: "_moveFolderFail", webView: webView);
      return;
    }
  
    var uniqueName = sourceFolder.name;
    var counter = 1;
    while destinationParent.containsSubfolder(named: uniqueName)
    {
      uniqueName = "\(sourceFolder.name)(\(counter))";
      counter += 1;
    }
  
    do
    {
      let destinationFolder = try destinationParent.createSubfolder(named: uniqueName);
      for file in sourceFolder.files
      {
        let destFile = try destinationFolder.createFile(named: file.name);
        try destFile.write(file.read());
      }
      
      var foldersToCopy: [(source: Folder, destination: Folder)] = [(sourceFolder, destinationFolder)];
      while !foldersToCopy.isEmpty
      {
        let (currentSource, currentDest) = foldersToCopy.removeFirst()
        for sub in currentSource.subfolders
        {
          let newSub = try currentDest.createSubfolder(named: sub.name);
          for file in sub.files
          {
            let destFile = try newSub.createFile(named: file.name);
            try destFile.write(file.read());
          }
          foldersToCopy.append((sub, newSub));
        }
      }
  
      try sourceFolder.delete();
      let folderInfo = self.serializeFolder(destinationFolder, relativeTo: newBase.path);
      let jsonData = try JSONSerialization.data(withJSONObject: folderInfo);
      guard let jsonString = String(data: jsonData, encoding: .utf8) else
      {
        let error = self.errors.jsonEncodingFailed.rawValue;
        self.dispatchFailure(error: error, jsCallback: "_moveFolderFail", webView: webView);
        return;
      }
      
      self.dispatchSuccess(jsCallback: "_moveFolderSuccess", payload: jsonString, webView: webView);
    }
    catch
    {
      let error = self.errors.moveFolderFailed.rawValue + " (\(sourcePath) → \(destinationParent.path + uniqueName)).";
      self.dispatchFailure(error: error, jsCallback: "_moveFolderFail", webView: webView);
    }
  }
  
  /**
   * Public method called from JavaScript to read string data from a file.
   *
   * This method resolves the base folder using a JavaScript-provided root value,
   * appends the provided subpath, and attempts to read the file as a UTF-8 string.
   * If successful, the file contents are escaped and returned to JavaScript.
   * If any step fails, a standardized error is dispatched back to JavaScript
   * and logged to the console.
   *
   * Expected JavaScript input (dict):
   * - root (String): The base directory to resolve ("Documents", "Library", "tmp").
   * - subpath (String): The relative path to the file within the base directory.
   *
   * JavaScript callbacks:
   * - files._readFileSuccess(content): Called when the file is successfully read.
   * - files._readFileFail(error): Called when the file cannot be read.
   *
   * @param dict A dictionary of arguments passed from JavaScript.
   * @param webView The WKWebView instance used to evaluate JavaScript callbacks.
   */
  func readFile(dict: [String: Any], webView: WKWebView)
  {
    guard let baseFolder = self.resolveBaseFolder(from: dict["root"] as? String) else
    {
      let error = self.errors.invalidRoot.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_readFileFail", webView: webView);
      return;
    }
  
    guard let subpath = dict["subpath"] as? String else
    {
      let error = self.errors.subpathNotProvided.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_readFileFail", webView: webView);
      return;
    }
  
    let targetPath = subpath.isEmpty ? baseFolder.path : baseFolder.path + subpath;
    let file: File;
    let content: String;
    do { file = try File(path: targetPath); }
    catch
    {
      let error = self.errors.fileNotFound.rawValue + " (\(targetPath)).";
      self.dispatchFailure(error: error, jsCallback: "_readFileFail", webView: webView);
      return;
    }
  
    do { content = try file.readAsString(); }
    catch
    {
      let error = self.errors.readFileFailed.rawValue + " (\(targetPath)).";
      self.dispatchFailure(error: error, jsCallback: "_readFileFail", webView: webView);
      return;
    }
    
    let escaped = escapeForJavaScript(content);
    let js = "files._readFileSuccess('\(escaped)');";
    DispatchQueue.main.async { webView.evaluateJavaScript(js, completionHandler: nil) };
  }

  /**
   * Public method called from JavaScript to rename a file at a specified path.
   *
   * This method resolves the base folder using a JavaScript-provided root value,
   * locates the target file, and renames it within its parent folder. If a file
   * with the requested name already exists, a unique name is generated.
   *
   * On success, the renamed file is serialized and returned to JavaScript via a
   * success callback. If any step fails, a standardized error is dispatched back
   * to JavaScript and logged to the console.
   *
   * Expected JavaScript input (dict):
   * - root (String): The base directory ("Documents", "Library", "tmp").
   * - subpath (String): Relative path to the file to rename.
   *
   * JavaScript callbacks:
   * - files._renamedFileSuccess(data): Called when the file is successfully renamed.
   * - files._renamedFileFail(error): Called when the file cannot be renamed.
   *
   * @param dict A dictionary of arguments passed from JavaScript.
   * @param webView The WKWebView instance used to evaluate JavaScript callbacks.
   * @param fileName The new desired file name (without uniqueness guarantees).
   */
  func renameFile(dict: [String: Any], webView: WKWebView, fileName: String)
  {
    guard let baseFolder = self.resolveBaseFolder(from: dict["root"] as? String) else
    {
      let error = self.errors.invalidRoot.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_renameFileFail", webView: webView);
      return;
    }
  
    guard let subpath = dict["subpath"] as? String else
    {
      let error = self.errors.subpathNotProvided.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_renameFileFail", webView: webView);
      return;
    }
  
    let targetPath = subpath.isEmpty ? baseFolder.path : baseFolder.path + subpath;
    let targetFile: File;
    do { targetFile = try File(path: targetPath); }
    catch
    {
      let error = self.errors.fileNotFound.rawValue + " (\(targetPath)).";
      self.dispatchFailure(error: error, jsCallback: "_renameFileFail", webView: webView);
      return;
    }
  
    guard let parentFolder = targetFile.parent else
    {
      let error = self.errors.parentFolderNotFound.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_renameFileFail", webView: webView);
      return;
    }
  
    let fileExtension = targetFile.extension ?? "";
    let baseName = fileName.contains(".")
      ? fileName.components(separatedBy: ".").dropLast().joined(separator: ".")
      : fileName;
    var uniqueName = fileName;
    var counter = 1;
    while parentFolder.containsFile(named: uniqueName)
    {
      uniqueName = fileExtension.isEmpty
        ? "\(baseName)(\(counter))"
        : "\(baseName)(\(counter)).\(fileExtension)";
      counter += 1;
    }
  
    let newPath = parentFolder.path + uniqueName;
    do { try FileManager.default.moveItem(atPath: targetFile.path, toPath: newPath); }
    catch
    {
      let error = self.errors.renameFileFailed.rawValue + " (\(newPath)).";
      self.dispatchFailure(error: error, jsCallback: "_renameFileFail", webView: webView);
      return;
    }
  
    DispatchQueue.main.asyncAfter(deadline: .now() + 0.05)
    {
      do
      {
        let renamedFile = try File(path: newPath);
        let fileInfo = self.serializeFile(renamedFile, relativeTo: baseFolder);
        let jsonData = try JSONSerialization.data(withJSONObject: fileInfo);
        guard let jsonString = String(data: jsonData, encoding: .utf8) else
        {
          let error = self.errors.jsonEncodingFailed.rawValue;
          self.dispatchFailure(error: error, jsCallback: "_renameFileFail", webView: webView);
          return;
        }
  
        self.dispatchSuccess(jsCallback: "_renameFileSuccess", payload: jsonString, webView: webView);
      }
      catch
      {
        let error = self.errors.fileNotFound.rawValue + " (\(newPath)).";
        self.dispatchFailure(error: error, jsCallback: "_renameFileFail", webView: webView);
      }
    }
  }

  /**
    * Public method called from JavaScript to rename a folder at a specified path.
    *
    * This method resolves the base folder using a JavaScript-provided root value,
    * appends the provided subpath, ensures the new name is unique within the parent
    * directory, renames the folder using the Files package, and returns the updated
    * folder info to JavaScript.
    *
    * Any failure during resolution, renaming, or serialization is reported via the
    * standardized `dispatchFailure` method.
    *
    * Expected JavaScript input (dict):
    * - root (String): The base directory ("Documents", "Library", "tmp").
    * - subpath (String): The relative path to the folder being renamed.
    *
    * JavaScript callbacks:
    * - files._renameFolderSuccess(folderInfo): Called when the folder is successfully renamed.
    * - files._renameFolderFail(error): Called when the folder cannot be renamed.
    *
    * @param dict A dictionary of arguments passed from JavaScript.
    * @param webView The WKWebView instance used to evaluate JavaScript callbacks.
    * @param folderName The desired new name for the folder.
    */
  func renameFolder(dict: [String: Any], webView: WKWebView, folderName: String)
  {
    guard let baseFolder = resolveBaseFolder(from: dict["root"] as? String) else
    {
      let error = self.errors.invalidRoot.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_renameFolderFail", webView: webView);
      return;
    }
  
    guard let subpath = dict["subpath"] as? String else
    {
      let error = self.errors.subpathNotProvided.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_renameFolderFail", webView: webView);
      return;
    }
  
    let targetPath = subpath.isEmpty ? baseFolder.path : baseFolder.path + subpath;
    let targetFolder: Folder;
  
    do { targetFolder = try Folder(path: targetPath); }
    catch
    {
      let error = self.errors.folderNotFound.rawValue + " (\(targetPath)).";
      self.dispatchFailure(error: error, jsCallback: "_renameFolderFail", webView: webView);
      return;
    }
  
    guard let parentFolder = targetFolder.parent else
    {
      let error = self.errors.folderNotFound.rawValue + " (parent).";
      self.dispatchFailure(error: error, jsCallback: "_renameFolderFail", webView: webView);
      return;
    }
  
    var uniqueName = folderName;
    var counter = 1;
    while parentFolder.containsSubfolder(named: uniqueName)
    {
      uniqueName = "\(folderName)(\(counter))";
      counter += 1;
    }
  
    do
    {
      try targetFolder.rename(to: uniqueName);
  
      let renamedFolder = try Folder(path: parentFolder.path + uniqueName + "/");
      let folderInfo = self.serializeFolder(renamedFolder, relativeTo: baseFolder.path);
      let jsonData = try JSONSerialization.data(withJSONObject: folderInfo);
  
      guard let jsonString = String(data: jsonData, encoding: .utf8) else
      {
        let error = self.errors.jsonEncodingFailed.rawValue;
        self.dispatchFailure(error: error, jsCallback: "_renameFolderFail", webView: webView);
        return;
      }
      
      self.dispatchSuccess(jsCallback: "_renameFolderSuccess", payload: jsonString, webView: webView);
    }
    catch
    {
      let error = self.errors.renameFolderFailed.rawValue + " (\(targetPath)).";
      self.dispatchFailure(error: error, jsCallback: "_renameFolderFail", webView: webView);
    }
  }
  
  
  /**
   * Public method called from JavaScript to write string data to a file.
   *
   * This method resolves the base folder, locates the target file, and writes
   * content to it. The content may either replace the file entirely or be appended
   * to the existing contents. An optional newline may be inserted before appending.
   *
   * On success, a JavaScript success callback is invoked. On failure, a standardized
   * error is logged and dispatched back to JavaScript.
   *
   * Expected JavaScript input (dict):
   * - root (String): The base directory ("Documents", "Library", "tmp").
   * - subpath (String): Relative path to the target file.
   * - content (String): The content to write to the file.
   * - replace (Bool, optional): Whether to overwrite the file (default: false).
   * - newline (Bool, optional): Whether to prepend a newline when appending (default: true).
   *
   * JavaScript callbacks:
   * - files._fileWrittenTo(): Called when the write succeeds.
   * - files._fileNotWrittenTo(error): Called when the write fails.
   *
   * @param dict A dictionary of arguments passed from JavaScript.
   * @param webView The WKWebView instance used to evaluate JavaScript callbacks.
   */
  func writeToFile(dict: [String: Any], webView: WKWebView)
  {
    guard let baseFolder = self.resolveBaseFolder(from: dict["root"] as? String) else
    {
      let error = self.errors.invalidRoot.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_writeToFileFail", webView: webView);
      return;
    }
  
    guard let subpath = dict["subpath"] as? String else
    {
      let error = self.errors.subpathNotProvided.rawValue;
      self.dispatchFailure(error: error, jsCallback: "_writeToFileFail", webView: webView);
      return;
    }
  
    let content = dict["content"] as? String ?? "";
    let replace = dict["replace"] as? Bool ?? false;
    let newline = dict["newline"] as? Bool ?? true;
    let targetPath = subpath.isEmpty ? baseFolder.path : baseFolder.path + subpath;
    let fileURL = URL(fileURLWithPath: targetPath);
    let parentFolderPath = fileURL.deletingLastPathComponent().path;
    let fileName = fileURL.lastPathComponent;
    let parentFolder: Folder;
    let file: File;
    
    do { parentFolder = try Folder(path: parentFolderPath); }
    catch
    {
      let error = self.errors.parentFolderNotFound.rawValue + " (\(parentFolderPath)).";
      self.dispatchFailure(error: error, jsCallback: "_writeToFileFail", webView: webView);
      return;
    }
  
    do { file = try parentFolder.file(named: fileName); }
    catch
    {
      let error = self.errors.fileNotFound.rawValue + " (\(fileName)).";
      self.dispatchFailure(error: error, jsCallback: "_writeToFileFail", webView: webView);
      return;
    }
  
    var finalContent = "";
    do
    {
      if replace { finalContent = content; }
      else
      {
        var existingContent = try file.readAsString();
        if newline && !existingContent.isEmpty { existingContent.append("\n"); }
        existingContent.append(content);
        finalContent = existingContent;
      }
  
      try file.write(finalContent);
    }
    catch
    {
      let error = self.errors.writeToFileFailed.rawValue + " (\(targetPath)).";
      self.dispatchFailure(error: error, jsCallback: "_writeToFileFail", webView: webView);
      return;
    }

    self.dispatchSuccess(jsCallback: "_writeToFileSuccess", webView: webView);
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
