///////////////////////////////////////////////////////////

/** Base class representing most of the components in the ui module. */
class Component
{
  #errors;
  #element;
  #onTap;
  
  /**
   * Creates the component object.
   * @param {string} tagName - Name of the html tag to be created.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor({ tagName = 'div', options } = {})
  {
    this.#errors = 
    {
      addEvEventTypeError: 'Component Error: Expected type string for event when adding an event listener',
      addEvHandlerTypeError: 'Component Error: Expected type function for handler when trying add an event listener.',
      addModModifierTypeError: 'Component Error: Expected type string when adding modifier with addModifier.',
      alphaInvalidError: 'Component Error: Alpha value must be a string between "0.0" and "1.0" inclusive.',
      alphaTypeError: 'Component Error: Expected type string for alpha.',
      backgroundColorInvalidTypeError: 'Component Error: Invalid color value provided for backgroundColor.',
      backgroundColorTypeError: 'Component Error: Expected type string for backgroundColor.',
      borderColorTypeError: 'Component Error: Expected type string for borderColor.',
      borderColorInvalidError: 'Component Error: Invalid color value for borderColor.',
      borderWidthTypeError: 'Component Error: Expected type string for borderWidth.',
      getAttributeKeyTypeError: 'Component Error: Expected type string for key when trying to get the attribute value that corresponds with the key provided.',
      heightTypeError: 'Component Error: Expected type string for height.',
      idTypeError: 'Component Error: Expected type string for id.',
      marginBottomTypeError: 'Component Error: Expected type string for marginBottom.',
      marginLeftTypeError: 'Component Error: Expected type string for marginLeft.',
      marginRightTypeError: 'Component Error: Expected type string for marginRight.',
      marginTopTypeError: 'Component Error: Expected type string for marginTop.',
      modifierTypeError: 'Component Error: Each modifier in the modifiers array must be of type string.',
      modifiersTypeError: 'Component Error: Expected type array for modifiers.',
      noTagNameParameterError: 'Component Error: No tagName parameter was detected.',
      onTapTypeError: 'Component Error: Expected type function for onTap.',
      removeAttributeKeyTypeError: 'Component Error: Expected type string for key when trying to remove the attribute value that corresponds with the key provided.',
      removeEvEventTypeError: 'Component Error: Expected type string for event when trying to remove an event listener',
      removeEvHandlerTypeError: 'Component Error: Expected type function for handler when trying to remove an event listener.',
      removeComponentError: 'Component Error: Componenet could not be removed as expected.',
      removeModModifierTypeError: 'Component Error: Expected type string when removing modifier with removeModifier.',
      setAttributeKeyTypeError: 'Component Error: Expected type string for key when trying to set the attribute value that corresponds with the key provided.',
      setAttributeValueTypeError: 'Component Error: Expected type string for value when trying to set the attribute value that corresponds with the key provided.',
      tagNameTypeError: 'Component Error: Expected type string for tagName.',
      transformTypeError: 'Component Error: Expected type string for transform.',
      widthTypeError: 'Component Error: Expected type string for width.'
    };

    if(tagName) this.#createElement({ tagName: tagName });
    if(options.alpha) this.alpha = options.alpha;
    if(options.backgroundColor) this.backgroundColor = options.backgroundColor;
    if(options.borderColor) this.borderColor = options.borderColor;
    if(options.borderWidth) this.borderWidth = options.borderWidth;
    if(options.height) this.height = options.height;
    if(options.id) this.id = options.id;
    if(options.marginBottom) this.marginBottom = options.marginBottom;
    if(options.marginLeft) this.marginLeft = options.marginLeft;
    if(options.marginRight) this.marginRight = options.marginRight;
    if(options.marginTop) this.marginTop = options.marginTop;
    if(options.modifiers) this.modifiers = options.modifiers;
    if(options.onTap) this.onTap = options.onTap;
    if(options.transform) this.transform = options.transform;
    if(options.width)  this.width = options.width;
  }
  
  /** 
   * Private method to create the base element via supplied html tag.
   * @param {string} tagName - Name of the html tag to be created.
   */
  #createElement({ tagName } = {})
  {
    if(!tagName) 
    {
      console.error(this.#errors.noTagNameParameterError);
      return;
    }
    if(!typechecker.check({ type: 'string', value: tagName })) 
    {
      console.error(this.#errors.tagNameTypeError);
      return;
    }
    this.#element = document.createElement(tagName);
  }
  
  /** 
   * Get property to return the component's alpha or opacity value.
   * @return {string} The alpha or opacity value.
   */
  get alpha() 
  { 
    return this.#element.style.opacity; 
  }
  
  /** 
   * Set property to change the component's alpha or opacity value.
   * @param {string} value - The alpha or opacity value. Must be between "0.0" and "1.0" inclusive.
   */
  set alpha(value)
  { 
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.alphaTypeError);
      return;
    }
    let numeric = parseFloat(value);
    if(isNaN(numeric) || numeric < 0.0 || numeric > 1.0) 
    {
      console.error(this.#errors.alphaInvalidError);
      return;
    }
    this.#element.style.opacity = value;
  }
  
  /** 
   * Get property to return the component's background color value.
   * @return {string} The background color value.
   */
  get backgroundColor() 
  { 
    return this.#element.style.backgroundColor; 
  }
  
  /** 
   * Set property to change the component's background color value.
   * @param {string} value - The valid color value.
   */
  set backgroundColor(value)
  {   
    if(!typechecker.check({ type: 'string', value: value }))
    {
      console.error(this.#errors.backgroundColorTypeError);
      return;
    }
    if(!color.isValid({ color: value })) 
    {
      console.error(this.#errors.backgroundColorInvalidTypeError);
      return;
    }
    this.#element.style.backgroundColor = value;
  }

  /** 
   * Get property to return the component's border color value.
   * @return {string} The border color value.
   */
  get borderColor() 
  { 
    return this.style.borderColor; 
  }

  /** 
   * Set property to change the component's border color value.
   * @param {string} value - The valid color value.
   */
  set borderColor(value) 
  {
    if(!typechecker.check({ type: 'string', value }))
    {
      console.error(this.#errors.borderColorTypeError);
      return;
    }
    if(!color.isValid({ color: value }))
    {
      console.error(this.#errors.borderColorInvalidError);
      return;
    }
    this.style.borderColor = value;
    this.style.borderStyle = 'solid';
  }

  /** 
   * Get property to return the component's border width value.
   * @return {string} The border width value.
   */
  get borderWidth() 
  { 
    return this.style.borderWidth 
  }

  /** 
   * Set property to change the component's border width value.
   * @param {string} value - The valid width value.
   */
  set borderWidth(value) 
  {
    if(!typechecker.check({ type: 'string', value })) 
    {
      console.error(this.#errors.borderWidthTypeError);
      return;
    }
    this.style.borderWidth = value;
    this.style.borderStyle = 'solid';
  }
  
  /** 
   * Get property to return the component's html element structure.
   * @return {object} The html element structure of the component.
   */
  get element() 
  { 
    return this.#element; 
  }
  
  /** 
   * Get property to return the component's height value.
   * @return {string} The component's height value.
   */
  get height() 
  { 
    return this.#element.style.height; 
  }
  
  /** 
   * Set property to change the component's height value.
   * @param {string} value - The component's height value.
   */
  set height(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.heightTypeError);
      return;
    }
    this.#element.style.height = value;
  }

  /** 
   * Get property to return the component's id value.
   * @return {string} The component's id value.
   */
  get id() 
  { 
    return this.#element.id; 
  }
  
  /** 
   * Set property to change the component's id value.
   * @param {string} value - The component's id value.
   */
  set id(value)
  {
    if(!typechecker.check({ type: 'string', value: value }))
    {
      console.error(this.#errors.idTypeError);
      return;
    }
    this.#element.id = value;
    app.registerComponent({ component: this });
  }
  
  /** 
   * Get property to return the component's marginBottom value.
   * @return {string} The component's marginBottom value.
   */
  get marginBottom() 
  { 
    return this.#element.style.marginBottom; 
  }
  
  /** 
   * Set property to change the component's marginBottom value.
   * @param {string} value - The component's marginBottom value.
   */
  set marginBottom(value)
  { 
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.marginBottomTypeError);
      return;
    }
    this.#element.style.marginBottom = value;
  }
  
  /** 
   * Get property to return the component's marginLeft value.
   * @return {string} The component's marginLeft value.
   */
  get marginLeft() 
  { 
    return this.#element.style.marginLeft; 
  }
  
  /** 
   * Set property to change the component's marginLeft value.
   * @param {string} value - The component's marginLeft value.
   */
  set marginLeft(value)
  {  
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.marginLeftTypeError);
      return;
    }
    this.#element.style.marginLeft = value;
  }
  
  /** 
   * Get property to return the component's marginRight value.
   * @return {string} The component's marginRight value.
   */
  get marginRight() 
  { 
    return this.#element.style.marginRight; 
  }
  
  /** 
   * Set property to change the component's marginRight value.
   * @param {string} value - The component's marginRight value.
   */
  set marginRight(value)
  {  
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.marginRightTypeError);
      return;
    }
    this.#element.style.marginRight = value;
  }
  
  /** 
   * Get property to return the component's marginTop value.
   * @return {string} The component's marginTop value.
   */
  get marginTop() 
  { 
    return this.#element.style.marginTop; 
  }
  
  /** 
   * Set property to change the component's marginTop value.
   * @param {string} value - The component's marginTop value.
   */
  set marginTop(value)
  { 
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.marginTopTypeError);
      return;
    }
    this.#element.style.marginTop = value;
  }
  
  /** 
   * Get property to return the component's modifiers.
   * @return {array} The component's modifiers as an array.
   */
  get modifiers()
  {
    let existingModifiers = this.getAttribute({ key: "modifier" }) || "";
    return new Array(existingModifiers.split(" ").filter(Boolean));
  }
  
  /** 
   * Set property to change the component's modifiers.
   * @param {array} value - The component's modifiers.
   */
  set modifiers(value)
  {
    if(!typechecker.check({ type: 'array', value: value })) 
    {
      console.error(this.#errors.modifiersTypeError);
      return;
    } 
    value.forEach(mod => 
    { 
      if(!typechecker.check({ type: 'string', value: mod }))
      {
        console.error(this.#errors.modifierTypeError);
        return;
      }
      setTimeout(() => { this.addModifier({ modifier: mod });}, 1)
    });
  }
  
  /** 
   * Get property to return the component's function declaration for onTap events.
   * @return {function} The component's function declaration for onTap events.
   */
  get onTap() 
  {
    return this.#onTap;
  }
  
  /** 
   * Set property to change the component's function declaration for onTap events.
   * @param {array} value - The component's function declaration for onTap events.
   */
  set onTap(value) 
  {
    if(!typechecker.check({ type: 'function', value: value })) 
    {
      console.error(this.#errors.onTapTypeError);
      return;
    }
    if(this.#onTap) this.removeEventListener({ event: 'click', handler: this.#onTap });
    this.#onTap = value;
    this.addEventListener({ event: 'click', handler: value });
  }
  
  /** 
   * Get property to return the component's internal style property.
   * @return {object} The component's internal style property.
   */
  get style() 
  { 
    return this.#element.style; 
  }

  /** 
   * Get property to return the component's internal transform property.
   * @return {string} The component's internal tranform property.
   */
  get transform() 
  { 
    return this.#element.transform; 
  }
  
  /** 
   * Set property to change the component's internal transform property.
   * @param {string} value - The component's internal transform value. 
   */
  set transform(value)
  {
    if(!typechecker.check({ type: 'string', value: value }))
    {
      console.error(this.#errors.transformTypeError);
      return;
    }    
    this.#element.style.transform = value;
  }
  
  /** 
   * Get property to return the component's width.
   * @return {string} The component's width value.
   */
  get width() 
  { 
    return this.#element.style.width;
  }
  
  /** 
   * Set property to change the component's width value.
   * @param {string} value - The component's width value.
   */
  set width(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.widthTypeError);
      return;
    }
    this.#element.style.width = value;
  }
  
  /** 
   * Public method to add a custom event listener to the component.
   * @param {string} event - Event type to listen to.
   * @param {function} handler - Function to be called when the event is triggered.
   */
  addEventListener({ event, handler } = {}) 
  { 
    if(!typechecker.check({ type: 'string', value: event }))
    {
      console.error(this.#errors.addEvEventTypeError);
      return;
    }
    if(!typechecker.check({ type: 'function', value: handler })) 
    {
      console.error(this.#errors.addEvHandlerTypeError);
      return;
    }
    this.#element.addEventListener(event, handler);
  }
  
  /** 
   * Public method to add a modifier to the component.
   * @param {string} modifier - Modifier to add to the component.
   */
  addModifier({ modifier } = {})
  {
    if(!typechecker.check({ type: 'string', value: modifier })) 
    {
      console.error(this.#errors.addModModifierTypeError);
      return;
    }
    let existingModifiers = this.getAttribute({ key: 'modifier' }) || "";
    let modifiers = new Set(existingModifiers.split(" ").filter(Boolean));
    modifiers.add(modifier);
    this.#element.setAttribute('modifier', Array.from(modifiers).join(" "));
  }
  
  /** 
   * Public method to add a child component to the current component.
   * @param {Component} child - Child component to be added to the current component.
   */
  appendChild({ child } = {}) 
  {
    if(typechecker.check({ type: 'component', value: child })) this.#element.appendChild(child.#element);
    else this.#element.appendChild(child); 
  }
  
  /** Public method to add the disabled atrribute to the component. */
  disable() 
  { 
    this.setAttribute({ key: 'disabled', value: '' }); 
  }
  
  /** Public method to remove the disabled atrribute to the component. */
  enable() 
  { 
    this.removeAttribute({ key: 'disabled' });
  }
  
  /** 
   * Public method to get the current attribute value for the provided key of the component.
   * @param {string} key - The key to retrive the associative attribute value.
   * @return {string} The attribute value associated with the key provided
   */
  getAttribute({ key } = {}) 
  {
    if(!typechecker.check({ type: 'string', value: key }))
    {
      console.error(this.#errors.getAttributeKeyTypeError);
      return;
    }
    return this.#element.getAttribute(key);
  }
  
  /** Public method to hide the component. */
  hide() 
  { 
    this.#element.style.display = 'none';
  }
  
  /** Public method to remove the component from the DOM. */
  remove() 
  {
    if(this.#element.parentNode) this.#element.parentNode.removeChild(this.#element);
    else console.error(this.#errors.removeComponentError);
  }
  
  /** 
   * Public method to remove the current attribute value for the provided key of the component.
   * @param {string} key - The key to remove the associative attribute value.
   */
  removeAttribute({ key } = {})
  {
    if(!typechecker.check({ type: 'string', value: key }))
    {
      console.error(this.#errors.removeAttributeKeyTypeError);
      return;
    }
    this.#element.removeAttribute(key);
  }
  
  /** 
   * Public method to remove a custom event listener to the component.
   * @param {string} event - Event type to be removed.
   * @param {function} handler - Function to be removed.
   */
  removeEventListener({ event, handler } = {}) 
  {
    if(!typechecker.check({ type: 'string', value: event })) 
    {
      console.error(this.#errors.removeEvEventTypeError);
      return;
    }
    if(!typechecker.check({ type: 'function', value: handler }))
    {
      console.error(this.#errors.removeEvHandlerTypeError);
      return;
    }
    this.#element.removeEventListener(event, handler);
  }
  
  /** 
   * Public method to remove a modifier to the component.
   * @param {string} modifier - Modifier to be removed to the component.
   */
  removeModifier({ modifier } = {}) 
  {
    if(!typechecker.check({ type: 'string', value: modifier }))
    {
      console.error(this.#errors.removeModModifierTypeError);
      return;
    }
    let existingModifiers = this.getAttribute({ key: 'modifier' }) || "";
    let modifiers = new Set(existingModifiers.split(" ").filter(Boolean));
    modifiers.delete(modifier);
    this.#element.setAttribute('modifier', Array.from(modifiers).join(" "));
  }

  /** 
   * Public method to set the attribute value for the provided key of the component.
   * @param {string} key - The key to set the associative attribute value.
   * @return {string} The attribute value associated with the key provided
   */
  setAttribute({ key, value } = {}) 
  { 
    if(!typechecker.check({ type: 'string', value: key })) 
    {
      console.error(this.#errors.setAttributeKeyTypeError);
      return;
    }
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.setAttributeValueTypeError);
      return;
    }
    this.#element.setAttribute(key, value);
  }
  
  /** Public method to show the component. */
  show() 
  { 
    this.#element.style.display = '';
  }  
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'component', constructor: Component });

///////////////////////////////////////////////////////////