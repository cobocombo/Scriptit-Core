///////////////////////////////////////////////////////////

/** Class representing the Toast component. */
class _Toast_ extends Component
{
  #animation;
  #animationTypes;
  #dismissButton;
  #dismissIcon;
  #errors;
  #font;
  #messageElement;
  #timeout;

  /**
   * Creates the Toast object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'ons-toast', options: options });

    this.#animationTypes = 
    {
      ascend: 'ascend',
      lift: 'lift',
      fall: 'fall',
      fade: 'fade',
      none: 'none'
    };

    this.#errors = 
    {
      animationInvalidError: 'Toast Error: Invalid value provided for animation.',
      animationTypeError: 'Toast Error: Expected type string for animation.',
      dismissIconTypeError: 'Toast Error: Expected type string for dismissIcon.',
      fontTypeError: 'Toast Error: Expected type string for font.',
      messageTypeError: 'Toast Error: Expected type string for message.',
      timeoutTypeError: 'Toast Error: Expected type number for timeout.'
    };

    this.#messageElement = document.createElement('span');
    this.#dismissButton = document.createElement('button');
    this.#dismissButton.classList.add('toast-dismiss');

    this.element.appendChild(this.#messageElement);
    this.element.appendChild(this.#dismissButton);

    if(options.animation) this.animation = options.animation;
    if(options.dismissIcon) this.dismissIcon = options.dismissIcon;
    if(options.message) this.message = options.message;
    if(options.timeout) this.timeout = options.timeout;
    this.font = options.font || font.library.system;
  }

  /** 
   * Get property to return the animation type of the toast notification.
   * @return {string} The animation type of the toast notification.
   */
  get animation()
  {
    return this.#animation;
  }

  /** 
   * Set property to set the animation type of the toast notification.
   * @param {string} value - The animation type of the toast notification.
   */
  set animation(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.animationTypeError);
    if(!Object.values(this.#animationTypes).includes(value)) console.error(this.#errors.animationInvalidError);
    this.element.setAttribute('animation', value);
    this.#animation = value;
  }

  /** 
   * Get property to return the dismiss icon of the toast notification.
   * @return {string} The dismiss icon of the toast notification.
   */
  get dismissIcon()
  {
    return this.#dismissIcon;
  }

  /** 
   * Set property to set the dismiss icon of the toast notification.
   * @param {string} value - The dismiss icon of the toast notification.
   */
  set dismissIcon(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.dismissIconTypeError);
    if(this.#dismissIcon) this.#dismissButton.innerHTML = '';
    this.#dismissIcon = new ui.Icon({ icon: value, size: '22px' });
    this.#dismissButton.appendChild(this.#dismissIcon.element);
    this.#dismissButton.onclick = () => this.dismiss();
    this.#dismissIcon = value;
  }
  
  /** 
   * Get property to return the font value of the toast object.
   * @return {string} The font value of the toast object. 
   */
  get font() 
  { 
    return this.#font;
  }
  
  /** 
   * Set property to set the font value of the textfield object.
   * @param {string} value - The font value of the textfield object.
   */
  set font(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.fontTypeError); 
    setTimeout(() => 
    {
      let inner = this.element.querySelector('.toast__message');
      if(inner) inner.style.fontFamily = value;
      this.#font = value;
    },1);
  }

  /** 
   * Get property to return the message of the toast notification.
   * @return {string} The message of the toast notification.
   */
  get message()
  {
    return this.#messageElement.textContent;
  }

  /** 
   * Set property to set the message of the toast notification.
   * @param {string} value - The message of the toast notification.
   */
  set message(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.messageTypeError);  
    this.#messageElement.textContent = value;
  }

  /** 
   * Get property to return the timeout of the toast notification.
   * @return {number} The timeout of the toast notification.
   */
  get timeout()
  {
    return this.#timeout;
  }

  /** 
   * Set property to set the timeout of the toast notification in milliseconds.
   * @param {number} value - The timeout of the toast notification in milliseconds.
   */
  set timeout(value)
  {
    if(!typechecker.check({ type: 'number', value: value })) console.error(this.#errors.timeoutTypeError);
    this.#timeout = value;
  }
  
  /** Public method to present a toast notification. */
  present() 
  {
    document.body.appendChild(this.element);
    this.element.show();
    if(this.#timeout) setTimeout(() => this.dismiss(), this.#timeout);
  }
  
  /** Public method to dismiss a toast notification.*/
  dismiss()
  {
    this.element.hide();
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'toast', constructor: _Toast_ });

///////////////////////////////////////////////////////////
