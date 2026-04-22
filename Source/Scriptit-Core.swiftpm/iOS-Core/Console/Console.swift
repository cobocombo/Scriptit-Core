//=======================================================//

import UIKit

//=======================================================//

/** Class representing the main console singleton object. */
open class Console
{
  public static var shared = Console()
  public static var maxLines: Int = 100
  var textView: UITextView?
  var consoleController: ConsoleController
  static var textFont: UIFont = UIFont.monospacedSystemFont(ofSize: 12.0, weight: .regular)
  static var textColor: UIColor = UIColor.white
  static var textAppearance: [NSAttributedString.Key: Any]
  {
    return
    [
      .font: self.textFont,
      .foregroundColor: self.textColor
    ]
  }
  
  private lazy var dateFormatter: DateFormatter =
  {
    let formatter = DateFormatter()
    formatter.dateStyle = .none
    formatter.timeStyle = .medium
    return formatter
  }()
  
  private var currentTimeStamp: String
  {
    return self.dateFormatter.string(from: Date())
  }
  
  /** Creates the console singleton object. */
  private init()
  {
    self.consoleController = ConsoleController()
  }
  
  /** Enforces a maximum number of lines in the console. */
  private static func enforceLineLimit(
    textView: UITextView,
    maxLines: Int = Console.maxLines
  )
  {
    let fullText = textView.attributedText.string
    let lines = fullText.components(separatedBy: "\n")
    
    if lines.count <= maxLines
    {
      return
    }
    
    let trimmedLines = Array(lines.suffix(maxLines))
    let trimmedText = trimmedLines.joined(separator: "\n")
    
    let attributed = NSAttributedString(
      string: trimmedText,
      attributes: self.textAppearance
    )
    
    textView.attributedText = attributed
  }
  
  /** Refreshes existing console text with updated appearance. */
  private static func refreshTextAppearance()
  {
    guard let textView = self.shared.textView
    else
    {
      return
    }
    
    let text = textView.attributedText.string
    let attributed = NSMutableAttributedString(
      string: text,
      attributes: self.textAppearance
    )
    
    textView.attributedText = attributed
  }
  
  /** Clears the console output. */
  public static func clear()
  {
    DispatchQueue.main.async
    {
      self.shared.textView?.clear()
      self.scrollToBottom()
    }
  }
  
  /** Creates the wrapped root view controller. */
  public static func createViewController(rootViewController: UIViewController) -> UIViewController
  {
    self.set(rootViewController: rootViewController)
    return self.shared.consoleController
  }
  
  /** Prints a debug message. */
  public static func debug(_ text: String)
  {
    self.print(text, color: UIColor.orange)
  }
  
  /** Prints an error message. */
  public static func error(_ text: String)
  {
    self.print(text, color: UIColor.red)
  }
  
  /** Expands the console to fullscreen. */
  public static func fullscreen()
  {
    DispatchQueue.main.async
    {
      self.shared.consoleController.fullscreen()
    }
  }
  
  /** Prints a log message. */
  public static func log(_ text: String)
  {
    self.print(text, color: UIColor.white)
  }
  
  /** Prints plain text to the console. */
  public static func print(_ text: String, color: UIColor = UIColor.white, global: Bool = true)
  {
    let formattedText = NSMutableAttributedString(string: text)
    formattedText.addAttributes(self.textAppearance, range: formattedText.range)
    formattedText.addAttribute(.foregroundColor, value: color, range: formattedText.range)
    self.print(formattedText, global: global)
  }
  
  /** Prints attributed text to the console. */
  public static func print(_ text: NSAttributedString, global: Bool = true)
  {
    defer
    {
      if global
      {
        Swift.print(text.string)
      }
    }
    
    guard let textView = self.shared.textView
    else
    {
      return
    }
    
    DispatchQueue.main.async
    {
      let timeStamped = NSMutableAttributedString(string: "\(self.shared.currentTimeStamp)")
      let range = NSRange(location: 0, length: timeStamped.length)
      timeStamped.addAttributes(self.textAppearance, range: range)
      
      timeStamped.append(text)
      timeStamped.append(.breakLine())
      
      let newText = NSMutableAttributedString(attributedString: textView.attributedText)
      newText.append(timeStamped)
      textView.attributedText = newText
      
      self.enforceLineLimit(
        textView: textView,
        maxLines: Console.maxLines
      )
      
      NotificationCenter.default.post(
        name: UITextView.textDidChangeNotification,
        object: textView
      )
      
      self.scrollToBottom()
    }
  }
  
  /** Scrolls the console to the bottom. */
  public static func scrollToBottom()
  {
    guard let textView = self.shared.textView,
          textView.boundsHeightLessThenContentSizeHeight()
    else
    {
      return
    }
    
    textView.layoutManager.ensureLayout(for: textView.textContainer)
    let offset = CGPoint(x: 0, y: (textView.contentSize.height - textView.frame.size.height))
    textView.setContentOffset(offset, animated: true)
  }
  
  /** Sets the console font. */
  public static func setFont(_ font: UIFont)
  {
    self.textFont = font
    self.refreshTextAppearance()
  }
  
  /** Sets the console font by name. */
  public static func setFont(name: String)
  {
    let fontSize = textFont.pointSize
    guard let font = UIFont(name: name, size: fontSize)
    else
    {
      return
    }
    
    self.setFont(font)
  }
  
  /** Sets the console font size. */
  public static func setFontSize(_ size: CGFloat)
  {
    let fontName = self.textFont.fontName
    
    if let font = UIFont(name: fontName, size: size)
    {
      self.setFont(font)
    }
  }
  
  /** Sets the console height. */
  public static func setHeight(height: CGFloat)
  {
    self.shared.consoleController.consoleHeight = height
  }
  
  /** Sets the root view controller. */
  public static func set(rootViewController: UIViewController)
  {
    self.shared.consoleController.rootViewController = rootViewController
  }
  
  /** Toggles the console window mode. */
  public static func toggleWindowMode()
  {
    DispatchQueue.main.async
    {
      self.shared.consoleController.toggleWindowMode()
    }
  }
  
  /** Prints an uncaught error message. */
  public static func uncaught(_ text: String)
  {
    self.print(text, color: UIColor.red)
  }
  
  /** Prints a warning message. */
  public static func warn(_ text: String)
  {
    self.print(text, color: UIColor.yellow)
  }
}

//=======================================================//

/** Internal extension adding helper utilities to NSAttributedString. */
internal extension NSAttributedString
{
  /** Creates a line break attributed string. */
  static func breakLine() -> NSAttributedString
  {
    return NSAttributedString(string: "\n")
  }
  
  /** Returns the full range of the string. */
  var range: NSRange
  {
    return NSRange(location: 0, length: self.length)
  }
}

//=======================================================//