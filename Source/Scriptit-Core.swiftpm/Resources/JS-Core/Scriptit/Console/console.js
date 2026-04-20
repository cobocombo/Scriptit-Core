///////////////////////////////////////////////////////////
// CONSOLE MODULE
///////////////////////////////////////////////////////////

/** Singleton class representing the main consoleManager object. */
class ConsoleManager
{
  #errors;
  #originalConsole;
  static #instance = null;

  /** Creates the consoleManager object. **/
  constructor() 
  {
    this.#errors = 
    {
      clearingTempError: 'Console Manager Error: Clearing the temp file is only available on iOS.',
      singleInstanceError: 'Console Manager Error: Only one ConsoleManager object can exist at a time.',
      postError: 'Console Manager Error: Could not post message to iOS.'
    };

    if(ConsoleManager.#instance) console.error(this.#errors.singleInstanceError);
    else ConsoleManager.#instance = this;

    this.#originalConsole = 
    {
      log: console.log,
      warn: console.warn,
      error: console.error,
      debug: console.debug
    };

    this.#override();
    this.#setupErrorListener();
  }
  
  /** Private method to override the original javascript console to send messages to iOS.*/
  #override()
  {
    console.clear = () => 
    {
      this.clear();
    };
    
    console.debug = (...args) => 
    {
      this.debug(...args);
      this.#originalConsole.debug(...args);
    };
    
    console.log = (...args) => 
    {
      this.log(...args);
      this.#originalConsole.log(...args);
    };

    console.warn = (...args) => 
    {
      this.warn(...args);
      this.#originalConsole.warn(...args);
    };

    console.error = (...args) => 
    {
      this.error(...args);
      this.#originalConsole.error(...args);
    };

    console.toggle = () => 
    {
      this.toggle();
    };
  }

  /** Private method to santize multiple messages arguments and combine them into one before sending to the applicable console method. */
  #sanitize(...args)
  {
    let message = `${Array.from(args)
      .map(v => 
        typeof v === "undefined" ? "undefined" : 
        typeof v === "object" ? JSON.stringify(v) : v.toString())
      .map(v => v.substring(0, 3000))
      .join(", ")}`;
    return message;
  }

  /** Private method to setup the uncaught error message event listener. */
  #setupErrorListener() 
  {
    window.addEventListener("error",(e) => 
    {
      let message = e.message;
      this.#uncaught(message);
    });
  }

  /** Private method to post uncaught error statements to iOS. */
  #uncaught(message)
  {
    if(window.webkit?.messageHandlers?.consoleMessageManager) 
    {
      window.webkit.messageHandlers.consoleMessageManager.postMessage({ command: 'uncaught', message: ' ' + message });
    }
  }

  /** Static method to return a new ConsoleManager instance. Allows for Singleton+Module pattern. */
  static getInstance() 
  {
    return new ConsoleManager();
  }
  
  /** Public method to clear the console window. */
  clear()
  {
    if(window.webkit?.messageHandlers?.consoleMessageManager) 
    {
      window.webkit.messageHandlers.consoleMessageManager.postMessage({ command: 'clear' });
    }
  }
  
  /** Public method to display a debug statement to the console. */
  debug(...args)
  {
    if(window.webkit?.messageHandlers?.consoleMessageManager) 
    {
      let message = this.#sanitize(...args);
      window.webkit.messageHandlers.consoleMessageManager.postMessage({ command: 'debug', message: ' ' + message });
    }
  }
  
  /** Public method to display an error statement to the console. */
  error(...args)
  {
    if(window.webkit?.messageHandlers?.consoleMessageManager) 
    {
      let message = this.#sanitize(...args);
      window.webkit.messageHandlers.consoleMessageManager.postMessage({ command: 'error', message: ' ' + message });
    }
  }
  
  /** Public method to display a log statement to the console. */
  log(...args)
  {
    if(window.webkit?.messageHandlers?.consoleMessageManager) 
    {
      let message = this.#sanitize(...args);
      window.webkit.messageHandlers.consoleMessageManager.postMessage({ command: 'log', message: ' ' + message });
    }
  }
  
  /** Public method to toggle the console window. */
  toggle()
  {
    if(window.webkit?.messageHandlers?.consoleMessageManager) 
    {
      window.webkit.messageHandlers.consoleMessageManager.postMessage({ command: 'toggle' });
    }
  }
  
  /** Public method to display a warn statement to the console. */
  warn(...args)
  {
    if(window.webkit?.messageHandlers?.consoleMessageManager) 
    {
      let message = this.#sanitize(...args);
      window.webkit.messageHandlers.consoleMessageManager.postMessage({ command: 'warn', message: ' ' + message });
    }
  }
}

///////////////////////////////////////////////////////////

globalThis.consoleManager = ConsoleManager.getInstance();

///////////////////////////////////////////////////////////