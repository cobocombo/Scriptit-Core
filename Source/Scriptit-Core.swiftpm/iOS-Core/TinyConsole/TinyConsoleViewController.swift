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
    customTextButton.setTitle("Text", for: .normal);
    customTextButton.addTarget(
      self,
      action: #selector(self.customText(sender:)),
      for: .touchUpInside
    );
    customTextButton.applyMiniStyle();
    self.stackView.addArrangedSubview(customTextButton);
    
    let lineButton = UIButton(type: .system);
    lineButton.setTitle("Line", for: .normal);
    lineButton.addTarget(
      self,
      action: #selector(self.addLine(sender:)),
      for: .touchUpInside
    );
    lineButton.applyMiniStyle();
    self.stackView.addArrangedSubview(lineButton);
    
    let moreButton = UIButton(type: .system);
    moreButton.setTitle("More", for: .normal);
    moreButton.addTarget(
      self,
      action: #selector(self.additionalActions(sender:)),
      for: .touchUpInside
    );
    moreButton.applyMiniStyle();
    self.stackView.addArrangedSubview(moreButton);
  }
  
  /** Method called to show custom text prompt. */
  @objc func customText(sender: AnyObject)
  {
    let alert = UIAlertController(
      title: "Custom Log",
      message: "Enter text you want to log.",
      preferredStyle: .alert
    );
    
    alert.addTextField
    {
      $0.keyboardType = .default;
    }
    
    alert.addAction(.okAddLog(with: alert));
    alert.addAction(.cancel);
    
    self.present(alert, animated: true, completion: nil);
  }
  
  /** Method called to show additional console actions. */
  @objc func additionalActions(sender: AnyObject)
  {
    let alert = UIAlertController(
      title: nil,
      message: nil,
      preferredStyle: .actionSheet
    );
    
    alert.addAction(.sendMail(on: self));
    alert.addAction(.clear);
    alert.addAction(.cancel);
    
    self.present(alert, animated: true, completion: nil);
  }
  
  /** Method called to add a separator line. */
  @objc func addLine(sender: AnyObject)
  {
    TinyConsole.addLine();
  }
}

//=======================================================//

extension TinyConsoleViewController: MFMailComposeViewControllerDelegate
{
  /** Method called when the mail composer is dismissed. */
  func mailComposeController(
    _ controller: MFMailComposeViewController,
    didFinishWith result: MFMailComposeResult,
    error: Error?
  )
  {
    controller.dismiss(animated: true, completion: nil);
  }
}

//=======================================================//