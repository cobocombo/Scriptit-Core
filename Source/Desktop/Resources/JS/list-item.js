
///////////////////////////////////////////////////////////

/** Class representing the list item component. */
class _ListItem_ extends Component 
{
  #center;
  #errors;
  #expandable;
  #left;
  #right;
  #tappable;

  /**
   * Creates the list item object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'ons-list-item', options: options });

    this.#errors = 
    {
      componentTypeError: 'List Item Error: Expected type string or component for left, center, right, or expandable.',
      tappableTypeError: 'List Item Error: Expected type boolean for tappable.'
    }
    
    if(options.center) this.center = options.center;
    if(options.expandable) this.expandable = options.expandable;
    if(options.left) this.left = options.left;
    if(options.right) this.right = options.right;
    this.tappable = options.tappable || false;
  }
  
  /** Private method to set the appropriate content in the correct portion of the list item. */
  #setContent(position, content) 
  {
    let div = this.element.querySelector(`.${position}`);

    if(!div) 
    {
      div = document.createElement('div');
      div.className = position;
      this.appendChild({ child: div });
    }

    if(typechecker.check({ type: 'component', value: content })) div.appendChild(content.element);
    else if(typechecker.check({ type: 'string', value: content })) div.textContent = content;
    else
    {
      console.error(this.#errors.componentTypeError);
      return;
    }
  }

  /** 
   * Get property to return content from the center of the list item.
   * @return {multiple} The content from the center of the list item. Can return either a component or string.
   */
  get center() 
  { 
    return this.#center; 
  }
  
  /** 
   * Set property to set the content for the center portion of the list item.
   * @param {multiple} value - The content for the center portion of the list item. Can accept either a component or string.
   */
  set center(value) 
  { 
    this.#setContent('center', value); 
    this.#center = value;
  }

  /** 
   * Get property to return content from the expandable portion of the list item.
   * @return {multiple} The content from the expandable portion of the list item. Can return either a component or string.
   */
  get expandable() 
  { 
    return this.#expandable; 
  }
  
  /** 
   * Set property to set the content for the expandable portion of the list item.
   * @param {multiple} value - The content for the expandable portion of the list item. Can accept either a component or string.
   */
  set expandable(value) 
  { 
    this.setAttribute({ key: 'expandable', value: ''});
    this.#setContent('expandable-content', value); 
    this.#expandable = value;
  }

  /** 
   * Get property to return content from the left portion of the list item.
   * @return {multiple} The content from the left portion of the list item. Can return either a component or string.
   */
  get left() 
  { 
    return this.#left; 
  }
  
  /** 
   * Set property to set the content for the left portion of the list item.
   * @param {multiple} value - The content for the left portion of the list item. Can accept either a component or string.
   */
  set left(value) 
  { 
    this.#setContent('left', value);
    this.#left = value; 
  }

  /** 
   * Get property to return content from the right portion of the list item.
   * @return {multiple} The content from the right portion of the list item. Can return either a component or string.
   */
  get right() 
  { 
    return this.#right; 
  }
  
   /** 
   * Set property to set the content for the right portion of the list item.
   * @param {multiple} value - The content for the right portion of the list item. Can accept either a component or string.
   */
  set right(value) 
  { 
    this.#setContent('right', value); 
    this.#right = value;
  }

  /** 
   * Get property to return if the list item is tappable or not.
   * @return {boolean} Value that determines if the list item is tappable or not.
   */
  get tappable() 
  { 
    return this.#tappable; 
  }

  /** 
   * Set property to make the list item tappable or not.
   * @param {multiple} value - The value determining if the list item tappable or not.
   */
  set tappable(value) 
  {
    if(!typechecker.check({ type: 'boolean', value: value }))
    {
      console.error(this.#errors.tappableTypeError);
      return;
    }
    if(value == true) this.addModifier({ modifier: 'tappable' });
    else this.removeModifier({ modifier: 'tappable' });
    this.#tappable = value;
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'list-item', constructor: _ListItem_ });

///////////////////////////////////////////////////////////
