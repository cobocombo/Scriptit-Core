
///////////////////////////////////////////////////////////

/** Class representing the list header component. */
class _ListHeader_ extends Component 
{
  #errors;

  /**
   * Creates the list header object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'ons-list-header', options: options });

    this.#errors = 
    { 
      fontTypeError: 'List Header Error: Expected type string for font.',
      textTypeError: 'List Header Error: Expected type string for text.' 
    };
    
    this.font = options.font || font.library.system;
    if(options.text) this.text = options.text;
  }
  
  /** 
   * Get property to return the font value of the list header object.
   * @return {string} The font value of the list header object. 
   */
  get font() 
  { 
    return this.style.fontFamily; 
  }
  
  /** 
   * Set property to set the font value of the list header object.
   * @param {string} value - The font value of the list header object.
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
   * Get property to return the list header's text value.
   * @return {string} The list header's text value.
   */
  get text() 
  { 
    return this.element.textContent; 
  }

  /** 
   * Set property to change the list header's text value.
   * @param {string} value - The list header's text value.
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
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'list-header', constructor: _ListHeader_ });

///////////////////////////////////////////////////////////
