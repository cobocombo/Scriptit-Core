
///////////////////////////////////////////////////////////

/** Class representing the circular progress component. */
class _CircularProgress_ extends Component
{
  #errors;
  #color;
  #indeterminate;
  #progress;
  #secondaryColor;
  #secondaryProgress;
  #size;
  
  /**
   * Creates the back button object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {})
  {
    super({ tagName: 'ons-progress-circular', options: options });

    this.#errors =
    {
      indeterminateTypeError: 'Circular Progress Error: Expected type boolean for indeterminate.',
      colorTypeError: 'Circular Progress Error: Expected type string for color.',
      colorInvalidError: 'Circular Progress Error: Invalid color value provided for color.',
      progressTypeError: 'Circular Progress Error: Expected type number for progress.',
      progressValueInvalidError: 'Circular Progress Error: Expected number between 0 and 100.',
      secondaryColorTypeError: 'Circular Progress Error: Expected type string for secondaryColor.',
      secondaryColorInvalidError: 'Circular Progress Error: Invalid color value provided for secondaryColor.',
      secondaryProgressTypeError: 'Circular Progress Error: Expected type number for secondary progress.',
      sizeTypeError: 'Circular Progress Error: Expected type string for size.'
    }

    this.indeterminate = options.indeterminate || false;
    this.progress = options.progress || 0;
    this.secondaryProgress = options.secondaryProgress || 0;
    this.size = options.size || '32px';
    this.color = options.color || '#1f8dd6';
    this.secondaryColor = options.secondaryColor || '#65adff';
  }

  /** 
   * Get property to return the color of the circular progress.
   * @return {string} The color of the circular progress.
   */
  get color() 
  { 
    return this.#color; 
  }
  
  /** 
   * Set property to set the color of the circular progress.
   * @param {string} value - The color of the circular progress.
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
    this.style.setProperty('--progress-circle-primary-color', value);
    this.#color = value;
  }
  
  /** 
   * Get property to return the indeterminate status of the circular progress.
   * @return {boolean} The indeterminate status of the circular progress.
   */
  get indeterminate() 
  { 
    return this.#indeterminate; 
  }
  
  /** 
   * Set property to set the indeterminate status of the circular progress.
   * @param {boolean} value - The indeterminate status of the circular progress.
   */
  set indeterminate(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) 
    {
      console.error(this.#errors.indeterminateTypeError);
      return;
    }
    if(value == true) this.setAttribute({ key: 'indeterminate', value: '' });
    else this.removeAttribute({ key: 'indeterminate' });
    this.#indeterminate = value;
  }
  
  /** 
   * Get property to return the progress value of the circular progress.
   * @return {number} The progress value of the circular progress.
   */
  get progress() 
  { 
    return this.#progress; 
  }

  /** 
   * Set property to set the progress value of the circular progress.
   * @param {number} value - The progress value of the circular progress.
   */
  set progress(value) 
  { 
    if(!typechecker.check({ type: 'number', value: value })) 
    {
      console.error(this.#errors.progressTypeError);
      return;
    }
    if(value >= 0 && value <= 100)
    {
      this.setAttribute({ key: 'value', value: String(value) }); 
      this.#progress = value;
    }
    else console.error(this.#errors.progressValueInvalidError); 
  }

  /** 
   * Get property to return the secondary color of the circular progress.
   * @return {string} The secondary color of the circular progress.
   */
  get secondaryColor() 
  { 
    return this.#secondaryColor; 
  }
  
  /** 
   * Set property to set the secondary color of the circular progress.
   * @param {string} value - The secondary color of the circular progress.
   */
  set secondaryColor(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.secondaryColorTypeError);
      return;
    }
    if(!color.isValid({ color: value }))
    {
      console.error(this.#errors.secondaryColorInvalidError);
      return;
    }
    this.style.setProperty('--progress-circle-secondary-color', value);
    this.#secondaryColor = value;
  }

  /** 
   * Get property to return the secondary progress value of the circular progress.
   * @return {number} The secondary progress value of the circular progress.
   */
  get secondaryProgress() 
  { 
    return this.#secondaryProgress; 
  }

  /** 
   * Set property to set the secondary progress value of the circular progress.
   * @param {number} value - The secondary progress value of the circular progress.
   */
  set secondaryProgress(value) 
  { 
    if(!typechecker.check({ type: 'number', value: value })) 
    {
      console.error(this.#errors.secondaryProgressTypeError);
      return;
    }
    if(value >= 0 && value <= 100)
    {
      this.setAttribute({ key: 'secondary-value', value: String(value) });
      this.#secondaryProgress = value;
    }
    else console.error(this.#errors.progressValueInvalidError);
  }
  
  /** 
   * Get property to return the size value of the circular progress.
   * @return {string} The size value of the circular progress.
   */
  get size() 
  { 
    return this.#size; 
  }
  
  /** 
   * Set property to set the size of the circular progress.
   * @param {string} value - The size of the circular progress.
   */
  set size(value)
  {
    if(!typechecker.check({ type: 'string', value: value }))
    {
      console.error(this.#errors.sizeTypeError);
      return;
    }
    this.width = value;
    this.height = value;
    this.#size = value;
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'circular-progress', constructor: _CircularProgress_ });

///////////////////////////////////////////////////////////
