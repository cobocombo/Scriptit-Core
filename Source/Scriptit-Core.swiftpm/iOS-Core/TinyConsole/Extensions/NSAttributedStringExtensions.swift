//=======================================================//

import Foundation

//=======================================================//

/** Internal extension adding helper utilities to NSAttributedString. */
internal extension NSAttributedString
{
  /** Static method to create a line break attributed string. */
  static func breakLine() -> NSAttributedString
  {
    return NSAttributedString(string: "\n");
  }
  
  /** Computed property returning the full range of the string. */
  var range: NSRange
  {
    return NSRange(location: 0, length: self.length);
  }
}

//=======================================================//