//=======================================================//

import UIKit

//=======================================================//

/** Internal extension adding helper utilities to UIViewController. */
internal extension UIViewController
{
  /** Method to remove all child view controllers and subviews. */
  func removeAllChildren()
  {
    self.children.forEach
    {
      $0.willMove(toParent: nil);
    };
    
    for subview in self.view.subviews
    {
      subview.removeFromSuperview();
    }
    
    self.children.forEach
    {
      $0.removeFromParent();
    };
  }
}

//=======================================================//