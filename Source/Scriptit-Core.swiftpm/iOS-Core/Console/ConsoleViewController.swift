//=======================================================//

import UIKit

//=======================================================//

/** Class representing the console view controller object. */
class ConsoleViewController: UIViewController
{
  private let consoleTextView = UITextView.console;
  private let closeButton = UIButton(type: .system);
  private let clearButton = UIButton(type: .system);
  private let emptyLabel: UILabel =
  {
    let label = UILabel();
    label.text = "Console empty";
    label.textColor = UIColor.white.withAlphaComponent(0.45);
    label.font = UIFont.systemFont(ofSize: 16, weight: .medium);
    label.textAlignment = .center;
    label.alpha = 1.0;
    return label;
  }();

  /** Initializes the view controller lifecycle. */
  open override func viewDidLoad()
  {
    super.viewDidLoad();
    
    Console.shared.textView = self.consoleTextView;
    
    self.view.addSubview(self.consoleTextView);
    self.view.addSubview(self.emptyLabel);
    self.view.addSubview(self.closeButton);
    self.view.addSubview(self.clearButton);
    
    self.setupConstraints();
    self.setupButtons();
    self.updateConsoleState();
    
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(self.consoleTextDidChange),
      name: UITextView.textDidChangeNotification,
      object: self.consoleTextView
    );
  }
  
  /** Cleans up observers on deallocation. */
  deinit
  {
    NotificationCenter.default.removeObserver(self);
  }
  
  /** Sets up layout constraints. */
  private func setupConstraints()
  {
    self.consoleTextView.translatesAutoresizingMaskIntoConstraints = false;
    self.consoleTextView.topAnchor
      .constraint(equalTo: self.view.topAnchor)
      .isActive = true;
    self.consoleTextView.leftAnchor
      .constraint(equalTo: self.view.safeAreaLayoutGuide.leftAnchor)
      .isActive = true;
    self.view.safeAreaLayoutGuide.rightAnchor
      .constraint(equalTo: self.consoleTextView.rightAnchor)
      .isActive = true;
    self.view.bottomAnchor
      .constraint(equalTo: self.consoleTextView.bottomAnchor)
      .isActive = true;
    self.emptyLabel.translatesAutoresizingMaskIntoConstraints = false;
    self.emptyLabel.centerXAnchor
      .constraint(equalTo: self.view.centerXAnchor)
      .isActive = true;
    self.emptyLabel.centerYAnchor
      .constraint(equalTo: self.view.centerYAnchor)
      .isActive = true;
    self.closeButton.translatesAutoresizingMaskIntoConstraints = false;
    self.closeButton.leftAnchor
      .constraint(equalTo: self.view.safeAreaLayoutGuide.leftAnchor, constant: 8)
      .isActive = true;
    self.view.safeAreaLayoutGuide.bottomAnchor
      .constraint(equalTo: self.closeButton.bottomAnchor, constant: 8)
      .isActive = true;
    self.clearButton.translatesAutoresizingMaskIntoConstraints = false;
    self.view.safeAreaLayoutGuide.rightAnchor
      .constraint(equalTo: self.clearButton.rightAnchor, constant: 8)
      .isActive = true;
    self.view.safeAreaLayoutGuide.bottomAnchor
      .constraint(equalTo: self.clearButton.bottomAnchor, constant: 8)
      .isActive = true;
  }
  
  /** Sets up button styles and actions. */
  private func setupButtons()
  {
    let closeImage = UIImage(
      systemName: "xmark",
      withConfiguration: UIImage.SymbolConfiguration(
        pointSize: 14,
        weight: .bold
      )
    );
    
    self.closeButton.setImage(closeImage, for: .normal);
    self.closeButton.tintColor = UIColor.white;
    self.closeButton.addTarget(
      self,
      action: #selector(self.close(sender:)),
      for: .touchUpInside
    );
    self.closeButton.applyMiniStyle();
    
    let clearImage = UIImage(
      systemName: "trash",
      withConfiguration: UIImage.SymbolConfiguration(
        pointSize: 14,
        weight: .bold
      )
    );
    
    self.clearButton.setImage(clearImage, for: .normal);
    self.clearButton.addTarget(
      self,
      action: #selector(self.clear(sender:)),
      for: .touchUpInside
    );
    self.clearButton.applyMiniStyle();
  }
  
  /** Updates UI based on console content state. */
  private func updateConsoleState()
  {
    let hasText = !(self.consoleTextView.text ?? "").isEmpty;
    self.emptyLabel.alpha = hasText ? 0.0 : 1.0;
    self.clearButton.tintColor = hasText
      ? UIColor.red
      : UIColor.systemRed.withAlphaComponent(0.35);
  }
  
  /** Clears the console if it has content. */
  @objc func clear(sender: AnyObject)
  {
    let hasText = !(self.consoleTextView.text ?? "").isEmpty;
    if(!hasText)
    {
      return;
    }
    
    Console.clear();
    DispatchQueue.main.async
    {
      self.updateConsoleState();
    }
  }
  
  /** Handles console text updates. */
  @objc func consoleTextDidChange()
  {
    self.updateConsoleState();
  }
  
  /** Closes the console view. */
  @objc func close(sender: AnyObject)
  {
    Console.toggleWindowMode();
  }
}

//=======================================================//

/** Internal extension adding styling helpers to UIButton. */
internal extension UIButton
{
  /** Applies the mini button style used in the console. */
  func applyMiniStyle()
  {
    var config = UIButton.Configuration.plain()
    
    config.contentInsets = NSDirectionalEdgeInsets(
      top: 8,
      leading: 8,
      bottom: 8,
      trailing: 8
    )
    
    config.background.backgroundColor = UIColor(white: 1.0, alpha: 0.1)
    config.background.cornerRadius = 4
    self.configuration = config
  }
}

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
  
  /** Clears the text view contents. */
  func clear()
  {
    self.text = "";
    
    NotificationCenter.default.post(
      name: UITextView.textDidChangeNotification,
      object: self
    );
  }
  
  /** Returns whether content height exceeds bounds height. */
  func boundsHeightLessThenContentSizeHeight() -> Bool
  {
    return self.bounds.height < self.contentSize.height;
  }
}

//=======================================================//
