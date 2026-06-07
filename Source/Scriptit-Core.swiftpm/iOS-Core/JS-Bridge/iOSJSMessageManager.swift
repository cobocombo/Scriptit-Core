//=======================================================//

import UIKit
import WebKit

//=======================================================//

/** Protocol representing what functionality a Javascript message manager should have. */
protocol JavascriptMessageManager
{
  func handleMessage(_ message: WKScriptMessage, webView: WKWebView)
}

//=======================================================//