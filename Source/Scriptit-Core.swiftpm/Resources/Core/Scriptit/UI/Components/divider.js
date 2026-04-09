
///////////////////////////////////////////////////////////

/** Class representing the divider component. */
class _Divider_ extends Component
{
  #errors;
  
  /**
   * Creates the divider object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {})
  {
    super({ tagName: 'hr', options: options });
    
    this.#errors = 
    {
      colorInvalidError: 'Divider Error: Invalid color value provided for color.',
      colorTypeError: 'Divider Error: Expected type string for color.',
    };

    this.style.border = 'none';
    this.style.margin = '0';
    this.color = options.color || '#999';
    this.height = '2px';
  }

  /** 
   * Set property to set the divider's color value.
   * @param {string} value - The divider's icon color value. Will throw an error if the color value is not valid.
   */ 
  set color(value)
  {
    if(!typechecker.check({ type: 'string', value }))
    {
      console.error(this.#errors.colorTypeError);
      return;
    }
    if(!color.isValid({ color: value })) 
    {
      console.error(this.#errors.colorInvalidError);
      return;
    }
    this.style.backgroundColor = value;
  }

  /** 
   * Get property to return the divider's color value.
   * @return {string} The divider's color value.
   */
  get color()
  {
    return this.style.backgroundColor;
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'divider', constructor: _Divider_ });

///////////////////////////////////////////////////////////