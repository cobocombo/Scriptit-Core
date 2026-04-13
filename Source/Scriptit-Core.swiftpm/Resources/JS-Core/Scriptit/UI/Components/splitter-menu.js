
///////////////////////////////////////////////////////////

/** Class representing the splitter menu component. */
class _SplitterMenu_ extends Component
{
  #errors;
  #mode;
  #side;
  #swipeable;
  #root;
  #width;
  
  /**
   * Creates the splitter menu object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'ons-splitter-side', options: options });

    this.#errors = 
    {
      modeTypeError: 'Splitter Menu Error: Expected type string for mode.',
      rootTypeError: 'Splitter Menu Error: Root must be a Page, Tabbar, or Navigator component.',
      sideTypeError: 'Splitter Menu Error: Expected type string for side.',
      swipeableTypeError: 'Splitter Menu Error: Expected type swipeable for swipeable.',
      widthTypeError: 'Splitter Menu Error: Expected type string for width.'
    };
    
    this.mode = options.mode || 'split';
    this.swipeable = options.swipeable || true;
    this.width = options.width || '225px';
    if(options.root) this.root = options.root;
  }
  
  /** 
   * Get property to return the mode of the splitter menu.
   * @return {string} The mode of the splitter menu. 
   */
  get mode() 
  { 
    return this.#mode; 
  }
  
  /** 
   * Set property to set the mode of the splitter menu.
   * @param {string} value - The the mode of the splitter menu. Options are split or collpase.
   */
  set mode(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.modeTypeError);
      return;
    }
    if(this.#mode)
    {
      this.removeAttribute({ key: 'split' });
      this.removeAttribute({ key: 'collapse' });
    }
    if(value == 'split')
    {
      this.setAttribute({ key: 'split', value: '' });
      this.#mode = value;
    } 
    else
    {
      this.setAttribute({ key: 'collapse', value: '' });
      this.#mode = 'collapse';
    } 
  }
  
  /** 
   * Get property to return the side of the splitter menu.
   * @return {string} The side of the splitter menu. 
   */
  get side() 
  { 
    return this.#side; 
  }
  
  /** 
   * Set property to set the side of the splitter menu.
   * @param {string} value - The side of the splitter menu. Options are left or right, but defaults to left.
   */
  set side(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.sideTypeError);
      return;
    }
    if(value == 'right')
    {
      this.setAttribute({ key: 'side', value: 'right' });
      this.#side = value;
    } 
    else 
    {
      this.setAttribute({ key: 'side', value: 'left' });
      this.#side = value;
    }
  }
  
  /** 
   * Get property to return if the splitter menu is swipeable or not.
   * @return {boolean} The splitter menu's swipeable value. 
   */
  get swipeable() 
  {
     return this.#swipeable; 
  }
  
  /** 
   * Set property to set the splitter menu's swipeable value.
   * @param {boolean} value - The splitter menu's swipeable value.
   */
  set swipeable(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) 
    {
      console.error(this.#errors.swipeableTypeError);
      return;
    }
    if(value == true) this.setAttribute({ key: 'swipeable', value: '' });
    else this.removeAttribute({ key: 'swipeable' });
    this.#swipeable = value;
  }
  
  /** 
   * Get property to return the root component of the splitter menu.
   * @return {Multiple} The root component of the splitter menu. Supports Page, Navigator or Tabbar. 
   */
  get root() 
  { 
    return this.#root; 
  }
  
  /** 
   * Set property to set the splitter menu's root component.
   * @param {Multiple} value - The root component of the splitter menu.
   */
  set root(value)
  {
    if(!typechecker.checkMultiple({ types: [ 'page', 'navigator', 'tabbar' ], value: value })) 
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
    this.#root = value.element;
    this.appendChild({ child: value.element });
  }
  
  /** 
   * Get property to return the width of the splitter menu.
   * @return {string} The width of the splitter menu. 
   */
  get width() 
  { 
    return this.#width; 
  }
  
  /** 
   * Set property to set the width of the splitter menu.
   * @param {string} value - The width of the splitter menu.
   */
  set width(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.widthTypeError);
      return;
    }
    this.setAttribute({ key: 'width', value: value });
    setTimeout(() => { this.#width = value; },1);
  }
  
  /* Public method to close the splitter menu. */
  close() 
  { 
    this.element.close(); 
  }
  
  /* Public method to open the splitter menu. */
  open() 
  { 
    this.element.open(); 
  }
  
  /* Public method to toggle the splitter menu. */
  toggle() 
  { 
    this.element.toggle(); 
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'splitter-menu', constructor: _SplitterMenu_ });

///////////////////////////////////////////////////////////
