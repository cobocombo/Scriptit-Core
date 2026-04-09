///////////////////////////////////////////////////////////

/** Class representing the popover component. */
class _Popover_ extends Component 
{
  #errors;
  #cancelable;
  #contentElement;
  #direction;
  #target;

  /**
   * Creates the popover object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'ons-popover', options });

    this.#errors = 
    {
      cancelableTypeError: 'Popover Error: Expected type boolean for cancelable.',
      componentTypeError: 'Popover Error: Expected type component.',
      componentsTypeError: 'Popover Error: Expected type array for components in addComponents call.',
      directionTypeError: 'Popover Error: Expected type string for direction.',
      directionInvalidError: 'Popover Error: Invalid value for direction. Valid values are: up, down, left or right.',
      dismissAnimationTypeError: 'Popover Error: Expected type boolean for animated when dismissing the popover.',
      presentAnimationTypeError: 'Popover Error: Expected type boolean for animated when presenting the popover.',
      targetNotSetError: 'Popover Error: Could not present popover, target was not set.',
      targetTypeError: 'Popover Error: Expected type Component for target.'
    }
    
    this.#contentElement = document.createElement('div');
    this.#contentElement.classList.add('popover-content');
    this.element.appendChild(this.#contentElement);

    this.cancelable = options.cancelable || true;
    this.direction = options.direction || 'down';
  }

  /** 
   * Get property to return if the popover is cancelable or not.
   * @return {boolean} The popover's cancelable value.
   */
  get cancelable()
  {
    return this.#cancelable;
  }

  /** 
   * Set property to set the popover's cancelable value.
   * @param {boolean} value - The popover's cancelable value.
   */
  set cancelable(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) 
    {
      console.error(this.#errors.cancelableTypeError);
      return;
    }
    if(value == true) this.setAttribute({ key: 'cancelable', value: '' });
    else this.removeAttribute({ key: 'cancelable' });
    this.#cancelable = value;
  }

  /** 
   * Get property to return the popover's direction value.
   * @return {string} The popover's direction value.
   */
  get direction()
  {
    return this.#direction;
  }

  /** 
   * Set property to set the popover's direction value.
   * @param {boolean} value - The popover's direction value.
   */
  set direction(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.directionTypeError);
      return;
    }
    let validDirections = ['up', 'down', 'left', 'right'];
    if(!validDirections.includes(value)) 
    {
      console.error(this.#errors.directionInvalidError);
      return;
    }
    this.setAttribute({ key: 'direction', value: value });
    this.#direction = value;
  }

  /**
   * Public method to add one or multiple components to a popover.
   * @param {array} components - Array of components to be added to the popover.
   */
  addComponents({ components } = {}) 
  {
    if(!typechecker.check({ type: 'array', value: components })) 
    {
      console.error(this.#errors.componentsTypeError);
      return;
    }
    components.forEach(component => 
    {
      if(typechecker.check({ type: 'component', value: component })) this.#contentElement.appendChild(component.element);
      else 
      {
        console.error(this.#errors.componentTypeError);
        return;
      }
    });
  }

  /**
   * Public method to dismiss a dialog, that has previously been shown.
   * @param {boolean} animated - Boolean value to determine if the dialog should be dismissed with animation or not.
   */
  dismiss({ animated = true } = {}) 
  {
    if(!typechecker.check({ type: 'boolean', value: animated })) 
    {
      console.error(this.#errors.dismissAnimationTypeError);
      return;
    }
    if(animated) this.setAttribute({ key: 'animation', value: 'default' });
    else this.setAttribute({ key: 'animation', value: 'none' });    
    this.element.hide();
  }

  /**
   * Public method to present a popover.
   * @param {boolean} animated - Boolean value to determine if the popover should be shown with animation or not.
   * @param {Component} target - Component to present the popover from.
   */
  present({ animated = true, target = null } = {}) 
  {
    if(!target) 
    {
      console.error(this.#errors.targetNotSetError);
      return;
    }

    if(!typechecker.check({ type: 'component', value: target })) 
    {
      console.error(this.#errors.targetTypeError);
      return;
    }

    if(!typechecker.check({ type: 'boolean', value: animated })) 
    {
      console.error(this.#errors.presentAnimationTypeError);
      return;
    }
    
    if(animated) this.setAttribute({ key: 'animation', value: 'default' });
    else this.setAttribute({ key: 'animation', value: 'none' });

    document.body.appendChild(this.element);
    this.element.show(target.element);    
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'popover', constructor: _Popover_ });

///////////////////////////////////////////////////////////
