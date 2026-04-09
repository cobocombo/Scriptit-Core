
///////////////////////////////////////////////////////////

/** Class representing the tab component. */
class _Tab_ extends Component 
{
  #badge;
  #errors;
  #font;
  #text;
  #icon;
  #root;
  #color;

  /**
   * Creates the tab object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'ons-tab', options: options });

    this.#errors = 
    {
      badgeTypeError: 'Tab Error: Expected type string for badge.',
      colorInvalidError: 'Tab Error: Invalid color value for color.',
      colorTypeError: 'Tab Error: Expected type string for color.',
      fontTypeError: 'Tab Error: Expected type string for font.',
      iconTypeError: 'Tab Error: Expected type string for icon.',
      rootTypeError: 'Tab Error: Root must be a Page or Navigator component.',
      textTypeError: 'Tab Error: Expected type string for text.'
    };
    
    if(options.badge) this.badge = options.badge;
    this.color = options.color || '#1f8dd6';
    this.font = options.font || font.library.system;
    if(options.icon) this.icon = options.icon;
    if(options.root) this.root = options.root;
    if(options.text) this.text = options.text;
    this.addEventListener({ event: 'click', handler: () => { this.onSelect?.(this); }});
  }
  
  /** 
   * Get property to return the badge value of the tab.
   * @return {string} The badge value of tab. 
   */
  get badge() 
  { 
    return this.#badge; 
  }
  
  /** 
   * Set property to set the badge value of the tab.
   * @param {string} value - The badge value of the tab. Setting value to none will remove the badge.
   */
  set badge(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.badgeTypeError);
      return;
    }
    this.setAttribute({ key: 'badge', value: value });
    if(value == 'none') this.removeAttribute({ key: 'badge' });
    this.#badge = value;
  }
  
  /** 
   * Get property to return the color of the tab.
   * @return {string} The color of the tab. 
   */
  get color() 
  { 
    return this.#color; 
  }
  
  /** 
   * Set property to set the color of the tab.
   * @param {string} value - The color of the tab.
   */
  set color(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.colorTypeError);
      return;
    }
    if(!color.isValid({ color: value })) c
    {
      onsole.error(this.#errors.colorInvalidError);
      return;
    }
    this.#color = value;
  }
  
  /** 
   * Get property to return the font value of the tab object.
   * @return {string} The font value of the tab object. 
   */
  get font() 
  { 
    return this.#font; 
  }
  
  /** 
   * Set property to set the font value of the tab object.
   * @param {string} value - The font value of the tab object.
   */
  set font(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.fontTypeError);
      return;
    }
    this.#font = value;
  }
  
  /** 
   * Get property to return the text value of the tab.
   * @return {string} The text value of tab. 
   */
  get text() 
  { 
    return this.#text; 
  } 
  
  /** 
   * Set property to set the text value of the tab.
   * @param {string} value - The text value of the tab.
   */
  set text(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.textTypeError);
      return;
    }
    this.setAttribute({ key: 'label', value: value });
    this.#text = value;
  }
  
  /** 
   * Get property to return the icon value of the tab.
   * @return {string} The icon value of tab. 
   */
  get icon() 
  { 
    return this.#icon; 
  }
  
  /** 
   * Set property to set the icon value of the tab.
   * @param {string} value - The icon value of the tab.
   */
  set icon(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.iconTypeError);
      return;
    }
    this.setAttribute({ key: 'icon', value: value });
    this.#icon = value;
  }

  /** 
   * Get property to return the root component of the tab.
   * @return {Multiple} The root component of the tab. Supports Page or Navigator. 
   */
  get root() 
  { 
    return this.#root; 
  }
  
  /** 
   * Set property to set the tab's root component.
   * @param {Multiple} value - The root component of the tab.
   */
  set root(value)
  {
    if(!typechecker.checkMultiple({ types: [ 'page', 'navigator' ], value: value })) 
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
    this.#root = value;
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'tab', constructor: _Tab_ }); 

///////////////////////////////////////////////////////////
