///////////////////////////////////////////////////////////
// CLIPBOARD MODULE
///////////////////////////////////////////////////////////

/** Singleton class representing the main clipboard object. */
class ClipboardManager 
{
  #errors;
  #text;
  static #instance = null;

  /** Creates the clipboard object. **/
  constructor() 
  {
    this.#errors = 
    {
      singleInstanceError: 'Clipboard Manager Error: Only one ClipboardManager object can exist at a time.',
      textTypeError: 'Clipboard Error: Expected type string for text.',
      clipboardEmptyError: 'Clipboard Error: Clipboard was empty or there was an issue retrieving the text.',
      clipboardUnavailableError: 'Clipboard API not available in this environment.'
    };

    if(ClipboardManager.#instance) 
    {
      console.error(this.#errors.singleInstanceError);
      return ClipboardManager.#instance;
    }

    ClipboardManager.#instance = this;
  }

  /** Static method to return a singleton instance */
  static getInstance() 
  {
    if(!ClipboardManager.#instance) 
    {
      ClipboardManager.#instance = new ClipboardManager();
    }
    return ClipboardManager.#instance;
  }

  /**
   * Public method to write text to the clipboard.
   * @param {string} value - Text to store in the clipboard.
   * @returns {Promise<void>}
   */
  write({ text = '' }) 
  {
    return new Promise((resolve, reject) => 
    {
      if(!typechecker.check({ type: 'string', value: text })) 
      {
        console.error(this.#errors.textTypeError);
        reject(this.#errors.textTypeError);
        return;
      }

      if(!navigator.clipboard) 
      {
        console.error(this.#errors.clipboardUnavailableError);
        reject(this.#errors.clipboardUnavailableError);
        return;
      }

      navigator.clipboard.writeText(text)
      .then(() => 
      {
        this.#text = text;
        resolve();
      })
      .catch(err => reject('Clipboard write failed: ' + err));
    });
  }

  /**
   * Public method to read text from the clipboard.
   * @returns {Promise<string>}
   */
  read() 
  {
    return new Promise((resolve, reject) => 
    {
      if(this.#text) { resolve(this.#text); }
      else 
      { 
        console.error(this.#errors.clipboardEmptyError);
        reject(this.#errors.clipboardEmptyError); 
        return;
      }
    });
  }
}

///////////////////////////////////////////////////////////

globalThis.clipboard = ClipboardManager.getInstance();

///////////////////////////////////////////////////////////
