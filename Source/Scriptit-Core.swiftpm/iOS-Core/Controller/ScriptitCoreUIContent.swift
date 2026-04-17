//=======================================================//

import UIKit
import SwiftUI

//=======================================================//

struct ScriptitCoreUIContent: UIViewControllerRepresentable 
{
  func makeUIViewController(context: Context) -> UIViewController 
  {
    //return ScriptitCoreController()
    
    let main = ScriptitCoreController()
    return TinyConsole.createViewController(rootViewController: main )
  }
  
  func updateUIViewController(_ uiViewController: UIViewController, context: Context) 
  {
    
  }
}

//=======================================================//
