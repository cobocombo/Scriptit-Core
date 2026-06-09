
///////////////////////////////////////////////////////////

/** Class representing the fab button component. */
class _FabButton_ extends Component 
{
  #errors;
  #iconElement;
  #position;

  /**
   * Creates the fab button object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'ons-fab', options: options });

    this.#errors = 
    {
      iconColorInvalidError: 'Fab Button Error: Invalid color value provided for icon color.',
      iconColorTypeError: 'Fab Button Error: Expected type string for icon color.',
      iconTypeError: 'Fab Button Error: Expected type string or icon for icon.',
      positionInvalidError: 'Fab Button Error: Invalid value for position. Valid values are: top-left, top-right, bottom-left or bottom-right.',
      positionTypeError: 'Fab Button Error: Expected type string for position.'
    }
  
    if(options.icon) this.icon = options.icon;
    if(options.iconColor) this.iconColor = options.iconColor;
    this.position = options.position || 'bottom-right';
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
   * @param {multiple} value - The button's icon value. Can accept string or icon type.
   */
  set icon(value)
  {
    if(this.#iconElement) this.element.innerHTML = '';
    if(typechecker.check({ type: 'string', value: value }))
    {
      this.#iconElement = new ui.Icon({ icon: value, size: '28px' });
      this.#iconElement.transform = 'translateY(-4px)';
    }
    else if(typechecker.check({ type: 'icon', value: value })) this.#iconElement = value;
    else
    {
      console.error(this.#errors.iconTypeError);
      return;
    }
    
    this.element.appendChild(this.#iconElement.element);
  }
  
  /** 
   * Get property to return the button's icon color value.
   * @return {string} The button's icon color value.
   */
  get iconColor()
  {
    if(this.#iconElement) return this.#iconElement.element.style.color;
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
    if(this.#iconElement) { this.#iconElement.element.style.color = value; }
  }
  
  /** 
   * Get property to return the button's position value.
   * @return {string} The button's position value.
   */
  get position()
  {
    return this.#position;
  }
  
  /** 
   * Set property to set the button's position value.
   * @param {string} value - The button's position value. Will throw an error if the value is not one of the following: top-left, top-right, bottom-left or bottom-right.
   */
  set position(value)
  {
    if(!typechecker.check({ type: 'string', value: value }))
    {
      console.error(this.#errors.positionTypeError);
      return;
    }

    let validPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    if(!validPositions.includes(value)) console.error(this.#errors.positionInvalidError);

    let pos = '';
    if(value == 'top-left') pos = 'top left';
    if(value == 'top-right') pos = 'top right';
    if(value == 'bottom-left') pos = 'bottom left';
    if(value == 'bottom-right') pos = 'bottom right';

    this.setAttribute({ key: 'position', value: pos });
    this.#position = value;
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'fab-button', constructor: _FabButton_ });

///////////////////////////////////////////////////////////
