
///////////////////////////////////////////////////////////

/** Class representing the list title component. */
class _ListTitle_ extends Component 
{
  #errors;

  /**
   * Creates the list title object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'ons-list-title', options: options });

    this.#errors = 
    { 
      fontTypeError: 'List Title Error: Expected type string for font.',
      textTypeError: 'List Title Error: Expected type string for text.' 
    };
    
    this.font = options.font || font.library.system;
    if(options.text) this.text = options.text;
  }
  
  /** 
   * Get property to return the font value of the list title object.
   * @return {string} The font value of the list title object. 
   */
  get font() 
  { 
    return this.style.fontFamily; 
  }
  
  /** 
   * Set property to set the font value of the list title object.
   * @param {string} value - The font value of the list title object.
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
   * Get property to return the list title's text value.
   * @return {string} The list title's text value.
   */
  get text() 
  { 
    return this.element.textContent; 
  }

  /** 
   * Set property to change the list title's text value.
   * @param {string} value - The list title's text value.
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

typechecker.register({ name: 'list-title', constructor: _ListTitle_ });   

///////////////////////////////////////////////////////////