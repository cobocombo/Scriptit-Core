
///////////////////////////////////////////////////////////

/** Class representing the color picker component. */
class _ColorPicker_ extends Component 
{
  #errors;
  #onChange;
  
  /**
   * Creates the color picker object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'input', options: options });
    this.setAttribute({ key: 'type', value: 'color' });

    this.#errors = 
    {
      colorInvalidError: 'Color Picker Error: Invalid color value provided for color. Must supply hex value.',
      colorTypeError: 'Color Picker Error: Expected type string for color.',
      onChangeTypeError: 'Color Picker Error: Expected type function for onChange.',
    }
    
    if(options.onChange) this.onChange = options.onChange;
    if(options.color) this.color = options.color;
  }
  
  /** 
   * Get property to return the function called with onChange events.
   * @return {function} The function called with onChange events.
   */
  get onChange() 
  { 
    return this.#onChange; 
  }

  /** 
   * Set property to set the function called with onChange events.
   * @param {function} value - The function called with onChange events.
   */
  set onChange(value)
  {
    if(!typechecker.check({ type: 'function', value: value })) 
    {
      console.error(this.#errors.onChangeTypeError);
      return;
    }

    if(this.#onChange) this.removeEventListener({ event: 'change', handler: this.#onChange });

    let handler = (input) => value(event.target.value);
    this.#onChange = handler;
    this.addEventListener({ event: 'change', handler });
  }

  /** 
   * Get property to return the color value of the picker.
   * @return {string} The color value of the picker.
   */
  get color() 
  { 
    return this.element.value; 
  }

  /** 
   * Set property to set the color value of the picker.
   * @param {string} value - The value of the color picker. Will throw an error if the color value is not valid.
   */
  set color(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.colorTypeError);
      return;
    }
    if(!color.isValid({ color: value })) 
    {
      console.error(this.#errors.colorInvalidError);
      return;
    }
    if(!color.isHexColor({ color: value }))
    {
      console.error(this.#errors.colorInvalidError);
      return;
    }
    this.element.value = value;
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'color-picker', constructor: _ColorPicker_ });

///////////////////////////////////////////////////////////