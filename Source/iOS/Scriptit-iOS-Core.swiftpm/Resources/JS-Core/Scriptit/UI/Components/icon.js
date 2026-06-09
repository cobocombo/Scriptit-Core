
///////////////////////////////////////////////////////////

/** Class representing the icon component. */
class _Icon_ extends Component
{
  #errors;
  #icon;
  #size;
  #spin;
  
  /**
   * Creates the icon object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {})
  {
    super({ tagName: 'ons-icon', options: options });

    this.#errors = 
    {
      colorInvalidError: 'Icon Error: Invalid color value provided for color.',
      colorTypeError: 'Icon Error: Expected type string for color.',
      iconTypeError: 'Icon Error: Expected type string for icon.',
      sizeTypeError: 'Icon Error: Expected type string for size.',
      spinTypeError: 'Icon Error: Expected type boolean for spin.',
    }

    if(options.color) this.color = options.color;
    if(options.icon) this.icon = options.icon;
    if(options.size) this.size = options.size;
    this.spin = options.spin || false;
  }
  
  /** 
   * Get property to return the icon's icon value.
   * @return {string} The icon's icon value.
   */
  get icon() 
  { 
    return this.#icon; 
  }
  
  /** 
   * Set property to set the icon's icon value.
   * @param {string} value - The icon's icon value.
   */
  set icon(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.iconTypeError);
      return;
    }
    this.setAttribute({ key: 'icon', value: value });
    this.#icon = value;
  }
  
  /** 
   * Get property to return the icon's size value.
   * @return {string} The icon's size value.
   */
  get size() 
  { 
    return this.#size; 
  }
  
  /** 
   * Set property to set the icon's size value.
   * @param {string} value - The icon's size value.
   */
  set size(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.sizeTypeError);
      return;
    }
    this.setAttribute({ key: 'size', value: value });
    this.#size = value;
  }
  
  /** 
   * Get property to return the icon's spin value.
   * @return {boolean} The icon's spin value.
   */
  get spin() 
  { 
    return this.#spin; 
  }
  
  /** 
   * Set property to set the icon's spin value.
   * @param {boolean} value - The icon's spin value.
   */
  set spin(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value }))
    {
      console.error(this.#errors.spinTypeError);
      return;
    }
    if(value == true) this.setAttribute({ key: 'spin', value: '' });
    else this.removeAttribute({ key: 'spin' });
    this.#spin = value;
  }
  
  /** 
   * Get property to return the icon's color value.
   * @return {string} The icon's color value.
   */
  get color() 
  { 
    return this.element.style.color; 
  }
  
  /** 
   * Set property to set the icon's color value.
   * @param {string} value - The icon's color value. Will throw an error if the color value is not valid.
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
    this.element.style.color = value;
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'icon', constructor: _Icon_ });

///////////////////////////////////////////////////////////
