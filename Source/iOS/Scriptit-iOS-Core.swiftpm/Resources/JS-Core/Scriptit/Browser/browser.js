///////////////////////////////////////////////////////////
// BROWSER MODULE
///////////////////////////////////////////////////////////

/** Singleton class representing the main BrowserManager object. */
class BrowserManager
{
  #errors;
  static #instance = null;

  /** Creates the browser object. **/
  constructor() 
  {
    this.#errors = 
    {
      animatedTypeError: 'Browser Error: Expected type boolean for animated.',
      inAppTypeError: 'Browser Error: Expected type boolean for inApp.',
      singleInstanceError: 'Browser Manager Error: Only one BrowserManager object can exist at a time.',
      urlInvalidError: 'Browser Error: Invalid url supplied, could not open.',
      urlTypeError: 'Browser Error: Expected type string for url.'
    };

    if(BrowserManager.#instance) console.error(this.#errors.singleInstanceError);
    else BrowserManager.#instance = this;
  }

  /** Static method to return a new BrowserManager instance. Allows for Singleton+Module pattern. */
  static getInstance() 
  {
    return new BrowserManager();
  }

  /** 
   * Public method to open a website url in safari, either within the app or outside in a seperate app.
   * @param {string} url - The url to be opened.
   * @param {boolean} inApp - Flag dictating if the the url should be opened inside or outside the current app.
   * @param {boolean} animated - If the url should be opened with animation or not. Only works when inApp is true.
   */
  open({ url, inApp = true, animated = true } = {})
  {
    if(!typechecker.check({ type: 'string', value: url })) console.error(this.#errors.urlTypeError);
    
    let normalizedURL = url.trim();
    if(!/^https?:\/\//i.test(normalizedURL)) { normalizedURL = `https://${normalizedURL}`; }
    if(!validator.isValidURL({ url: normalizedURL })) 
    {
      console.error(this.#errors.urlInvalidError);
      return;
    }
    
    if(!typechecker.check({ type: 'boolean', value: inApp })) console.error(this.#errors.inAppTypeError);
    if(!typechecker.check({ type: 'boolean', value: animated })) console.error(this.#errors.animatedTypeError);
    window.webkit.messageHandlers.browserMessageManager.postMessage({ url: url, inApp: inApp, animated: animated });
  }
}

///////////////////////////////////////////////////////////

globalThis.browser = BrowserManager.getInstance();

///////////////////////////////////////////////////////////