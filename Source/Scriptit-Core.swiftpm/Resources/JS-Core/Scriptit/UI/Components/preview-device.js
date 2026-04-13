//////////////////////////////////////////////////

/** Class representing the preview device. */
class _PreviewDevice_ extends ui.Component
{
  #errors;
  #lastPolledOrientation;
  #onOrientationChange;
  #orientation;
  #orientations;
  #orientationPoller;
  #type;
  #types;
  #scale;
  #screen;

  /** Creates the preview device object. */
  constructor(options = {})
  {
    super({ tagName: 'div', options: options });
    this.#errors = 
    {
      invalidOrientationError: (orientation) => `Preview Device Error: Orientation "${orientation}" is not supported.`,
      invalidTypeError: (type) => `Preview Device Error: Type "${type}" is not supported.`,
      onOrientationChangeTypeError: 'Preview Device Error: Expected type function for onOrientationChange.',
      orientationTypeError: 'Preview Device Error: Expected type string for orientation.',
      scaleTypeError: 'Preview Device Error: Expected type number for scale.',
      screenTypeError: 'Preview Device Error: Expected type component for screen.',
      typeTypeError: 'Preview Device Error: Expected type string for type.'
    };    
    
    this.#types = 
    {
      iphone4sBlack: 
      {
        className: 'marvel-device iphone4s black',
        screen: { width: 320, height: 480 },
        total: { width: 360, height: 520 }, 
        parts: ['top-bar', 'sleep', 'volume', 'camera', 'sensor', 'speaker', 'screen', 'home', 'bottom-bar']
      },
    
      iphone4sWhite: 
      {
        className: 'marvel-device iphone4s silver',
        screen: { width: 320, height: 480 },
        total: { width: 360, height: 520 },
        parts: ['top-bar', 'sleep', 'volume', 'camera', 'sensor', 'speaker', 'screen', 'home', 'bottom-bar']
      },
    
      ipadMiniBlack: 
      {
        className: 'marvel-device ipad black',
        screen: { width: 768, height: 1024 },
        total: { width: 800, height: 1070 },
        parts: ['camera', 'screen', 'home']
      },
    
      ipadMiniWhite: 
      {
        className: 'marvel-device ipad silver',
        screen: { width: 768, height: 1024 },
        total: { width: 800, height: 1070 },
        parts: ['camera', 'screen', 'home']
      }
    };
    
    this.#scale = 1;
    
    this.#orientations =
    {
      landscape: 'landscape',
      portrait: 'portrait'
    }
    
    this.type = options.type || this.types.ipadMiniBlack;
    this.orientation = options.orientation || this.orientations.landscape;
    
    this.#lastPolledOrientation = this.#orientation;
    this.#orientationPoller = setInterval(() =>
    {
      let current = device.currentOrientation;
      if(!current) return;
    
      if(!Object.values(this.#orientations).includes(current)) return;
    
      if(current !== this.#lastPolledOrientation)
      {
        this.#lastPolledOrientation = current;
    
        if(this.#onOrientationChange)
        {
          this.#onOrientationChange(current, this);
        }
      }
    
    }, 1000);
  }
  
  /** Private method to apply orientation logic. */
  #applyOrientation()
  {
    if(!this.element) return;
  
    this.element.classList.remove('landscape');
    this.element.style.transform = '';
    
    if(this.#screen)
    {
      this.#screen.style.transform = '';
      this.#screen.style.transformOrigin = '';
    }
  
    if(this.#orientation === this.#orientations.landscape)
    {
      this.element.classList.add('landscape');
    }
  
    this.#updateTransform();
  }

  /** Private method to build the device every time a worthy property is changed. */
  #build()
  {
    this.element.innerHTML = '';
    let def = this.#types[this.#type];
    this.setAttribute({ key: 'class', value: def.className });
  
    def.parts.forEach(part =>
    {
      let el = new ui.Component({ tagName: 'div', options: {} });
      el.setAttribute({ key: 'class', value: part });
      if(part === 'screen') this.#screen = el;
      this.appendChild({ child: el });
    });
  
    this.#applyOrientation();
  }
  
  /** Private method to update the transform of the device. */
  #updateTransform()
  {
    let rotation = '';
  
    if(this.#orientation === this.#orientations.landscape)
    {
      rotation = 'rotate(180deg)';
    }
  
    this.element.style.transform = `${rotation} scale(${this.#scale})`;
    if(this.#screen)
    {
      this.#screen.style.transformOrigin = 'center';
      this.#screen.style.transform = rotation;
    }
  }
  

  /**
   * Get property to return the function being called when orientation changes.
   * @return {Function}
   */
  get onOrientationChange()
  {
    return this.#onOrientationChange;
  }
  
  /**
   * Set property to set the function called when orientation changes.
   * @param {Function} handler - Called with (newOrientation, deviceInstance)
   */
  set onOrientationChange(value)
  {
    if(!typechecker.check({ type: 'function', value: value }))
    {
      console.error(this.#errors.onOrientationChangeTypeError);
      return;
    }
  
    this.#onOrientationChange = value;
  }
  
  /** 
   * Get property to return the device's current orientation.
   * @return {String} The device's current orientation.
   */
  get orientation()
  {
    return this.#orientation;
  }
  
  /** 
   * Set property to set the device's orientation.
   * @param {String} value - The device's orientation. Valid values are landscape-right, landscape-left, and portrait. See this.orientations.
   */
  set orientation(value)
  {
    if(!typechecker.check({ type: 'string', value }))
    {
      console.error(this.#errors.orientationTypeError);
      return;
    }
  
    if(!Object.values(this.orientations).includes(value))
    {
      console.error(this.#errors.invalidOrientationError(value));
      return;
    }
  
    if(this.#orientation === value) return;
  
    this.#orientation = value;
    this.#applyOrientation();
  
    if(this.#onOrientationChange)
    {
      this.#onOrientationChange(value, this);
    }
  }
  
  /** 
   * Get property to return the device's supported orientations.
   * @return {Object} The device's supported orientations.
   */
  get orientations()
  {
    return this.#orientations;
  }

  /** 
   * Get property to return the device's current type.
   * @return {Object} The device's current type.
   */
  get type()
  {
    return this.#type;
  }

  /** 
   * Set property to set the device's type.
   * @param {Object} value - The device's type. See this.types.
   */
  set type(value)
  {
    if(typechecker.check({ type: 'object', value: value }))
    {
      let match = Object.entries(this.#types).find(([, def]) => def === value);
      if(!match)
      {
        console.error(this.#errors.invalidTypeError(value));
        return;
      }
      value = match[0];
    }
  
    if(!typechecker.check({ type: 'string', value: value }))
    {
      console.error(this.#errors.typeTypeError);
      return;
    }
  
    if(!this.#types[value])
    {
      console.error(this.#errors.invalidTypeError(value));
      return;
    }
  
    this.#type = value;
    this.#build();
  }

  /** 
   * Get property to return the device's supported types.
   * @return {Object} The device's supported types.
   */
  get types()
  {
    return this.#types;
  }

  /** 
   * Get property to return the device's screen component.
   * @return {Component} The device's screen component.
   */
  get screen()
  {
    return this.#screen;
  }

  /** 
   * Set property to set the device's screen component.
   * @param {String} value - The device's screen component.
   */
  set screen(value)
  {
    if(!typechecker.check({ type: 'component', value: value }))
    {
      console.error(this.#errors.screenTypeError);
      return;
    }
    
    if(!this.#screen) return;
    this.#screen.innerHTML = '';
    this.#screen.appendChild({ child: value });
  }

  /** 
   * Get property to return the device's screen width.
   * @return {Number} The device's screen width.
   */
  get screenWidth()
  {
    return this.#types[this.#type].screen.width;
  }

  /** 
   * Get property to return the device's screen height.
   * @return {Number} The device's screen height.
   */
  get screenHeight()
  {
    return this.#types[this.#type].screen.height;
  }
  
  /** 
   * Get property to return the device's scale.
   * @return {Number} The device's scale.
   */
  get scale()
  {
    return this.#scale;
  }
  
  /** 
   * Set property to set the device's scale.
   * @param {String} value - The device's scale.
   */
  set scale(value)
  {
    if(!typechecker.check({ type: 'number', value: value }))
    {
      console.error(this.#errors.scaleTypeError);
      return;
    }
    
    this.#scale = value;
    this.#updateTransform();
  }
  
  /** 
   * Get property to return the device's totalwidth.
   * @return {Number} The device's total width.
   */
  get totalWidth()
  {
    return this.#types[this.#type].total.width;
  }
  
  /** 
   * Get property to return the device's total height.
   * @return {Number} The device's total height.
   */
  get totalHeight()
  {
    return this.#types[this.#type].total.height;
  }
}

//////////////////////////////////////////////////

typechecker.register({ name: 'preview-device', constructor: _PreviewDevice_ });

//////////////////////////////////////////////////