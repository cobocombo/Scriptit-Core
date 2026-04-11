///////////////////////////////////////////////////////////
// CONSOLE MODULE
///////////////////////////////////////////////////////////

/** Singleton class representing the main consoleManager object. */
class ConsoleManager
{
  #errors;
  #originalConsole;
  #writeToTempFile;
  static #instance = null;

  /** Creates the consoleManager object. **/
  constructor() 
  {
    this.#errors = 
    {
      singleInstanceError: 'Console Manager Error: Only one ConsoleManager object can exist at a time.',
      postError: 'Console Manager Error: Could not post message to iOS.',
      writeToTempFileTypeError: 'Console Manager Error: Expected type boolean for writeToTempFile.'
    };

    if(ConsoleManager.#instance) console.error(this.#errors.singleInstanceError);
    else ConsoleManager.#instance = this;
    
    this.#writeToTempFile = false;

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

  /** Private method to post console.debug statements to iOS.*/
  #debug(...args)
  {
    this.#postToNative("🐞 ", "DEBUG", args);
  }

  /** Private method to post console.error statements to iOS.*/
  #error(...args)
  {
    this.#postToNative("❌ ", "ERROR", args);
  }

  /** Private method to post console.log statements to iOS.*/
  #log(...args)
  {
    this.#postToNative("📗 ", "LOG", args);
  }

  /** Private method to override the original javascript console to send messages to iOS.*/
  #override()
  {
    console.log = (...args) => 
    {
      this.#log(...args);
      this.#originalConsole.log(...args);
    };

    console.warn = (...args) => 
    {
      this.#warn(...args);
      this.#originalConsole.warn(...args);
    };

    console.error = (...args) => 
    {
      this.#error(...args);
      this.#originalConsole.error(...args);
    };

    console.debug = (...args) => 
    {
      this.#debug(...args);
      this.#originalConsole.debug(...args);
    };
  }

  /** Private method to post javascript messages to iOS.*/
  #postToNative(emoji, type, args) 
  {
    if(window.webkit?.messageHandlers?.consoleMessageManager) 
    {
      try 
      {
        let message = `${emoji} ${type}: ${Array.from(args)
          .map(v =>
            typeof v === "undefined" ? "undefined" :
            typeof v === "object" ? JSON.stringify(v) :
            v.toString()
          )
          .map(v => v.substring(0, 3000))
          .join(", ")}`;

        window.webkit.messageHandlers.consoleMessageManager.postMessage(message);
        
        if(this.writeToTempFile === true)
        {
          files.getFile({ root: files.roots.temporary, subpath: 'console.txt' })
          .then(file => 
          {
            files.writeToFile({ root: file.root, subpath: file.relativePath, content: message });
          })
        }
      } 
      catch(err) { this.#originalConsole.error(this.#errors.postError, err); }
    }
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
    this.#postToNative("❌ ", "UNCAUGHT", [message]);
  }

  /** Private method to post console.warn statements to iOS. */
  #warn(...args)
  {
    this.#postToNative("⚠️ ", "WARNING", args);
  }

  /** Static method to return a new ConsoleManager instance. Allows for Singleton+Module pattern. */
  static getInstance() 
  {
    return new ConsoleManager();
  }
  
  /** 
   * Get property to get the write to temp file value.
   * @return {Boolean} The write to temp file value.
   */
  get writeToTempFile()
  {
    return this.#writeToTempFile;
  }
  
  /** 
   * Set property to set the write to temp file value.
   * @param {string} value - The write to temp file value.
   */
  set writeToTempFile(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) 
    {
      console.error(this.#errors.writeToTempFileTypeError);
      return;
    }
    
    this.#writeToTempFile = value;
  }
}

///////////////////////////////////////////////////////////

globalThis.consoleManager = ConsoleManager.getInstance();

///////////////////////////////////////////////////////////