//=======================================================//

import UIKit
import SwiftUI

//=======================================================//

struct ScriptitCoreUIContent: UIViewControllerRepresentable 
{
  func makeUIViewController(context: Context) -> UIViewController 
  {    
    let main = ScriptitCoreController()
    return TinyConsole.createViewController(rootViewController: main )
  }
  
  func updateUIViewController(_ uiViewController: UIViewController, context: Context) 
  {
    
  }
}

//=======================================================//
