//=======================================================//

import Foundation
import UIKit

//=======================================================//

/** Internal extension adding layout helper utilities to UIView. */
internal extension UIView
{
  enum Anchor
  {
    case top
    case bottom
  }
  
  /** Method to pin the view to another view using the selected anchor. */
  func attach(anchor: Anchor, to view: UIView)
  {
    self.translatesAutoresizingMaskIntoConstraints = false;
    
    switch(anchor)
    {
      case .top:
        self.topAnchor
          .constraint(equalTo: view.topAnchor)
          .isActive = true;
      
      case .bottom:
        self.bottomAnchor
          .constraint(equalTo: view.bottomAnchor)
          .isActive = true;
    }
    
    self.leftAnchor
      .constraint(equalTo: view.leftAnchor)
      .isActive = true;
    
    self.rightAnchor
      .constraint(equalTo: view.rightAnchor)
      .isActive = true;
  }
}

//=======================================================//