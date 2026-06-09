
///////////////////////////////////////////////////////////

/** Class representing the splitter component. */
class _Splitter_ extends Component 
{
  #detail;
  #errors;
  #leftMenu;
  #rightMenu;

  /**
   * Creates the splitter object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'ons-splitter', options: options });

    this.#errors = 
    {
      detailTypeError: 'Splitter Error: Detail must be a Page, Tabbar, or Navigator component.',
      leftMenuTypeError: 'Splitter Error: Expected type SplitterMenu for leftMenu.',
      rightMenuTypeError: 'Splitter Error: Expected type SplitterMenu for rightMenu.'
    };
    
    if(options.detail) this.detail = options.detail;
    if(options.leftMenu) this.leftMenu = options.leftMenu;
    if(options.rightMenu) this.rightMenu = options.rightMenu;
  }
  
  /** 
   * Get property to return the left menu of the splitter.
   * @return {SplitterMenu} The left menu of the splitter. 
   */
  get leftMenu() 
  { 
    return this.#leftMenu; 
  }
  
  /** 
   * Set property to set the left menu of the splitter.
   * @param {string} value - The left menu of the splitter.
   */
  set leftMenu(value)
  {
    if(!typechecker.check({ type: 'splitter-menu', value: value })) 
    {
      console.error(this.#errors.leftMenuTypeError);
      return;
    }
    value.side = 'left';
    this.#leftMenu = value;
    this.appendChild({ child: this.#leftMenu });
  }
  
  /** 
   * Get property to return the right menu of the splitter.
   * @return {SplitterMenu} The right menu of the splitter. 
   */
  get rightMenu() 
  {
    return this.#rightMenu; 
  }
  
  /** 
   * Set property to set the right menu of the splitter.
   * @param {string} value - The right menu of the splitter.
   */
  set rightMenu(value)
  {
    if(!typechecker.check({ type: 'splitter-menu', value: value })) 
    {
      console.error(this.#errors.rightMenuTypeError);
      return;
    }
    value.side = 'right';
    this.#rightMenu = value;
    this.appendChild({ child: this.#rightMenu });
  }

  /** 
   * Get property to return the detail of the splitter.
   * @return {multiple} The detail of the splitter. 
   */
  get detail() 
  { 
    return this.#detail; 
  }
  
  /** 
   * Set property to set the detail of the splitter.
   * @param {multiple} value - The detail of the splitter.
   */
  set detail(value)
  {
    if(!typechecker.checkMultiple({ types: [ 'page', 'navigator', 'tabbar' ], value: value })) 
    {
      console.error(this.#errors.detailTypeError);
      return;
    }
  
    this.#detail = value;
  
    let existing = this.element.querySelector('ons-splitter-content');
    if(existing) this.element.removeChild(existing);
    let contentWrapper = document.createElement('ons-splitter-content');

    contentWrapper.appendChild(value.element);
    this.appendChild({ child: contentWrapper });
  }  
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'splitter', constructor: _Splitter_ });

///////////////////////////////////////////////////////////
