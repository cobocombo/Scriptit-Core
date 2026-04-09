///////////////////////////////////////////////////////////

/** Class representing the action sheet button component. */
class _ActionSheetButton_ extends Component 
{
  #errors;

  /**
   * Creates the action sheet button object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: "ons-action-sheet-button", options: options });

    this.#errors = 
    {
      fontTypeError: 'Action Sheet Button Error: Expected type string for font.',
      textColorInvalidError: 'Action Sheet Button Error: Invalid color value provided for text color.',
      textColorTypeError: 'Action Sheet Button Error: Expected type string for text color.',
      textTypeError: 'Action Sheet Button Error: Expected type string for text.',
    };

    this.font = options.font || font.library.system;
    this.text = options.text || '';
    this.textColor = options.textColor || '#0076ff';
  }
  
  /** 
   * Get property to return the font value of the action sheet button object.
   * @return {string} The font value of action sheet button object. 
   */
  get font() 
  { 
    return this.style.fontFamily; 
  }
  
  /** 
   * Set property to set the font value of the action sheet button object.
   * @param {string} value - The font value of the the action sheet button object.
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
    this.element.textContent = value;
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
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'action-sheet-button', constructor: _ActionSheetButton_ });

///////////////////////////////////////////////////////////