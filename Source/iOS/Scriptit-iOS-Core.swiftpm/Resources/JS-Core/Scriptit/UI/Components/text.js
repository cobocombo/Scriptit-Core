
///////////////////////////////////////////////////////////

/** Class representing the text component. */
class _Text_ extends Component 
{
  #errors;
  #rawText;
  #tagMap;
  #type;
  
  /**
   * Creates the tabbar object.
   * @param {object} options - Custom options object to init properties from the constructor. Type can only be configured in the constructor. 
   */
  constructor(options = {}) 
  {
    let validTypes = 
    {
      h1: 'header-1',
      h2: 'header-2',
      h3: 'header-3',
      h4: 'header-4',
      h5: 'header-5',
      h6: 'header-6',
      p: 'paragraph'
    };

    let tagName = 'p';
    if(options.type  == validTypes.h1) tagName = 'h1';
    else if(options.type  == validTypes.h2) tagName = 'h2';
    else if(options.type  == validTypes.h3) tagName = 'h3';
    else if(options.type  == validTypes.h4) tagName = 'h4';
    else if(options.type  == validTypes.h5) tagName = 'h5';
    else if(options.type  == validTypes.h6) tagName = 'h6';

    if(!typechecker.check({ type: 'string', value: tagName })) throw 'Text Error: Expected type string for type.';

    super({ tagName: tagName, options: options });
    this.#type = tagName;

    this.#errors = 
    {
      colorInvalidError: 'Text Error: Invalid color value for color.',
      colorTypeError: 'Text Error: Expected type string for color.',
      fontSizeTypeError: 'Text Error: Expected type string for font size.',
      fontTypeError: 'Text Error: Expected type string for font.',
      textTypeError: 'Text Error: Expected type string for text.'
    };

    this.#rawText = '';
    this.#tagMap = ['b','i','s','u','mark','small','sub','sup'];
    
    if(options.text) this.text = options.text;
    this.font = options.font || font.library.system;
    if(options.fontSize) this.fontSize = options.fontSize;
    if(options.color) this.color = options.color;
  }

  /** 
   * Get property to return the color of the text object.
   * @return {string} The color of the text object. 
   */
  get color() 
  { 
    return this.style.color; 
  }
  
  /** 
   * Set property to set the color of the the text object.
   * @param {string} value - The color of the text object.
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
    this.style.color = value;
  }
  
  /** 
   * Get property to return the font value of the text object.
   * @return {string} The font value of text object. 
   */
  get font() 
  { 
    return this.style.fontFamily; 
  }
  
  /** 
   * Set property to set the font value of the the text object.
   * @param {string} value - The font value of the the text object.
   */
  set font(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.fontTypeError);
      return;
    }
    this.style.fontFamily = value;
  }
  
  /** 
   * Get property to return the font size of the text object.
   * @return {string} The font size of text object. 
   */
  get fontSize() 
  { 
    return this.style.fontSize; 
  }
  
  /** 
   * Set property to set the font size of the the text object.
   * @param {string} value - The font size of the the text object.
   */
  set fontSize(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.fontSizeTypeError);
      return;
    }
    this.style.fontSize = value;
  }

  /** 
   * Get property to return the paragraph's text value.
   * @return {string} The paragraph's text value. If inline elements were used the same text will be returned. 
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
   * Set property to set the paragraph's text value.
   * @param {string} value - The text's text value.
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
    if(!typechecker.check({ type: 'string', value })) 
    {
      console.error(this.#errors.textTypeError);
      return;
    }

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

  /** 
   * Get property to return the type of the text object.
   * @return {string} The type of the text object. 
   */
  get type()
  {
    return this.#type;
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'text', constructor: _Text_ }); 

///////////////////////////////////////////////////////////
