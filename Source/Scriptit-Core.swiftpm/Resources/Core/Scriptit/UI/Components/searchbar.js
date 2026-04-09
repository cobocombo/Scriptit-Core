
///////////////////////////////////////////////////////////

/** Class representing the search bar component. */
class _Searchbar_ extends Component 
{
  #autocapitalize;
  #errors;
  #font;
  #maxLength;
  #onChange;
  #onTextChange;
  #placeholder;
  #spellcheck
  #textColor;

  /**
   * Creates the search bar object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'ons-search-input', options: options });

    this.#errors = 
    {
      autocapitalizeTypeError: 'Searchbar Error: Expected type boolean for autocapitalize.',
      caretColorInvalidError: 'Searchbar Error: Invalid color value provided for caret color.',
      caretColorTypeError: 'Searchbar Error: Expected type string for caret color.',
      fontTypeError: 'Searchbar Error: Expected type string for font.',
      maxLengthTypeError: 'Searchbar Error: Expected type number for max length.',
      onChangeTypeError: 'Searchbar Error: Expected type function for onChange.',
      onTextChangeTypeError: 'Searchbar Error: Expected type function for onTextChange.',
      placeholderTypeError: 'Searchbar Error: Expected type string for placeholder.',
      spellcheckTypeError: 'Searchbar Error: Expected type boolean for spellcheck.',
      textColorInvalidError: 'Searchbar Error: Invalid color value provided for text color.',
      textColorTypeError: 'Searchbar Error: Expected type string for text color.',
      textTypeError: 'Searchbar Error: Expected type string for text.'
    };
    
    this.autocapitalize = options.autocapitalize || true;
    this.spellcheck = options.spellcheck || true;
    if(options.caretColor) this.caretColor = options.caretColor;
    if(options.maxLength) this.maxLength = options.maxLength;
    if(options.onChange) this.onChange = options.onChange;
    if(options.onTextChange) this.onTextChange = options.onTextChange;
    if(options.text) this.text = options.text;
    this.placeholder = options.placeholder || "Search...";
    this.font = options.font || font.library.system;
    if(options.textColor) this.textColor = options.textColor;
  }
  
  /** 
   * Get property to return the autocapitalize value of the search bar.
   * @return {Boolean} The autocapitalize value of the search bar.
   */
  get autocapitalize() 
  { 
    return this.#autocapitalize; 
  }
  
  /** 
   * Set property to set the autocapitalize value of the search bar.
   * @param {Boolean} value - The autocapitalize value of the search bar.
   */
  set autocapitalize(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) 
    {
      console.error(this.#errors.autocapitalizeTypeError);
      return;
    }
    if(value === true) this.setAttribute({ key: 'autocapitalize', value: 'on' });
    else this.setAttribute({ key: 'autocapitalize', value: 'off' });
    this.#autocapitalize = value;
  }
  
  /** 
   * Get property to return the caret color of the search bar.
   * @return {string} The caret color of the search bar.
   */
  get caretColor() 
  { 
    return this.style.caretColor; 
  }
  
  /** 
   * Set property to set the caret color of the search bar.
   * @param {string} value - The caret color of the search bar.
   */
  set caretColor(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.caretColorTypeError);
      return;
    }
    if(!color.isValid({ color: value })) 
    {
      console.error(this.#errors.caretColorInvalidError);
      return;
    }
    this.style.caretColor = value;
  }
  
  /** 
   * Get property to return the font value of the searchbar object.
   * @return {string} The font value of the searchbar object. 
   */
  get font() 
  { 
    return this.#font;
  }
  
  /** 
   * Set property to set the font value of the searchbar object.
   * @param {string} value - The font value of the searchbar object.
   */
  set font(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.fontTypeError);
      return;
    } 
    setTimeout(() => 
    {
      let inner = this.element.querySelector('input');
      if(inner) inner.style.fontFamily = value;
      this.#font = value;
    },1);
  }
  
  /** 
   * Get property to return the max length value of the search bar.
   * @return {number} The max length value of the search bar.
   */
  get maxLength() 
  { 
    return this.#maxLength; 
  }
  
  /** 
   * Set property to set the max length value of the search bar.
   * @param {number} value - The max length of the search bar.
   */
  set maxLength(value) 
  {
    if(!typechecker.check({ type: 'number', value: value })) 
    {
      console.error(this.#errors.maxLengthTypeError);
      return;
    }
    this.setAttribute({ key: 'maxlength', value: String(value) });
    this.#maxLength = value;
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
   * @param {function} value - The function being called during on change events.
   */
  set onChange(value)
  {
    if(!typechecker.check({ type: 'function', value: value })) 
    {
      console.error(this.#errors.onChangeTypeError);
      return;
    }

    if(this.#onChange) this.removeEventListener({ event: 'change', handler: this.#onChange });
    let handler = (event) => value(event.target.value);

    this.#onChange = handler;
    this.addEventListener({ event: 'change' , handler });
  }

  /** 
   * Get property to return the function being called during on text change events.
   * @return {function} The function being called during on text change events.
   */
  get onTextChange() 
  { 
    return this.#onTextChange; 
  }

  /** 
   * Set property to set the function being called during on text change events.
   * @param {function} value - The function being called during on text change events.
   */
  set onTextChange(value)
  {
    if(!typechecker.check({ type: 'function', value: value })) 
    {
      console.error(this.#errors.onTextChangeTypeError);
      return;
    }

    if(this.#onTextChange) this.removeEventListener({ event: 'input', handler: this.#onTextChange });
    let handler = (event) => value(event.target.value);

    this.#onTextChange = handler;
    this.addEventListener({ event: 'input', handler: handler });
  }

  /** 
   * Get property to return the placeholder value for the search bar.
   * @return {string} The placeholder value for the search bar.
   */
  get placeholder() 
  { 
    return this.#placeholder; 
  }
  
  /** 
   * Set property to set the placeholder value of the search bar.
   * @param {string} value - The placeholder value of the search bar.
   */
  set placeholder(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.placeholderTypeError);
      return;
    }
    this.setAttribute({ key: 'placeholder', value: value });
    this.#placeholder = value;
  }
  
  /** 
   * Get property to return the spellcheck value of the search bar.
   * @return {Boolean} The spellcheck value of the search bar.
   */
  get spellcheck() 
  { 
    return this.#spellcheck; 
  }
  
  /** 
   * Set property to set the spellcheck value of the search bar.
   * @param {Boolean} value - The spellcheck value of the search bar.
   */
  set spellcheck(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) 
    {
      console.error(this.#errors.spellcheckTypeError);
      return;
    }
    
    if(value === true)
    {
      this.setAttribute({ key: 'type', value: 'search' });
      this.setAttribute({ key: 'spellcheck', value: 'true' });
      this.setAttribute({ key: 'autocorrect', value: 'on' });
      this.setAttribute({ key: 'autocomplete',value: 'on' });
      setTimeout(() => 
      {
        let input = this.element.querySelector('input');
        input.setAttribute('type', 'search');
        input.setAttribute('spellcheck', 'true');
        input.setAttribute('autocorrect','on');
        input.setAttribute('autocomplete','on');
      },5);
    }
    else 
    {
      this.setAttribute({ key: 'type', value: 'text' });
      this.setAttribute({ key: 'spellcheck', value: 'false' });
      this.setAttribute({ key: 'autocorrect', value: 'off' });
      this.setAttribute({ key: 'autocomplete',value: 'off' });
      setTimeout(() => 
      {
        let input = this.element.querySelector('input');
        input.setAttribute('type', 'text');
        input.setAttribute('spellcheck', 'false');
        input.setAttribute('autocorrect','off');
        input.setAttribute('autocomplete','off');
      },5);
    }
    this.#spellcheck = value;
  }
  
  /** 
   * Get property to return the text value for the search bar.
   * @return {string} The text value for the search bar.
   */
  get text() 
  { 
    return this.element.value; 
  }

  /** 
   * Set property to set the text value of the search bar.
   * @param {string} value - The text value of the search bar.
   */
  set text(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.textTypeError);
      return;
    }
    this.element.value = value;
  }
  
  /** 
   * Get property to return the text color of the search bar.
   * @return {string} The text color of the search bar.
   */
  get textColor() 
  { 
    return this.#textColor; 
  }
  
  /** 
   * Set property to set the text color of the search bar.
   * @param {string} value - The text color of the search bar.
   */
  set textColor(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.textColorTypeError);
      return;
    }
    if(!color.isValid({ color: value })) 
    {
      console.error(this.#errors.textColorInvalidError);
      return;
    }

    this.style.setProperty("--input-text-color", value);
    this.#textColor = value;
    setTimeout(() => 
    {
      let input = this.element.querySelector('input');
      if(input) input.style.color = value;
    });
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'searchbar', constructor: _Searchbar_ });

///////////////////////////////////////////////////////////
