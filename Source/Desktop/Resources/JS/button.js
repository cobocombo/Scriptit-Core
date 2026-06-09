
///////////////////////////////////////////////////////////

/** Class representing the button component. Supported modifiers: outline, light, quiet, large */
class _Button_ extends Component 
{
  #contentWrapper;
  #errors;
  #textElement;
  #textWrapper;
  #iconElement;
  #iconSide;

  /**
   * Creates the back button object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'ons-button', options: options });

    this.#errors = 
    {
      fontTypeError: 'Button Error: Expected type string for font.',
      iconColorInvalidError: 'Button Error: Invalid color value provided for icon color.',
      iconColorTypeError: 'Button Error: Expected type string for icon color.',
      iconSideInvalidSideError: 'Button Error: Invalid value provided for icon side. Accepted values are left or right',
      iconSideTypeError: 'Button Error: Expected type string for icon side.',
      iconTypeError: 'Button Error: Expected type string for icon.',
      textColorInvalidError: 'Button Error: Invalid color value provided for text color.',
      textColorTypeError: 'Button Error: Expected type string for text color.',
      textTypeError: 'Button Error: Expected type string for text.'
    }

    this.#contentWrapper = document.createElement('span');
    this.#contentWrapper.style.display = 'inline-flex';
    this.#contentWrapper.style.alignItems = 'center';
    this.#contentWrapper.style.justifyContent = 'center';
    this.#contentWrapper.style.gap = '0.5em';

    this.#textWrapper = document.createElement('span');
    this.#textElement = document.createTextNode('');
    this.#textWrapper.appendChild(this.#textElement);

    this.appendChild({ child: this.#contentWrapper });

    this.font = options.font || font.library.system;
    if(options.text) this.text = options.text;
    if(options.textColor) this.textColor = options.textColor;
    if(options.icon) this.icon = options.icon;
    if(options.iconColor) this.iconColor = options.iconColor;
    if(options.iconSide === 'right') this.iconSide = 'right';
    else this.iconSide = 'left';
    
    this.#render();  
  }

  /** Private method to re-render the button internally. */
  #render() 
  {
    this.#contentWrapper.innerHTML = '';
  
    if(this.iconSide === 'left') 
    {
      if(this.#iconElement) this.#contentWrapper.appendChild(this.#iconElement.element);
      if(this.#textWrapper) this.#contentWrapper.appendChild(this.#textWrapper);
    }
    else 
    {
      if(this.#textWrapper) this.#contentWrapper.appendChild(this.#textWrapper);
      if(this.#iconElement) this.#contentWrapper.appendChild(this.#iconElement.element);
    }
  }
  
  /** 
   * Get property to return the font value of the button object.
   * @return {string} The font value of button object. 
   */
  get font() 
  { 
    return this.#textWrapper.style.fontFamily; 
  }
  
  /** 
   * Set property to set the font value of the button object.
   * @param {string} value - The font value of the button object.
   */
  set font(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.fontTypeError);
      return;
    }
    this.#textWrapper.style.fontFamily = value;
  }

  /** 
   * Get property to return the button's icon value.
   * @return {string} The button's icon value.
   */
  get icon() 
  {
    return this.#iconElement?.icon || null;
  }

  /** 
   * Set property to set the button's icon value.
   * @param {string} value - The button's icon value. Re-renders the button.
   */
  set icon(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.iconTypeError);
      return;
    }
    if(this.#iconElement) this.#iconElement.icon = value;
    else this.#iconElement = new ui.Icon({ icon: value });
    this.#render();
  }

  /** 
   * Get property to return the button's icon color value.
   * @return {string} The button's icon color value.
   */
  get iconColor() 
  {
    return this.#iconElement?.element.style.color || null;
  }

  /** 
   * Set property to set the button's icon color value.
   * @param {string} value - The button's icon color value. Will throw an error if the color value is not valid.
   */
  set iconColor(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.iconColorTypeError);
      return;
    }
    if(!color.isValid({ color: value })) 
    {
      console.error(this.#errors.iconColorInvalidError);
      return;
    }
    if(this.#iconElement) this.#iconElement.element.style.color = value;
  }

  /** 
   * Get property to return the button's icon side value.
   * @return {string} The button's icon side value. Defaults to left.
   */
  get iconSide()
  {
    return this.#iconSide;
  }

  /** 
   * Set property to set the button's icon side value.
   * @param {string} value - The button's icon side value. Re-renders the button. Throw an error if left or right is a given value.
   */
  set iconSide(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.iconSideTypeError);
      return;
    }
    
    if(!['left', 'right'].includes(value)) 
    {
      console.error(this.#errors.iconSideInvalidSideError);
      return;
    }

    this.#iconSide = value;
    this.#render();
  }

  /** 
   * Get property to return the button's text value.
   * @return {string} The button's text value.
   */
  get text() 
  {
    return this.#textElement?.nodeValue || null;
  }

  /** 
   * Set property to set the button's text value.
   * @param {string} value - The button's text value. Re-renders the button.
   */
  set text(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.textTypeError);
      return;
    }
    this.#textElement.nodeValue = value;
    this.#render();
  }

  /** 
   * Get property to return the button's text color value.
   * @return {string} The button's text color value.
   */
  get textColor() 
  {
    return this.#textWrapper?.style.color || null;
  }
  
  /** 
   * Set property to set the button's text color value.
   * @param {string} value - The button's text color value. Will throw an error if the color value is not valid.
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
    if(this.#textWrapper) this.#textWrapper.style.color = value;
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'button', constructor: _Button_ });

///////////////////////////////////////////////////////////
