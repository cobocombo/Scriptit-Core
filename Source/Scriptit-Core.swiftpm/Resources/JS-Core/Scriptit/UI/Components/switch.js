
///////////////////////////////////////////////////////////

/** Class representing the switch component. */
class _Switch_ extends Component 
{
  #checked;
  #errors;
  #onChange;
  #color;
  
  /**
   * Creates the switch object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'ons-switch', options: options });

    this.#errors = 
    {
      checkedTypeError : 'Switch Error: Expected type boolean for checked.',
      colorInvalidError: 'Switch Error: Invalid color value for color.',
      colorTypeError: 'Switch Error: Expected type string for color.',
      onChangeTypeError: 'Switch Error: Expected type function for onChange.'
    };
    
    this.checked = options.checked || false;
    this.color = options.color || '#44db5e';
    if(options.onChange) this.onChange = options.onChange;
    this.addEventListener({ event: 'click', handler: () => { this.toggle(true); } });
  }
  
  /* Private method to emit switch changes internally. */
  #emitChange()
  {
    let event = new Event('change', { bubbles: true });
    this.element.dispatchEvent(event);
  }
  
  /** 
   * Get property to return the checked value of the switch.
   * @return {boolean} The checked value of the switch. 
   */
  get checked() 
  { 
    return this.#checked; 
  }
  
  /** 
   * Set property to set the checked value of the switch.
   * @param {string} value - The checked value of the switch.
   */
  set checked(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) 
    {
      console.error(this.#errors.checkedTypeError);
      return;
    }
    if(value == true) this.on();
    else this.off();
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
   * @param {function} value - The function being called during on change events. Returns the state of the switch.
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
  
  /** 
   * Get property to return the color of the switch.
   * @return {string} The color of the switch. 
   */
  get color() 
  { 
    return this.#color; 
  }
  
  /** 
   * Set property to set the color of the switch.
   * @param {string} value - The color of the switch.
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
    this.element.style.setProperty("--switch-checked-background-color", value);
    this.element.style.setProperty("--switch-thumb-border-color-active", value);
    this.#color = value;
  }

  /* Public method to turn the switch on. */
  on(tap = false) 
  { 
    this.setAttribute({ key: 'checked', value: '' });
    this.#checked = true;
    if(tap == false) this.#emitChange();
  }

  /* Public method to turn the switch off. */
  off(tap = false) 
  { 
    this.removeAttribute({ key: 'checked' });
    this.#checked = false;
    if(tap == false) this.#emitChange();
  }

  /* Public method to toggle the state of the switch. */
  toggle(tap = false) 
  {
    if(this.#checked == true) this.off(tap);
    else this.on(tap);
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'switch', constructor: _Switch_ });

///////////////////////////////////////////////////////////
