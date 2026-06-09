///////////////////////////////////////////////////////////

/** Class representing the image component. */
class _Img_ extends Component
{
  #errors;

  /**
   * Creates the image object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {})
  {
    super({ tagName: 'img', options: options });

    this.#errors = 
    {
      altTypeError: 'Img Error: Expected type string for alt.',
      sourceTypeError: 'Img Error: Expected type string for source.'
    }
    
    if(options.alt) this.alt = options.alt;
    if(options.source) this.source = options.source;
  }
  
  /** 
   * Get property to return the image's alt value.
   * @return {string} The image's alt value.
   */
  get alt() 
  { 
    return this.getAttribute({ key: 'alt' }); 
  }
  
  /** 
   * Set property to set the image's alt value.
   * @param {string} value - The image's alt value.
   */
  set alt(value)
  {
    if(!typechecker.check({ type: 'string', value: value }))
    {
      console.error(this.#errors.altTypeError);
      return;
    }
    this.setAttribute({ key: 'alt', value: value });
  }

  /** 
   * Get property to return the image's source value.
   * @return {string} The image's source value.
   */
  get source() 
  { 
    return this.getAttribute({ key: 'src' }); 
  }

  /** 
   * Set property to set the image's source value.
   * @param {string} value - The image's source value.
   */
  set source(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.sourceTypeError);
      return;
    }
    this.setAttribute({ key: 'src', value: value });
  }  
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'img', constructor: _Img_ });

///////////////////////////////////////////////////////////
