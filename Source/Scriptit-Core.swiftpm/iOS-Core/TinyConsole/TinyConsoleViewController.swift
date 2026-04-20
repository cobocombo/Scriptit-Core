//=======================================================//

import UIKit
import MessageUI

//=======================================================//

/** Class representing the tiny console view controller object. */
class TinyConsoleViewController: UIViewController
{
  private let stackView: UIStackView =
  {
    let stackView = UIStackView();
    stackView.axis = .vertical;
    stackView.alignment = .fill;
    stackView.spacing = 4;
    return stackView;
  }();
  
  private let consoleTextView = UITextView.console;
  
  /** Method called when the main view is loaded in the controller. */
  open override func viewDidLoad()
  {
    super.viewDidLoad();
    
    TinyConsole.shared.textView = self.consoleTextView;
    
    self.view.addSubview(self.consoleTextView);
    self.view.addSubview(self.stackView);
    
    self.setupConstraints();
    self.setupButtons();
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
    
    self.stackView.translatesAutoresizingMaskIntoConstraints = false;
    
    self.stackView.topAnchor
      .constraint(equalTo: self.view.topAnchor, constant: 8)
      .isActive = true;
    
    self.view.safeAreaLayoutGuide.rightAnchor
      .constraint(equalTo: self.stackView.rightAnchor, constant: 8)
      .isActive = true;
  }
  
  /** Private method to setup action buttons. */
  private func setupButtons()
  {
    let closeButton = UIButton(type: .system);
    let image = UIImage(systemName: "xmark", withConfiguration: UIImage.SymbolConfiguration(pointSize: 14,weight: .bold));
    closeButton.setImage(image, for: .normal);
    closeButton.tintColor = UIColor.white;
    closeButton.addTarget(self, action: #selector(self.close(sender:)), for: .touchUpInside);
    closeButton.applyMiniStyle();
    self.stackView.addArrangedSubview(closeButton);
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
    self.contentEdgeInsets = UIEdgeInsets(top: 8, left: 8, bottom: 8,right: 8);
    self.backgroundColor = UIColor(white: 1.0, alpha: 0.1);
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
  }
  
  /** Method returning whether content height exceeds bounds height. */
  func boundsHeightLessThenContentSizeHeight() -> Bool
  {
    return self.bounds.height < self.contentSize.height;
  }
}

//=======================================================//