///////////////////////////////////////////////////////////
// HUD MODULE
///////////////////////////////////////////////////////////

/** Singleton class representing the main hud object. */
class HudManager
{
  #errors;
  static #instance = null;

  /** Creates the hud object. **/
  constructor() 
  {
    this.#errors = 
    {
      messageTypeError: 'Hud Manager Error: Expected type string for message. ',
      singleInstanceError: 'Hud Manager Error: Only one HudManager object can exist at a time.',
      timoeutTypeError: 'Hud Manager Error: Expected type number for timeout. ',
    };

    if(HudManager.#instance) console.error(this.#errors.singleInstanceError);
    else HudManager.#instance = this;
  }

  /** Static method to return a new HudManager instance. */
  static getInstance() 
  {
    return new HudManager();
  }

  /**
 * Internal helper to safely send commands to the native HUD.
 * @param {string} command - The HUD command (added, failed, loading, succeed)
 * @param {Object} [options={}] - Optional { message, timeout } object.
 */
  #send(command, options = {}) 
  {
    let payload = { command };
    if(options && typechecker.check({ type: 'object', value: options })) 
    {
      if(options.message !== undefined) 
      {
        if(!typechecker.check({ type: 'string', value: options.message })) 
        {
          console.error(this.#errors.messageTypeError);
          return;
        }
        payload.message = options.message;
      }
      
      options.timeout = 1500;
      
      if(options.timeout !== undefined) 
      {
        if(!typechecker.check({ type: 'number', value: options.timeout })) 
        {
          console.error(this.#errors.timeoutTypeError);
          return;
        }
  
        let convertedTimeout = Math.round((options.timeout / 1000) * 10) / 10;
        payload.timeout = convertedTimeout;
      }
    }
  
    window.webkit?.messageHandlers?.hudMessageManager?.postMessage(payload);
  }


  /**
   * Public method to show "added" HUD.
   * @param {Object} [options={}] - Optional { message, delay } object.
   */
  added(options = {}) 
  { 
    this.#send('added', options); 
  }
  
   
  /** Public method to dismiss the HUD manually. */
  dismiss()
  {
    window.webkit?.messageHandlers?.hudMessageManager?.postMessage({ command: 'dismiss' });
  }

  /**
   * Public method to show "failed" HUD.
   * @param {Object} [options={}] - Optional { message, delay } object.
   */
  failed(options = {}) 
  { 
    this.#send('failed', options); 
  }

  /**
   * Public method to show "loading" HUD.
   * @param {Object} [options={}] - Optional { message, delay } object.
   */
  loading(options = {}) 
  { 
    this.#send('loading', options); 
  }

  /**
   * Public method to show "success" HUD.
   * @param {Object} [options={}] - Optional { message, delay } object.
   */
  succeed(options = {}) 
  { 
    this.#send('succeed', options); 
  }
}

///////////////////////////////////////////////////////////

globalThis.hud = HudManager.getInstance();

///////////////////////////////////////////////////////////
