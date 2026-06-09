
///////////////////////////////////////////////////////////

/** Class representing the Textfield component. */
class _Textfield_ extends Component
{
  #autocapitalize;
  #caretColor;
  #errors;
  #font;
  #maxLength;
  #onChange;
  #onTextChange;
  #placeholder;
  #spellcheck;
  #type;
  #textColor;
  #underbar;
  #validTypes;
  
  /**
   * Creates the Textfield object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {})
  {  
    super({ tagName: 'ons-input', options: options });

    this.#validTypes = 
    {
      email: 'email',
      password: 'password',
      tel: 'tel',
      text: 'text'
    };

    this.#errors = 
    {
      autocapitalizeTypeError: 'Textfield Error: Expected type boolean for autocapitalize.',
      caretColorInvalidError: 'Textfield Error: Invalid color value provided for caretColor.',
      caretColorTypeError: 'Textfield Error: Expected type string for caretColor.',
      fontTypeError: 'Textfield Error: Expected type string for font.',
      maxLengthTypeError: 'Textfield Error: Expected type number for maxLength.',
      onChangeTypeError: 'Textfield Error: Expected type function for onChange.',
      onTextChangeTypeError: 'Textfield Error: Expected type function for onTextChange.',
      placeholderTypeError: 'Textfield Error: Expected type string for placeholder.',
      spellcheckTypeError: 'Textfield Error: Expected type boolean for spellcheck.',
      textColorInvalidError: 'Textfield Error: Invalid color value provided for textColor.',
      textColorTypeError: 'Textfield Error: Expected type string for textColor.',
      textTypeError: 'Textfield Error: Expected type string for text.',
      typeInvalidError: 'Textfield Error: Invalid value provided for type.',
      typeTypeError: 'Textfield Error: Expected type string for type.',
      underbarTypeError: 'Textfield Error: Expected type boolean for underbar.'
    };
    
    this.autocapitalize = options.autocapitalize || true;
    this.spellcheck = options.spellcheck || true;
    if(options.caretColor) this.caretColor = options.caretColor;
    this.font = options.font || font.library.system;
    if(options.maxLength) this.maxLength = options.maxLength;
    if(options.onChange) this.onChange = options.onChange;
    if(options.onTextChange) this.onTextChange = options.onTextChange;
    if(options.placeholder) this.placeholder = options.placeholder;
    if(options.text) this.text = options.text;
    if(options.textColor) this.textColor = options.textColor;
    this.type = options.type || 'text';
    this.underbar = options.underbar || true;
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
   * Get property to return the caret color of the textfield.
   * @return {string} The caret color of the textfield.
   */
  get caretColor() 
  { 
    return this.#caretColor; 
  }
  
  /** 
   * Set property to set the caret color of the textfield.
   * @param {string} value - The caret color of the textfield.
   */
  set caretColor(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.caretColorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.caretColorInvalidError); 
    this.style.caretColor = value;
  }
  
  /** 
   * Get property to return the font value of the textfield object.
   * @return {string} The font value of the textfield object. 
   */
  get font() 
  { 
    return this.#font;
  }
  
  /** 
   * Set property to set the font value of the textfield object.
   * @param {string} value - The font value of the textfield object.
   */
  set font(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.fontTypeError); 
    setTimeout(() => 
    {
      let inner = this.element.querySelector('input');
      if(inner) inner.style.fontFamily = value;
      this.#font = value;
    },1);
  }
  
  /** 
   * Get property to return the max character length for the textfield.
   * @return {number} The max character length for the textfield.
   */
  get maxLength() 
  { 
    return this.#maxLength; 
  }
  
  /** 
   * Set property to set the max character length for the textfield.
   * @param {number} value - The max character length for the textfield.
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
   * Get property to return the placeholder value for the textfield.
   * @return {string} The placeholder value for the textfield.
   */
  get placeholder() 
  { 
    return this.#placeholder; 
  }
  
  /** 
   * Set property to set the placeholder value of the textfield.
   * @param {string} value - The placeholder value of the textfield.
   */
  set placeholder(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.placeholderTypeError);
    this.setAttribute({ key: 'placeholder', value: value });
    this.#placeholder = value;  
  }
  
  /** 
   * Get property to return the spellcheck value of the textfield.
   * @return {Boolean} The spellcheck value of the textfield.
   */
  get spellcheck() 
  { 
    return this.#spellcheck; 
  }
  
  /** 
   * Set property to set the spellcheck value of the textfield.
   * @param {Boolean} value - The spellcheck value of the textfield.
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
   * Get property to return the text value for the textfield.
   * @return {string} The text value for the textfield.
   */
  get text() 
  { 
    return this.element.value; 
  }
  
  /** 
   * Set property to set the text value of the textfield.
   * @param {string} value - The text value of the textfield.
   */
  set text(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.textTypeError);
    this.element.value = value;
  }
  
  /** 
   * Get property to return the text color of the textfield.
   * @return {string} The text color of the textfield.
   */
  get textColor() 
  { 
    return this.#textColor;
  }
  
  /** 
   * Set property to set the text color of the textfield
   * @param {string} value - The text color of the textfield.
   */
  set textColor(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.textColorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.textColorInvalidError);
    this.style.setProperty("--input-text-color", value);
    this.#textColor = value;
    setTimeout(() => 
    {
      let input = this.element.querySelector('input');
      if(input) input.style.color = value;
    });
  }
  
  /** 
   * Get property to return the type of the textfield.
   * @return {string} The type of the textfield. 
   */
  get type() 
  { 
    return this.#type; 
  }

  /** 
   * Set property to set the type of the textfield
   * @param {string} value - The type of the textfield.
   */
  set type(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.typeTypeError);
    if(!Object.values(this.#validTypes).includes(value)) console.error(this.#errors.typeInvalidError);
    this.setAttribute({ key: 'type', value: value });
    this.#type = value;
  }
  
  /** 
   * Get property to return if the textfield has an underbar underneath it or not.
   * @return {boolean} The textfield's underbar value.
   */
  get underbar() 
  { 
    return this.#underbar; 
  }

  /** 
   * Set property to set if the textfield should have an underbar underneath it or not.
   * @param {boolean} value - The textfield's underbar value.
   */
  set underbar(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) console.error(this.#errors.underbarTypeError);
    if(value == true) this.addModifier({ modifier: 'underbar' });
    else this.removeModifier({ modifier: 'underbar' });
    this.#underbar = value;
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'textfield', constructor: _Textfield_ }); 

///////////////////////////////////////////////////////////
