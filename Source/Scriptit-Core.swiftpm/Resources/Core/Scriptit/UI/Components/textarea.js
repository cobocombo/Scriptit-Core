
///////////////////////////////////////////////////////////

/** Class representing the text area component. */
class _Textarea_ extends Component 
{
  #autocapitalize;
  #caretColor;
  #cols;
  #errors;
  #maxLength;
  #onChange;
  #onTextChange;
  #placeholder;
  #resizable;
  #rows;
  #spellcheck;
  
  /**
   * Creates the Textarea object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'textarea', options: options });

    this.#errors = 
    {
      autocapitalizeTypeError: 'Textarea Error: Expected type boolean for autocapitalize.',
      caretColorInvalidError: 'Textarea Error: Invalid color value provided for caretColor.',
      caretColorTypeError: 'Textarea Error: Expected type string for caretColor.',
      colsTypeError: 'Textarea Error: Expected type number for cols.',
      fontTypeError: 'Textarea Error: Expected type string for font.',
      maxLengthTypeError: 'Textarea Error: Expected type number for maxLength.',
      onChangeTypeError: 'Textarea Error: Expected type function for onChange.',
      onTextChangeTypeError: 'Textarea Error: Expected type function for onTextChange.',
      placeholderTypeError: 'Textarea Error: Expected type string for placeholder.',
      resizableTypeError: 'Textarea Error: Expected boolean value for resizable.',
      rowsTypeError: 'Textarea Error: Expected type number for rows.',
      spellcheckTypeError: 'Textarea Error: Expected type boolean for spellcheck.',
      textColorInvalidError: 'Textarea Error: Invalid color value provided for textColor.',
      textColorTypeError: 'Textarea Error: Expected type string for textColor.',
      textTypeError: 'Textarea Error: Expected type string for text.'
    };
    
    this.autocapitalize = options.autocapitalize || true;
    this.spellcheck = options.spellcheck || true;
    if(options.caretColor) this.caretColor = options.caretColor;
    if(options.cols) this.cols = options.cols;
    this.font = options.font || font.library.system;
    if(options.maxLength) this.maxLength = options.maxLength;
    if(options.onChange) this.onChange = options.onChange;
    if(options.onTextChange) this.onTextChange = options.onTextChange;
    if(options.placeholder) this.placeholder = options.placeholder;
    this.resizable = options.resizable || false;
    if(options.rows) this.rows = options.rows;
    if(options.text) this.text = options.text;
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
    if(!typechecker.check({ type: 'boolean', value: value })) console.error(this.#errors.autocapitalizeTypeError);
    if(value === true) this.setAttribute({ key: 'autocapitalize', value: 'on' });
    else this.setAttribute({ key: 'autocapitalize', value: 'off' });
    this.#autocapitalize = value;
  }
  
  /** 
   * Get property to return the caret color of the text area.
   * @return {string} The caret color of the text area.
   */
  get caretColor() 
  { 
    return this.#caretColor; 
  }
  
  /** 
   * Set property to set the caret color of the text area.
   * @param {string} value - The caret color of the text area.
   */
  set caretColor(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.caretColorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.caretColorInvalidError);
    this.style.caretColor = value;
  }
  
  /** 
   * Get property to return the number of cols for the text area.
   * @return {number} The number of cols for the text area.
   */
  get cols() 
  { 
    return this.#cols; 
  }
  
  /** 
   * Set property to set the number of cols for the text area.
   * @param {number} value - The number of cols for the text area.
   */
  set cols(value)
  {
    if(!typechecker.check({ type: 'number', value: value })) console.error(this.#errors.colsTypeError);
    this.setAttribute({ key: 'cols', value: String(value) });
    this.#cols = value;
  }
  
  /** 
   * Get property to return the font value of the text area object.
   * @return {string} The font value of the text area object. 
   */
  get font() 
  { 
    return this.style.fontFamily; 
  }
  
  /** 
   * Set property to set the font value of the text area object.
   * @param {string} value - The font value of the text area object.
   */
  set font(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.fontTypeError);
    this.style.fontFamily = value;
  }
  
  /** 
   * Get property to return the max character length for the text area.
   * @return {number} The max character length for the text area.
   */
  get maxLength() 
  { 
    return this.#maxLength; 
  }
  
  /** 
   * Set property to set the max character length for the text area.
   * @param {number} value - The max character length for the text area.
   */
  set maxLength(value) 
  {
    if(!typechecker.check({ type: 'number', value: value })) console.error(this.#errors.maxLengthTypeError);
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
    if(!typechecker.check({ type: 'function', value: value })) console.error(this.#errors.onChangeTypeError);

    if(this.#onChange) this.removeEventListener({ event: 'change', handler: this.#onChange });
    let handler = (event) => value(event.target.value);

    this.#onChange = handler;
    this.addEventListener({ event: 'change', handler: handler });
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
    if(!typechecker.check({ type: 'function', value: value })) console.error(this.#errors.onTextChangeTypeError);

    if(this.#onTextChange) this.removeEventListener({ event: 'input', handler: this.#onTextChange });
    let handler = (event) => value(event.target.value);

    this.#onTextChange = handler;
    this.addEventListener({ event: 'input', handler: handler });
  }
  
  /** 
   * Get property to return the placeholder value for the text area.
   * @return {string} The placeholder value for the text area.
   */
  get placeholder() 
  { 
    return this.#placeholder; 
  }
  
  /** 
   * Set property to set the placeholder value of the text area.
   * @param {string} value - The placeholder value of the text area.
   */
  set placeholder(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.placeholderTypeError);
    this.setAttribute({ key: 'placeholder', value: value });
    this.#placeholder = value;  
  }

  /** 
   * Get property to return whether the textarea is resizable.
   * @return {boolean} Whether the textarea is resizable.
   */
  get resizable() 
  {
    return this.#resizable;
  }

  /** 
   * Set property to control whether the textarea is resizable.
   * @param {boolean} value - True to make it resizable, false to disable resizing.
   */
  set resizable(value) 
  {
    if(!typechecker.check({ type: 'boolean', value })) console.error(this.#errors.resizableTypeError); 
    this.style.resize = value ? 'both' : 'none';
    this.#resizable = value;
  }
  
  /** 
   * Get property to return the number of rows for the text area.
   * @return {number} The number of rows for the text area.
   */
  get rows() 
  { 
    return this.#rows; 
  }
  
  /** 
   * Set property to set the number of rows for the text area.
   * @param {number} value - The number of rows for the text area.
   */
  set rows(value)
  {
    if(!typechecker.check({ type: 'number', value: value })) console.error(this.#errors.rowsTypeError);
    this.setAttribute({ key: 'rows', value: String(value) });
    this.#rows = value;
  }
  
  /** 
   * Get property to return the spellcheck value of the textarea.
   * @return {Boolean} The spellcheck value of the textarea.
   */
  get spellcheck() 
  { 
    return this.#spellcheck; 
  }
  
  /** 
   * Set property to set the spellcheck value of the textarea.
   * @param {Boolean} value - The spellcheck value of the textarea.
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
      this.setAttribute({ key: 'spellcheck', value: 'true' });
      this.setAttribute({ key: 'autocorrect', value: 'on' });
      this.setAttribute({ key: 'autocomplete',value: 'on' });
    }
    else 
    {
      this.setAttribute({ key: 'spellcheck', value: 'false' });
      this.setAttribute({ key: 'autocorrect', value: 'off' });
      this.setAttribute({ key: 'autocomplete',value: 'off' });
    }
    this.#spellcheck = value;
  }

  /** 
   * Get property to return the text value for the text area.
   * @return {string} The text value for the text area.
   */
  get text() 
  { 
    return this.element.value; 
  }

  /** 
   * Set property to set the text value of the text area.
   * @param {string} value - The text value of the text area.
   */
  set text(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.textTypeError);
    this.element.value = value;
  }
  
  /** 
   * Get property to return the text color of the text area.
   * @return {string} The text color of the text area.
   */
  get textColor() 
  { 
    return this.style.color;
  }
  
  /** 
   * Set property to set the text color of the text area.
   * @param {string} value - The text color of the text area.
   */
  set textColor(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.textColorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.textColorInvalidError);
    this.style.color = value;
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'text-area', constructor: _Textarea_ }); 

///////////////////////////////////////////////////////////