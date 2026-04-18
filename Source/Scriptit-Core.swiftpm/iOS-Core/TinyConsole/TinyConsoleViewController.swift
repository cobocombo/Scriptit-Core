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
    let customTextButton = UIButton(type: .system);
    customTextButton.setTitle("Close", for: .normal);
    customTextButton.addTarget(self, action: #selector(self.customText(sender:)), for: .touchUpInside );
    customTextButton.applyMiniStyle();
    self.stackView.addArrangedSubview(customTextButton);
  }
  
  /** Method called to show custom text prompt. */
  @objc func customText(sender: AnyObject)
  {
    TinyConsole.toggleWindowMode();
  }
}

//=======================================================//