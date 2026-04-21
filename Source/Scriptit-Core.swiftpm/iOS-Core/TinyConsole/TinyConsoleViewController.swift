//=======================================================//

import UIKit
import MessageUI

//=======================================================//

/** Class representing the tiny console view controller object. */
class TinyConsoleViewController: UIViewController
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
  
  /** Method called when the main view is loaded in the controller. */
  open override func viewDidLoad()
  {
    super.viewDidLoad();
    
    TinyConsole.shared.textView = self.consoleTextView;
    
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
  
  deinit
  {
    NotificationCenter.default.removeObserver(self);
  }
  
  /** Private method to setup layout constraints. */
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
  
  /** Private method to setup action buttons. */
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
  
  /** Private method to update console UI state. */
  private func updateConsoleState()
  {
    let hasText = !(self.consoleTextView.text ?? "").isEmpty;
    
    self.emptyLabel.alpha = hasText ? 0.0 : 1.0;
    
    self.clearButton.tintColor = hasText
      ? UIColor.red
      : UIColor.systemRed.withAlphaComponent(0.35);
  }
  
  /** Method called to clear the console. */
  @objc func clear(sender: AnyObject)
  {
    let hasText = !(self.consoleTextView.text ?? "").isEmpty;
    
    if(!hasText)
    {
      return;
    }
    
    TinyConsole.clear();
    
    DispatchQueue.main.async
    {
      self.updateConsoleState();
    }
  }
  
  /** Method called when console text changes. */
  @objc func consoleTextDidChange()
  {
    self.updateConsoleState();
  }
  
  /** Method called to close the console. */
  @objc func close(sender: AnyObject)
  {
    TinyConsole.toggleWindowMode();
  }
}

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
    
    NotificationCenter.default.post(
      name: UITextView.textDidChangeNotification,
      object: self
    );
  }
  
  /** Method returning whether content height exceeds bounds height. */
  func boundsHeightLessThenContentSizeHeight() -> Bool
  {
    return self.bounds.height < self.contentSize.height;
  }
}

//=======================================================//