///////////////////////////////////////////////////////////

/** Class representing the BarButton component. */
class _BarButton_ extends Component
{
  #containsIcon;
  #containsText;
  #errors;
  #iconElement = null;
  
  /**
   * Creates the BarButton object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {})
  {
    super({ tagName: 'ons-toolbar-button', options: options });

    this.#errors = 
    {
      buttonTypeError: "Bar Button Error: Button can only have either 'text' or 'icon', not both.",
      colorInvalidError: 'Bar Button Error: Invalid color value provided for color.',
      colorTypeError: 'Bar Button Error: Expected type string for color.',
      fontTypeError: 'Bar Button Error: Expected type string for font.',
      iconTypeError: 'Bar Button Error: Expected type string or Icon for icon.',
      textTypeError: 'Bar Button Error: Expected type string for text.'
    };

    this.#containsIcon = false;
    this.#containsText = false;

    this.font = options.font || font.library.system;
    if(options.text && options.icon) 
    {
      console.error(this.#errors.buttonTypeError);
      return;
    }
    if(options.text) this.text = options.text;
    else if(options.icon) this.icon = options.icon;
    if(options.color) this.color = options.color;
  }

  /** 
   * Get property to return the color of the button.
   * @return {string} The color of the button.
   */
  get color()
  {
    return this.element.style.color;
  }
  
  /** 
   * Set property to set the color of the button.
   * @param {string} value - The color of the button.
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
    this.element.style.color = value;
  }
  
  /** 
   * Get property to return the font value of the bar button object.
   * @return {string} The font value of bar button object. 
   */
  get font() 
  { 
    return this.style.fontFamily; 
  }
  
  /** 
   * Set property to set the font value of the bar button object.
   * @param {string} value - The font value of the bar button object.
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
   * Get property to return the icon of the button.
   * @return {Multiple} The icon of the button.
   */
  get icon()
  {
    return this.#iconElement?.icon || null;
  }
  
  /** 
   * Set property to set the icon of the button.
   * @param {Multiple} value - The icon of the button. Accepts string or Icon.
   */
  set icon(value)
  {
    if(this.#containsText == true) console.error(this.#errors.buttonTypeError);
    if(this.#iconElement) this.element.innerHTML = '';
    if(typechecker.check({ type: 'string', value: value })) this.#iconElement = new ui.Icon({ icon: value });
    else if(typechecker.check({ type: 'icon', value: value })) this.#iconElement = value;
    else 
    {
      console.error(this.#errors.iconTypeError);
      return;
    }
    this.appendChild({ child: this.#iconElement.element });
    this.#containsIcon = true;
  }
  
  /** 
   * Get property to return the text of the button.
   * @return {string} The text of the button.
   */
  get text()
  {
    return this.element.textContent;
  }
  
  /** 
   * Set property to set the text of the button.
   * @param {string} value - The text of the button.
   */
  set text(value)
  {
    if(this.#containsIcon == true) 
    {
      console.error(this.#errors.buttonTypeError);
      return;
    }
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.textTypeError);
      return;
    }

    let span = document.createElement('span');
    span.textContent = value;
    span.classList = 'back-button__label';
    this.element.appendChild(span);
    this.#containsText = true;
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'bar-button', constructor: _BarButton_ });

///////////////////////////////////////////////////////////
