
///////////////////////////////////////////////////////////

/** Class representing the label component. */
class _Label_ extends Component 
{
  #errors;
  #inputId;
  #rawText;
  #tagMap;
  
  /**
   * Creates the label object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'label', options: options });

    this.#errors = 
    {
      colorInvalidError: 'Label Error: Invalid color value for color.',
      colorTypeError: 'Label Error: Expected type string for color.',
      fontSizeTypeError: 'Label Error: Expected type string for font size.',
      fontTypeError: 'Label Error: Expected type string for font.',
      textTypeError: 'Label Error: Expected type string for text.'
    };

    this.#rawText = '';
    this.#tagMap = ['b','i','s','u','mark','small','sub','sup'];
    
    if(options.text) this.text = options.text;
    if(options.inputId) this.inputId = options.inputId;
    this.font = options.font || font.library.system;
    if(options.fontSize) this.fontSize = options.fontSize;
    if(options.color) this.color = options.color;
  }

  /** 
   * Get property to return the color of the label object.
   * @return {string} The color of the label object. 
   */
  get color() 
  { 
    return this.style.color; 
  }
  
  /** 
   * Set property to set the color of the the label object.
   * @param {string} value - The color of the label object.
   */
  set color(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.colorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.colorInvalidError);
    this.style.color = value;
  }
  
  /** 
   * Get property to return the font value of the label object.
   * @return {string} The font value of label object. 
   */
  get font() 
  { 
    return this.style.fontFamily; 
  }
  
  /** 
   * Set property to set the font value of the the label object.
   * @param {string} value - The font value of the the label object.
   */
  set font(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.fontTypeError);
    this.style.fontFamily = value;
  }
  
  /** 
   * Get property to return the font size of the label object.
   * @return {string} The font size of label object. 
   */
  get fontSize() 
  { 
    return this.style.fontSize; 
  }
  
  /** 
   * Set property to set the font size of the the label object.
   * @param {string} value - The font size of the the label object.
   */
  set fontSize(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.fontSizeTypeError);
    this.style.fontSize = value;
  }
  
  /** 
   * Get property to return the inputId value of the label.
   * @return {string} The inputId value of the label. 
   */
  get inputId()
  {
    return this.#inputId;
  }
  
  /** 
   * Set property to set the inputId value of the label.
   * @param {string} value - The inputId value of the label.
   */
  set inputId(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.inputIdTypeError);
    this.setAttribute({ key: 'for', value: value });
    this.#inputId = value;
  }

  /** 
   * Get property to return the label's text value.
   * @return {string} The label's text value. If inline elements were used the same text will be returned. 
   */
  get text() 
  {
    if(!this.#rawText) return '';
    let raw = this.element.innerHTML;
    raw = raw.replace(
      /<abbr title="(.+?)">(.+?)<\/abbr>/g,
      '[abbr:$2|$1]'
    );

    for(let tag of this.#tagMap) 
    {
      let regex = new RegExp(`<${tag}>(.+?)<\/${tag}>`, 'g');
      raw = raw.replace(regex, `[${tag}:$1]`);
    }

    return raw;
  }
  
  /** 
   * Set property to set the label's text value.
   * @param {string} value - The label's text value.
   * 
   * Supports inline element support through bracket notation.
   * Ex: This is a [i:very] [b:strong] paragraph! 
   * It Supports the following tags:
   * 
   * - b: bold
   * - i: italic
   * - s: strikethrough
   * - u: underline
   * - mark: highlight
   * - shrink: small
   * - subscript: sub
   * - superscript: sup
   */
  set text(value) 
  {
    if(!typechecker.check({ type: 'string', value })) console.error(this.#errors.textTypeError);

    this.#rawText = value;
    
    let formatted = value;
    formatted = formatted.replace(
      /\[abbr:(.+?)\|(.+?)\]/g,
      '<abbr title="$2">$1</abbr>'
    );

    for(let tag of this.#tagMap) 
    {
      let regex = new RegExp(`\\[${tag}:(.+?)\\]`, 'g');
      formatted = formatted.replace(regex, `<${tag}>$1</${tag}>`);
    }

    this.element.innerHTML = formatted;
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'list', constructor: _Label_ }); 

///////////////////////////////////////////////////////////