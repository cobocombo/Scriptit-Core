///////////////////////////////////////////////////////////

/** Class representing the BarBackButton component. */
class _BackBarButton_ extends Component 
{  
  #errors;

  /**
   * Creates the bar back button object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'ons-back-button', options: options });

    this.#errors = 
    {
      fontTypeError: 'Back Bar Button Error: Expected type string for font.',
      textColorInvalidError: 'Back Bar Button Error: Invalid color value provided for text color.',
      textColorTypeError: 'Back Bar Button Error: Expected type string for text color.',
      textTypeError: 'Back Bar Button Error: Expected type string for text.'
    }

    this.font = options.font || font.library.system;
    this.text = options.text || 'Back';
    if(options.textColor) this.textColor = options.textColor;
    this.style.paddingRight = '12px';
    this.style.paddingLeft = '12px'; 
  }
  
  /** 
   * Get property to return the font value of the back bar button object.
   * @return {string} The font value of back bar button object. 
   */
  get font() 
  { 
    return this.style.fontFamily; 
  }
  
  /** 
   * Set property to set the font value of the back bar button object.
   * @param {string} value - The font value of the the back bar button object.
   */
  set font(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.fontTypeError);
      return;
    }
    this.style.fontFamily = value;
  }
  
  /** 
   * Get property to return the button's text value.
   * @return {string} The button's text value.
   */
  get text()
  {
    return this.element.textContent;
  }
  
  /** 
   * Set property to set the button's text value.
   * @param {string} value - The button's text value.
   */
  set text(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.textTypeError);
      return; 
    }  
    if(this.element.querySelector(".back-button__label")) label.textContent = value;
    else this.element.textContent = value; 
  }
  
  /** 
   * Get property to return the button's text color value.
   * @return {string} The button's text color value.
   */
  get textColor()
  {
    return this.element.style.color;
  }
  
  /** 
   * Set property to set the button's text color value.
   * @param {string} value - The button's text color value. Will throw an error if the color value is not valid.
   */
  set textColor(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.textColorTypeError);
      return;
    }
    if(!color.isValid({ color: value })) 
    {
      console.error(this.#errors.textColorInvalidError);
      return;
    }

    this.element.style.color = value;
    requestAnimationFrame(() => 
    {
      let arrowIcon = this.element.querySelector(".back-button__icon");
      if(arrowIcon) arrowIcon.style.fill = value;
    });
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'back-bar-button', constructor: _BackBarButton_ });

///////////////////////////////////////////////////////////