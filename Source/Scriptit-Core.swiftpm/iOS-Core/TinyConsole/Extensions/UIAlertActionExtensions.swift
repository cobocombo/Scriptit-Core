//=======================================================//

import MessageUI

//=======================================================//

/** Internal extension adding reusable UIAlertAction helpers. */
internal extension UIAlertAction
{
  static let cancel: UIAlertAction =
  {
    return UIAlertAction(
      title: "Cancel",
      style: .cancel,
      handler: nil
    );
  }();
  
  static let clear: UIAlertAction =
  {
    return UIAlertAction(
      title: "Clear",
      style: .destructive
    )
    {
      (_: UIAlertAction) in
      TinyConsole.clear();
    };
  }();
  
  /** Static method to create the Add Log action. */
  static func okAddLog(with alert: UIAlertController) -> UIAlertAction
  {
    return UIAlertAction(
      title: "Add Log",
      style: .default
    )
    {
      (_: UIAlertAction) in
      
      guard let text = alert.textFields?.first?.text,
            !text.isEmpty
      else
      {
        return;
      }
      
      TinyConsole.print(text);
    };
  }
  
  /** Static method to create a standard OK action. */
  static func ok() -> UIAlertAction
  {
    return UIAlertAction(
      title: "OK",
      style: .default,
      handler: nil
    );
  }
}

//=======================================================//

internal extension UIAlertAction
{
  typealias MailInitiator =
    UIViewController &
    MFMailComposeViewControllerDelegate;
  
  /** Static method to create the Send Email action. */
  static func sendMail(on viewController: MailInitiator) -> UIAlertAction
  {
    return UIAlertAction(
      title: "Send Email",
      style: .default
    )
    {
      (_: UIAlertAction) in
      
      DispatchQueue.main.async
      {
        guard let text = TinyConsole.shared.textView?.text
        else
        {
          return;
        }
        
        if(MFMailComposeViewController.canSendMail())
        {
          let composeViewController =
            MFMailComposeViewController();
          
          composeViewController.mailComposeDelegate =
            viewController;
          
          composeViewController.setSubject("Console Log");
          composeViewController.setMessageBody(
            text,
            isHTML: false
          );
          
          viewController.present(
            composeViewController,
            animated: true,
            completion: nil
          );
        }
        else
        {
          let alert = UIAlertController(
            title: "Email account required",
            message: "Please configure an email account in Mail",
            preferredStyle: .alert
          );
          
          alert.addAction(UIAlertAction.ok());
          
          viewController.present(
            alert,
            animated: true,
            completion: nil
          );
        }
      }
    };
  }
}

//=======================================================//