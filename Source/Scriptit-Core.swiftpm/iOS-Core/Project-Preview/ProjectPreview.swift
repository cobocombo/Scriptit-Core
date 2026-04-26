//=============================================//

import UIKit
import WebKit

//=============================================//

/** Class that manages messages previewing projects in app. */
class ProjectPreviewMessageManager: NSObject, JavascriptMessageManager
{
  enum Errors: String
  {
    case projectNotProvided = "Project Preview Error: Project not provided."
    case invalidMessageBody = "Project Preview Error: Invalid message body."
    case rootControllerNotFound = "Project Preview Error: Root controller not found."
  }
  
  let errors = Errors.self;
  
  /** Method to handle messages for app. */
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
  {
    guard let dict = message.body as? [String: Any] else
    {
      print(self.errors.invalidMessageBody.rawValue)
      return
    }
    
    guard let project = dict["project"] as? String else
    {
      print(self.errors.projectNotProvided.rawValue)
      return
    }
    
    let preview = ProjectPreviewController()
    preview.project = project
    preview.modalPresentationStyle = .fullScreen
    
    guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
          let window = windowScene.windows.first,
          let rootVC = window.rootViewController
    else
    {
      print(self.errors.rootControllerNotFound.rawValue)
      return
    }
    
    var topVC = rootVC
    while let presented = topVC.presentedViewController
    {
      topVC = presented
    }
    
    DispatchQueue.main.async
    {
      topVC.present(preview, animated: true)
    }
  }
}

//=============================================//