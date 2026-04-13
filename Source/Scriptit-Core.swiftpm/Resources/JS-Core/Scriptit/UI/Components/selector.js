
///////////////////////////////////////////////////////////

/** Class representing the selector component. */
class _Selector_ extends Component 
{
  #errors;
  #font;
  #onChange;
  #options;
  #underbar;

  /**
   * Creates the selector object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'ons-select', options: options });

    this.#errors = 
    {
      fontTypeError: 'Selector Error: Expected type string for font.',
      onChangeTypeError: 'Selector Error: Expected type function for onChange.',
      optionTypeError: 'Selector Error: Expected type string for option.',
      optionsTypeError: 'Selector Error: Expected type array for options.',
      selectedOptionTypeError: 'Selector Error: Expected type string for selected option.',
      selectedOptionNotFoundError: 'Selector Error: The desired selected option could not be found in the options array.',
      underbarTypeError: 'Selector Error: Expected type boolean for underbar.'
    };

    this.#options = [];
    this.font = options.font || font.library.system;
    if(options.options) this.options = options.options;
    if(options.onChange) this.onChange = options.onChange;
    if(options.selectedOption) this.selectedOption = options.selectedOption;
    if(options.underbar) this.underbar = options.underbar;
  }
  
  /** 
   * Get property to return the font value of the selector object.
   * @return {string} The font value of the selector object. 
   */
  get font() 
  { 
    return this.#font; 
  }
  
  /** 
   * Set property to set the font value of the selector object.
   * @param {string} value - The font value of the selector object.
   */
  set font(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.fontTypeError);
      return;
    }
    this.#font = value;
    this.options = this.#options;
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
    if(!typechecker.check({ type: 'function', value: value })) c
    {
      onsole.error(this.#errors.onChangeTypeError);
      return;
    }
    if(this.#onChange) this.removeEventListener({ event: 'change', handler: this.#onChange });

    let handler = (event) => 
    {
      let option = event.target.value;
      value(option);
    };

    this.#onChange = handler;
    this.addEventListener({ event: 'change', handler: handler });
  }
  
  /** 
   * Get property to return options of the selector.
   * @return {array} The options of the selector.
   */
  get options() 
  { 
    return this.#options; 
  }
  
  /** 
   * Set property to set the options of the selector.
   * @param {array} value - The sequence of strings with the titles of the selector's options.
   */
  set options(value) 
  {
    if(!typechecker.check({ type: 'array', value: value })) 
    {
      console.error(this.#errors.optionsTypeError);
      return;
    }

    this.element.innerHTML = '';
    this.#options = [];
    this.#options = value;
    let selectElement = document.createElement('select');
    this.#options.forEach((opt) => 
    {
      if(!typechecker.check({ type: 'string', value: opt })) 
      {
        console.error(this.#errors.optionTypeError);
        return;
      }
      let optionElement = document.createElement('option');
      optionElement.textContent = opt;
      optionElement.value = opt;
      selectElement.style.fontFamily = this.#font;
      selectElement.appendChild(optionElement);
    });
    this.element.appendChild(selectElement);
  }
  
  /** 
   * Get property to return the currently selected option of the selector.
   * @return {string} The currently selected option of the selector.
   */
  get selectedOption() 
  { 
    return this.element.value; 
  }

  /** 
   * Set property to set the selected option of the selector.
   * @param {string} value - The desired option to be selected in the selector. Throws an error if it is not in the set of current options.
   */
  set selectedOption(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.selectedOptionTypeError);
      return;
    }
    if(!this.#options.includes(value)) 
    {
      console.error(this.#errors.selectedOptionNotFoundError);
      return;
    }
    this.element.value = value;
  }

  /** 
   * Get property to return if the selector has an underbar underneath it or not.
   * @return {boolean} The selector's underbar value.
   */
  get underbar() 
  { 
    return this.#underbar; 
  }
  
  /** 
   * Set property to set if the selector should have an underbar underneath it or not.
   * @param {boolean} value - The selector's underbar value.
   */
  set underbar(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) c
    {
      onsole.error(this.#errors.underbarTypeError);
      return;
    }
    if(value == true) this.addModifier({ modifier: 'underbar' });
    else this.removeModifier({ modifier: 'underbar' });
    this.#underbar = value;
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'selector', constructor: _Selector_ });

///////////////////////////////////////////////////////////
