//=======================================================//

import Foundation
import UIKit

//=======================================================//

/** Internal extension adding helper utilities to UITextView. */
internal extension UITextView
{
  static let console: UITextView =
  {
    let textView = UITextView();
    textView.backgroundColor = UIColor.black;
    textView.isEditable = false;
    textView.alwaysBounceVertical = true;
    return textView;
  }();
  
  /** Method to clear the text view contents. */
  func clear()
  {
    self.text = "";
  }
  
  /** Method returning whether content height exceeds bounds height. */
  func boundsHeightLessThenContentSizeHeight() -> Bool
  {
    return self.bounds.height < self.contentSize.height;
  }
}

//=======================================================//