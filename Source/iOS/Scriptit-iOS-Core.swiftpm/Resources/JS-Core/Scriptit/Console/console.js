///////////////////////////////////////////////////////////
// CONSOLE MODULE
///////////////////////////////////////////////////////////

/** Singleton class representing the main consoleManager object. */
class ConsoleManager
{
  #errors;
  #font;
  #fonts;
  #fontSize;
  #height;
  #originalConsole;
  #windowMode;
  static #instance = null;

  /** Creates the consoleManager object. **/
  constructor() 
  {
    this.#errors = 
    {
      fontTypeError: 'Console Error: Expected type string for font.',
      fontSizeTypeError: 'Console Error: Expected type number for fontSize',
      fontSizeRangeError: 'Console Error: Expected type number for fontSize within range 10-18.',
      heightTypeError: 'Console Error: Expected type number for height.',
      heightRangeError: 'Console Error: Expected type number for height within range 0-500.',
      invalidFontError: (font) => `Console Error: Font ${font} provided is invalid.`,
      singleInstanceError: 'Console Error: Only one ConsoleManager object can exist at a time.'
    };

    if(ConsoleManager.#instance) console.error(this.#errors.singleInstanceError);
    else ConsoleManager.#instance = this;
    
    this.#fonts = 
    {
      systemMono: 'systemMono',
      menlo: 'Menlo',
      courier: 'Courier'
    };
    
    this.#height = 200;
    this.#originalConsole = 
    {
      log: console.log,
      warn: console.warn,
      error: console.error,
      debug: console.debug
    };
    this.#windowMode = 'closed';

    this.#override();
    this.#setupErrorListener();
    
    this.#font = this.#fonts.systemMono;
    this.#fontSize = 12;
  }
  
  /** Private method to override the original javascript console to send messages to iOS.*/
  #override()
  {
    console.clear = () => { this.clear(); }
    console.close = () => { this.close(); }
    console.debug = (...args) => 
    {
      this.debug(...args);
      this.#originalConsole.debug(...args);
    };
    console.error = (...args) => 
    {
      this.error(...args);
      this.#originalConsole.error(...args);
    };
    console.fullscreen = () => { this.fullscreen(); }
    Object.defineProperty(console, 'height',
    {
      get:() =>
      {
        return this.height;
      },
      set:(value) =>
      {
        this.height = value;
      },
      configurable: true
    });
    Object.defineProperty(console, 'font',
    {
      get:() =>
      {
        return this.font;
      },
      set:(value) =>
      {
        this.font = value;
      },
      configurable: true
    });
    Object.defineProperty(console, 'fonts',
    {
      get: () =>
      {
        return this.fonts;
      },
      configurable: true
    });
    Object.defineProperty(console, 'fontSize',
    {
      get:() =>
      {
        return this.fontSize;
      },
      set:(value) =>
      {
        this.fontSize = value;
      },
      configurable: true
    });
    console.log = (...args) => 
    {
      this.log(...args);
      this.#originalConsole.log(...args);
    };
    console.open = () => { this.open(); }
    console.toggle = () =>  { this.toggle(); };
    console.warn = (...args) => 
    {
      this.warn(...args);
      this.#originalConsole.warn(...args);
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
  
  /** 
   * Get property to return the console font value.
   * @return {string} The console font value.
   */
  get font()
  {
    return this.#font;
  }
  
  /** 
   * Set property to set the console font value.
   * @param {string} value - The console font value.
   */
  set font(value)
  {
    if(window.webkit?.messageHandlers?.consoleMessageManager) 
    {
      if(!typechecker.check({ type: 'string', value: value }))
      {
        console.error(this.#errors.fontTypeError);
        return;
      }
      
      if(!Object.values(this.#fonts).includes(value))
      {
        console.error(this.#errors.invalidFontError(value));
        return;
      }
      
      window.webkit.messageHandlers.consoleMessageManager.postMessage({ command: 'font', value: value });
      this.#font = value;
    }
  }
  
  /** 
   * Get property to return the console's supported fonts.
   * @return {Object} The console's supported fonts.
   */
  get fonts()
  {
    return this.#fonts;
  }
  
  /** 
   * Get property to return the console's current font size.
   * @return {Number} The console's current font size.
   */
  get fontSize()
  {
    return this.#fontSize;
  }
  
  /** 
   * Set property to set the editor's font size.
   * @param {Number} value - Font size in pixels.
   */
  set fontSize(value)
  {
    if(window.webkit?.messageHandlers?.consoleMessageManager) 
    {
      if(!typechecker.check({ type: 'number', value: value }))
      {
        console.error(this.#errors.fontSizeTypeError);
        return;
      }
      
      if(!validator.isNumberInRange({ number: value, min: 10, max: 18 }))
      {
        console.error(this.#errors.fontSizeRangeError);
        return;
      }
    
      if(this.#fontSize === value) return;
      window.webkit.messageHandlers.consoleMessageManager.postMessage({ command: 'fontSize', value: value });
      this.#fontSize = value;
    }
  }
  
  /** 
   * Get property to return the console height value.
   * @return {number} The console height value.
   */
  get height()
  {
    return this.#height;
  }
  
  /** 
   * Set property to set the console height value.
   * @param {number} value - The console height value. Only accepts a value from 0-500 for now.
   */
  set height(value)
  {
    if(window.webkit?.messageHandlers?.consoleMessageManager) 
    {
      if(!typechecker.check({ type: 'number', value: value }))
      {
        console.error(this.#errors.heightTypeError);
        return;
      }
      
      if(!validator.isNumberInRange({ number: value, min: 0, max: 500 }))
      {
        console.error(this.#errors.heightRangeError);
        return;
      }
      
      window.webkit.messageHandlers.consoleMessageManager.postMessage({ command: 'height', value: value });
      this.#height = value;
    }
  }
  
  /** Public method to clear the console window. */
  clear()
  {
    if(window.webkit?.messageHandlers?.consoleMessageManager) 
    {
      window.webkit.messageHandlers.consoleMessageManager.postMessage({ command: 'clear' });
    }
  }
  
  /** Public method to close the console window. */
  close()
  {
    if(window.webkit?.messageHandlers?.consoleMessageManager) 
    {
      if(this.#windowMode === 'closed') { return; }
      else 
      { 
        window.webkit.messageHandlers.consoleMessageManager.postMessage({ command: 'toggle' });
        this.#windowMode = 'closed'; 
      }  
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
  
  /** Public method to set the console window to fullscreen. */
  fullscreen()
  {
    if(window.webkit?.messageHandlers?.consoleMessageManager) 
    {
      window.webkit.messageHandlers.consoleMessageManager.postMessage({ command: 'fullscreen' });
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
  
  /** Public method to open the console window. */
  open()
  {
    if(window.webkit?.messageHandlers?.consoleMessageManager) 
    {
      if(this.#windowMode === 'open') { return; }
      else 
      { 
        window.webkit.messageHandlers.consoleMessageManager.postMessage({ command: 'toggle' });
        this.#windowMode = 'open'; 
      }  
    } 
  }
  
  /** Public method to toggle the console window open or closed. */
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