
///////////////////////////////////////////////////////////

/** Class representing the slider component. */
class _Slider_ extends Component
{
  #errors;
  #max;
  #min;
  #step;
  #color;
  #onChange;

  /**
   * Creates the slider object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {})
  {
    super({ tagName: 'ons-range', options: options });

    this.#errors = 
    {
      colorInvalidError: 'Slider Error: Invalid color value provided for color.',
      colorTypeError: 'Slider Error: Expected type string for color.',
      onChangeTypeError: 'Slider Error: Expected type function for onChange.',
      maxTypeError: 'Slider Error: Expected type number for max.',
      minTypeError: 'Slider Error: Expected type number for min.',
      stepTypeError: 'Slider Error: Expected type number for step.',
      valueTypeError: 'Slider Error: Expected type number for value.'
    };
    
    this.max = options.max || 100;
    this.min = options.min || 0;
    this.step = options.step || 10;
    this.color = options.color || '#1f8dd6';

    if(options.onChange) this.onChange = options.onChange;
    if(options.value) this.value = options.value;
  }
  
  /** 
   * Get property to return the max value of the slider.
   * @return {number} The max value of the slider.
   */
  get max() 
  { 
    return this.#max; 
  }
  
  /** 
   * Set property to set the max value of the slider.
   * @param {number} value - The max value of the slider.
   */
  set max(value)
  {
    if(!typechecker.check({ type: 'number', value: value })) 
    {
      console.error(this.#errors.maxTypeError);
      return;
    }
    this.setAttribute({ key: 'max', value: String(value) });
    this.#max = value;
  }
  
  /** 
   * Get property to return the min value of the slider.
   * @return {number} The min value of the slider.
   */
  get min() 
  { 
    return this.#min; 
  }
  
  /** 
   * Set property to set the min value of the slider.
   * @param {number} value - The min value of the slider.
   */
  set min(value)
  {
    if(!typechecker.check({ type: 'number', value: value })) 
    {
      console.error(this.#errors.minTypeError);
      return;
    }
    this.setAttribute({ key: 'min', value: String(value) });
    this.#min = value;
  }
  
  /** 
   * Get property to return the function being called during on change events.
   * @return {function} The function being called during on change events.
   */
  get onChange() 
  { 
    return this.#onChange; 
  }

  /** 
   * Set property to set the function being called during on change events.
   * @param {function} value - The function being called during on change events. Returns the selected option.
   */
  set onChange(value)
  {
    if(!typechecker.check({ type: 'function', value: value })) 
    {
      console.error(this.#errors.onChangeTypeError);
      return;
    }
    if(this.#onChange) this.removeEventListener({ event: 'change', handler: this.#onChange });

    let handler = (event) => 
    {
      let val = event.target.value;
      value(val);
    };

    this.#onChange = handler;
    this.addEventListener({ event: 'change', handler: handler });
  }
  
  /** 
   * Get property to return the step value of the slider.
   * @return {number} The step value of the slider.
   */
  get step() 
  { 
    return this.#step; 
  }
  
  /** 
   * Set property to set the step value of the slider.
   * @param {number} value - The step value of the slider.
   */
  set step(value)
  {
    if(!typechecker.check({ type: 'number', value: value })) 
    {
      console.error(this.#errors.stepTypeError);
      return;
    }
    this.setAttribute({ key: 'step', value: String(value) });
    this.#step = value;
  }
  
  /** 
   * Get property to return the color of the slider.
   * @return {string} The color of the slider.
   */
  get color() 
  { 
    return this.#color; 
  }
  
  /** 
   * Set property to set the color of the slider.
   * @param {string} value - The color of the slider.
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
    this.element.style.setProperty('--range-track-background-color-active', value);
    this.#color = value;
  }

  /** 
   * Get property to return the current value of the slider.
   * @return {number} The current value of the slider.
   */
  get value() 
  { 
    return this.element.value; 
  }

  /** 
   * Set property to set the current value of the slider.
   * @param {number} value - The current value of the slider.
   */
  set value(value) 
  { 
    if(!typechecker.check({ type: 'number', value: value })) 
    {
      console.error(this.#errors.valueTypeError);
      return;
    }
    this.element.value = String(value); 
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'slider', constructor: _Slider_ });

///////////////////////////////////////////////////////////
