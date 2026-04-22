//=======================================================//

import UIKit

//=======================================================//

/** Class representing the main tiny console singleton object. */
open class TinyConsole
{
  public static var shared = TinyConsole();
  
  var textView: UITextView?;
  var consoleController: TinyConsoleController;
  
  static var textFont: UIFont = UIFont.monospacedSystemFont(ofSize: 12.0, weight: .regular);
  static var textColor: UIColor = UIColor.white;
  static var textAppearance: [NSAttributedString.Key: Any]
  {
    return
    [
      .font: self.textFont,
      .foregroundColor: self.textColor
    ];
  }
  
  private lazy var dateFormatter: DateFormatter =
  {
    let formatter = DateFormatter();
    formatter.dateStyle = .none;
    formatter.timeStyle = .medium;
    return formatter;
  }();
  
  private var currentTimeStamp: String
  {
    return self.dateFormatter.string(from: Date());
  }
  
  /** Creates the tiny console singleton object. */
  private init()
  {
    self.consoleController = TinyConsoleController();
  }
  
  /** Static method to limit console output to max line count. */
  private static func enforceLineLimit(
    textView: UITextView,
    maxLines: Int = 2000
  )
  {
    let fullText = textView.text ?? "";
    let lines = fullText.components(separatedBy: "\n");
    
    if(lines.count <= maxLines)
    {
      return;
    }
    
    let trimmedLines = Array(lines.suffix(maxLines));
    let trimmedText = trimmedLines.joined(separator: "\n");
    
    let attributed = NSAttributedString(
      string: trimmedText,
      attributes: self.textAppearance
    );
    
    textView.attributedText = attributed;
  }
  
  /** Static method to create the wrapped root view controller. */
  public static func createViewController(rootViewController: UIViewController) -> UIViewController
  {
    self.set(rootViewController: rootViewController);
    return self.shared.consoleController;
  }
  
  /** Static method to set the root view controller. */
  public static func set(rootViewController: UIViewController)
  {
    self.shared.consoleController.rootViewController = rootViewController;
  }
  
  /** Static method to scroll the console to the bottom. */
  public static func scrollToBottom()
  {
    guard let textView = self.shared.textView, textView.boundsHeightLessThenContentSizeHeight()
    else
    {
      return;
    }
    
    textView.layoutManager.ensureLayout(for: textView.textContainer);
    let offset = CGPoint(x: 0, y: (textView.contentSize.height - textView.frame.size.height));
    textView.setContentOffset(offset, animated: true);
  }
  
  /** Static method to set font by UIFont. */
  public static func setFont(_ font: UIFont)
  {
    self.textFont = font;
    self.refreshTextAppearance();
  }
  
  /** Static method to set font by name and size. */
  public static func setFont(name: String)
  {
    let fontSize = textFont.pointSize;
    guard let font = UIFont(name: name, size: fontSize)
    else
    {
      return;
    }
    
    self.setFont(font);
  }
  
  /** Static method to set only font size. */
  public static func setFontSize(_ size: CGFloat)
  {
    let fontName = self.textFont.fontName;
    if let font = UIFont(name: fontName, size: size)
    {
      self.setFont(font);
    }
  }
  
  /** Static method to refresh existing console text. */
  private static func refreshTextAppearance()
  {
    guard let textView = self.shared.textView
    else
    {
      return;
    }
    
    let text = textView.text ?? "";
    
    let attributed = NSMutableAttributedString(
      string: text,
      attributes: self.textAppearance
    );
    
    textView.attributedText = attributed;
  }
  
  /** Static method to toggle the console window mode. */
  public static func toggleWindowMode()
  {
    DispatchQueue.main.async
    {
      self.shared.consoleController.toggleWindowMode();
    }
  }
  
  /** Static method to expand the console fullscreen. */
  public static func fullscreen()
  {
    DispatchQueue.main.async
    {
      self.shared.consoleController.fullscreen();
    }
  }
  
  /** Static method to print plain text to the console. */
  public static func print(_ text: String, color: UIColor = UIColor.white, global: Bool = true)
  {
    let formattedText = NSMutableAttributedString(string: text);
    formattedText.addAttributes(self.textAppearance, range: formattedText.range);
    formattedText.addAttribute(.foregroundColor, value: color, range: formattedText.range);
    self.print(formattedText, global: global);
  }
  
  /** Static method to print attributed text to the console. */
  public static func print(_ text: NSAttributedString, global: Bool = true)
  {
    defer
    {
      if(global)
      {
        Swift.print(text.string);
      }
    }
    
    guard let textView = self.shared.textView
    else
    {
      return;
    }
    
    DispatchQueue.main.async
    {
      let timeStamped = NSMutableAttributedString(string: "\(self.shared.currentTimeStamp)");
      let range = NSRange(location: 0,length: timeStamped.length);
      timeStamped.addAttributes(self.textAppearance, range: range);
      
      timeStamped.append(text);
      timeStamped.append(.breakLine());
      
      let newText = NSMutableAttributedString(attributedString: textView.attributedText);
      newText.append(timeStamped);
      textView.attributedText = newText;
      
      self.enforceLineLimit(
        textView: textView,
        maxLines: 100
      );
      
      NotificationCenter.default.post(
        name: UITextView.textDidChangeNotification,
        object: textView
      );
      
      self.scrollToBottom();
    }
  }
  
  /** Static method to clear the console output. */
  public static func clear()
  {
    DispatchQueue.main.async
    {
      self.shared.textView?.clear();
      self.scrollToBottom();
    }
  }
  
  /** Static method to print a debug message. */
  public static func debug(_ text: String)
  {
    self.print(text, color: UIColor.orange);
  }
  
  /** Static method to print an error message. */
  public static func error(_ text: String)
  {
    self.print(text, color: UIColor.red);
  }
  
  /** Static method to print a log message. */
  public static func log(_ text: String)
  {
    self.print(text, color: UIColor.white);
  }
  
  /** Static method to set the console height. */
  public static func setHeight(height: CGFloat)
  {
    self.shared.consoleController.consoleHeight = height;
  }
  
  /** Static method to print an uncaught error message. */
  public static func uncaught(_ text: String)
  {
    self.print(text, color: UIColor.red);
  }
  
  /** Static method to print a debug message. */
  public static func warn(_ text: String)
  {
    self.print(text, color: UIColor.yellow);
  }
}

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