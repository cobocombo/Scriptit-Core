
///////////////////////////////////////////////////////////

/** Class representing the progress bar component. */
class _ProgressBar_ extends Component
{
  #errors;
  #indeterminate;
  #progress;
  #color;
  #secondaryProgress;
  #secondaryColor;
  
  /**
   * Creates the progress bar object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {})
  {
    super({ tagName: 'ons-progress-bar', options: options });

    this.#errors = 
    {
      indeterminateTypeError: 'Progress Bar Error: Expected type boolean for indeterminate.',
      colorInvalidError: 'Progress Bar Error: Invalid color value provided for color.',
      colorTypeError: 'Progress Bar Error: Expected type string for color.',
      progressTypeError: 'Progress Bar Error: Expected type number for progress.',
      progressValueInvalidError: 'Progress Bar Error: Expected number between 0 and 100.',
      secondaryColorInvalidError: 'Progress Bar Error: Invalid color value provided for secondary progress color.',
      secondaryColorTypeError: 'Progress Bar Error: Expected type string for secondary progress color.',
      secondaryProgressTypeError: 'Progress Bar Error: Expected type number for secondary progress.'
    };

    this.indeterminate = options.indeterminate || false;
    this.progress = options.progress || 0;
    this.secondaryProgress = options.secondaryProgress || 0;
    this.color = options.color || '#1f8dd6';
    this.secondaryColor = options.secondaryColor || '#65adff';
  }

  /** 
   * Get property to return the color of the progress bar.
   * @return {string} The color of the progress bar.
   */
  get color() 
  { 
    return this.#color; 
  }
  
  /** 
   * Set property to set the color of the progress bar.
   * @param {string} value - The color of the progress bar.
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
    this.style.setProperty('--progress-bar-color', value);
    this.#color = value;
  }
  
  /** 
   * Get property to return the indeterminate status of the progress bar.
   * @return {boolean} The indeterminate status of the progress bar.
   */
  get indeterminate() 
  { 
    return this.#indeterminate; 
  }
  
  /** 
   * Set property to set the indeterminate status of the progress bar.
   * @param {boolean} value - The indeterminate status of the progress bar.
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
   * Get property to return the progress value of the progress bar.
   * @return {number} The progress value of the progress bar.
   */
  get progress() 
  { 
    return this.#progress; 
  }

  /** 
   * Set property to set the progress value of the progress bar.
   * @param {number} value - The progress value of the progress bar.
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
    else 
    {
      console.error(this.#errors.progressValueInvalidError);
      return;
    }
  }

  /** 
   * Get property to return the secondary color of the progress bar.
   * @return {string} The secondary color of the progress bar.
   */
  get secondaryColor() 
  { 
    return this.#secondaryColor; 
  }
  
  /** 
   * Set property to set the secondary color of the progress bar.
   * @param {string} value - The secondary color of the progress bar.
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
    this.style.setProperty('--progress-bar-secondary-color', value);
    this.#secondaryColor = value;
  }

  /** 
   * Get property to return the secondary progress value of the progress bar.
   * @return {number} The secondary progress value of the progress bar.
   */
  get secondaryProgress() 
  { 
    return this.#secondaryProgress; 
  }

  /** 
   * Set property to set the secondary progress value of the progress bar.
   * @param {number} value - The secondary progress value of the progress bar.
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
    else 
    {
      console.error(this.#errors.progressValueInvalidError);
      return;
    }
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'progress-bar', constructor: _ProgressBar_ });

///////////////////////////////////////////////////////////
