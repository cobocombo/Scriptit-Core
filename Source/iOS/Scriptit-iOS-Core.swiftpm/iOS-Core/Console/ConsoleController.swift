//=======================================================//

import UIKit

//=======================================================//

/** Class representing the main tiny console controller object that wraps the root controller and the console controller. */
open class ConsoleController: UIViewController
{
  /** Enum representing the available console window modes. */
  public enum WindowMode
  {
    case collapsed
    case expanded
  }
  
  /** Property representing the root view controller. */
  var rootViewController: UIViewController
  {
    didSet
    {
      self.setupViewControllers();
      self.setupConstraints();
    }
  }
  
  /** Property representing the console height when expanded. */
  public var consoleHeight: CGFloat = 200
  {
    didSet
    {
      UIView.animate(withDuration: self.animationDuration)
      {
        self.updateHeightConstraint();
        self.view.layoutIfNeeded();
      }
    }
  }
  
  /** Property representing the current console window mode. */
  public var consoleWindowMode: WindowMode = .collapsed
  {
    didSet
    {
      self.updateHeightConstraint();
    }
  }
  
  private var animationDuration: Double = 0.25;
  private var consoleViewController: ConsoleViewController =
  {
    ConsoleViewController();
  }();
  private lazy var consoleViewHeightConstraint: NSLayoutConstraint? =
  {
    return self.consoleViewController.view.heightAnchor
      .constraint(equalToConstant: 0);
  }();

  /** Creates the tiny console controller object. */
  init()
  {
    self.rootViewController = UIViewController();
    super.init(nibName: nil, bundle: nil);
  }
  
  /** Required initializer for storyboard support. */
  public required init?(coder aDecoder: NSCoder)
  {
    assertionFailure("Interface Builder is not supported");
    self.rootViewController = UIViewController();
    super.init(coder: aDecoder);
  }
  
  /** Private method to setup layout constraints. */
  private func setupConstraints()
  {
    self.rootViewController.view.attach(anchor: .top, to: self.view);
    
    self.consoleViewController.view.attach(anchor: .bottom, to: self.view);
    self.consoleViewHeightConstraint?.isActive = true;
    
    self.rootViewController.view.bottomAnchor
      .constraint(equalTo: self.consoleViewController.view.topAnchor)
      .isActive = true;
  }
  
  /** Private method to setup child view controllers. */
  private func setupViewControllers()
  {
    self.removeAllChildren();
    
    self.addChild(self.consoleViewController);
    self.view.addSubview(self.consoleViewController.view);
    self.consoleViewController.didMove(toParent: self);
    
    self.addChild(self.rootViewController);
    self.view.addSubview(self.rootViewController.view);
    self.rootViewController.didMove(toParent: self);
  }
  
  /** Private method to update the console height constraint. */
  private func updateHeightConstraint()
  {
    self.consoleViewHeightConstraint?.isActive = false;
    self.consoleViewHeightConstraint?.constant =
      self.consoleWindowMode == .collapsed ? 0 : self.consoleHeight;
    self.consoleViewHeightConstraint?.isActive = true;
  }
  
  /** Expands the console to fullscreen height. */
  internal func fullscreen()
  {
    let safeTop = self.view.safeAreaInsets.top;
    let safeBottom = self.view.safeAreaInsets.bottom;
    
    let availableHeight = self.view.bounds.height - safeTop - safeBottom;
    
    self.consoleHeight = availableHeight;
    self.consoleWindowMode = .expanded;
    
    UIView.animate(withDuration: self.animationDuration)
    {
      self.view.layoutIfNeeded();
    }
  }
  
  /** Called when the view finishes layout. Handles orientation changes. */
  open override func viewDidLayoutSubviews()
  {
    super.viewDidLayoutSubviews();
    
    if self.consoleWindowMode == .expanded
    {
      if self.consoleHeight > 500
      {
        self.fullscreen();
      }
    }
  }
  
  /** Called when the main view is loaded. */
  open override func viewDidLoad()
  {
    super.viewDidLoad();
    self.setupViewControllers();
    self.setupConstraints();
  }
  
  /** Toggles the console window between collapsed and expanded. */
  internal func toggleWindowMode()
  {
    self.consoleWindowMode = self.consoleWindowMode == .collapsed ? .expanded : .collapsed;
    UIView.animate(withDuration: self.animationDuration)
    {
      self.view.layoutIfNeeded();
    }
  }
}

//=======================================================//

/** Internal extension adding helper utilities to UIViewController. */
internal extension UIViewController
{
  /** Removes all child view controllers and subviews. */
  func removeAllChildren()
  {
    self.children.forEach
    {
      $0.willMove(toParent: nil);
    };
    
    for subview in self.view.subviews
    {
      subview.removeFromSuperview();
    }
    
    self.children.forEach
    {
      $0.removeFromParent();
    };
  }
}

//=======================================================//

/** Internal extension adding layout helper utilities to UIView. */
internal extension UIView
{
  enum Anchor
  {
    case top
    case bottom
  }
  
  /** Attaches the view to another view using the selected anchor. */
  func attach(anchor: Anchor, to view: UIView)
  {
    self.translatesAutoresizingMaskIntoConstraints = false;
    
    switch(anchor)
    {
      case .top:
        self.topAnchor
          .constraint(equalTo: view.topAnchor)
          .isActive = true;
      case .bottom:
        self.bottomAnchor
          .constraint(equalTo: view.bottomAnchor)
          .isActive = true;
    }
    
    self.leftAnchor
      .constraint(equalTo: view.leftAnchor)
      .isActive = true;
    self.rightAnchor
      .constraint(equalTo: view.rightAnchor)
      .isActive = true;
  }
}

//=======================================================//