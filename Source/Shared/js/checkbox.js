
///////////////////////////////////////////////////////////

/** Class representing the checkbox component. */
class _Checkbox_ extends Component
{
  #checked;
  #color;
  #errors;
  #inputId;
  #onChange;

  /**
   * Creates the checkbox object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {})
  {
    super({ tagName: 'ons-checkbox', options: options });

    this.#errors = 
    {
      checkedTypeError : 'Checkbox Error: Expected type boolean for checked.',
      colorInvalidError: 'Checkbox Error: Invalid color value for color.',
      colorTypeError: 'Checkbox Error: Expected type string for color.',
      inputIdTypeError: 'Checkbox Error: Expected type string for inputId.',
      onChangeTypeError: 'Checkbox Error: Expected type function for onChange.'
    }
    
    if(options.checked) this.checked = options.checked;
    if(options.color) this.color = options.color;
    if(options.inputId) this.inputId = options.inputId;
    if(options.onChange) this.onChange = options.onChange;
  }
  
  /* Private method to emit checkbox changes internally. */
  #emitChange()
  {
    let event = new Event('change', { bubbles: true });
    this.element.dispatchEvent(event);
  }
  
  /** 
   * Get property to return the checked value of the checkbox.
   * @return {boolean} The checked value of the checkbox. 
   */
  get checked() 
  { 
    return this.#checked; 
  }
  
  /** 
   * Set property to set the checked value of the checkbox.
   * @param {string} value - The checked value of the checkbox.
   */
  set checked(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) 
    {
      console.error(this.#errors.checkedTypeError);
      return;
    }
    if(value == true) this.check();
    else this.uncheck();
  }
  
  /** 
   * Get property to return the color of the checkbox.
   * @return {boolean} The color value of the checkbox. 
   */
  get color() 
  { 
    return this.#color; 
  }
  
  /** 
   * Set property to set the color value of the checkbox.
   * @param {string} value - The color value of the checkbox.
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
    this.element.style.setProperty("--background-color--before--checkbox", value);
    this.#color = value;
  }
  
  /** 
   * Get property to return the inputId value of the checkbox.
   * @return {string} The inputId value of the checkbox. 
   */
  get inputId()
  {
    return this.#inputId;
  }
  
  /** 
   * Set property to set the inputId value of the checkbox.
   * @param {string} value - The inputId value of the checkbox.
   */
  set inputId(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.inputIdTypeError);
      return;
    }
    this.setAttribute({ key: 'input-id', value: value });
    this.#inputId = value;
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
   * @param {function} value - The function being called during on change events. Returns the state of the checkbox.
   */
  set onChange(value)
  {
    if(!typechecker.check({ type: 'function', value: value })) 
    {
      console.error(this.#errors.onChangeTypeError);
      return;
    }
  
    if(this.#onChange) this.removeEventListener({ event: 'change', handler: this.#onChange });
    let handler = (event) => value(event.target.checked);
  
    this.#onChange = handler;
    this.addEventListener({ event: 'change', handler: handler });
  }
  
  /* Public method to turn the checkbox on. */
  check(tap = false) 
  { 
    this.setAttribute({ key: 'checked', value: '' });
    this.#checked = true;
    if(tap == false) this.#emitChange();
  }

  /* Public method to turn the checkbox off. */
  uncheck(tap = false) 
  { 
    this.removeAttribute({ key: 'checked' });
    this.#checked = false;
    if(tap == false) this.#emitChange();
  }

  /* Public method to toggle the state of the checkbox. */
  toggle(tap = false) 
  {
    if(this.#checked == true) this.uncheck(tap);
    else this.check(tap);
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'checkbox', constructor: _Checkbox_ });

///////////////////////////////////////////////////////////
