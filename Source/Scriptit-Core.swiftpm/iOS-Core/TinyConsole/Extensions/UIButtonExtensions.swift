//=======================================================//

import UIKit

//=======================================================//

/** Internal extension adding styling helpers to UIButton. */
internal extension UIButton
{
  /** Method to apply the tiny console mini button style. */
  func applyMiniStyle()
  {
    self.contentEdgeInsets = UIEdgeInsets(
      top: 8,
      left: 8,
      bottom: 8,
      right: 8
    );
    
    self.backgroundColor = UIColor(
      white: 1.0,
      alpha: 0.1
    );
    
    self.layer.cornerRadius = 4;
  }
}

//=======================================================//