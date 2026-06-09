
///////////////////////////////////////////////////////////

/** Class representing a column component. */
class _Column_ extends Component 
{ 
  #errors;
  #width;

  /**
   * Creates the column object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'ons-col', options });

    this.#errors = 
    {
      centerTypeError: 'Column Error: Expected type boolean for center.',
      componentTypeError: 'Column Error: Expected type component for component.',
      componentsTypeError: 'Column Error: Expected type array for components in addComponents call.',
      widthTypeError: 'Column Error: Expected type string for width.',
    };

    if(options.width) this.width = options.width;
  }

  /**
   * Get property to return the width of the column.
   * @return {string} The current width value.
   */
  get width() 
  {
    return this.#width;
  }

  /**
   * Set property to set the width of the column.
   * @param {string} value - Width of the column.
   */
  set width(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.widthTypeError);
      return;
    }
    this.setAttribute({ key: 'width', value });
    setTimeout(() => 
    {
      this.#width = value;
    }, 1);
  }

  /**
   * Public method to add one or multiple components to a column.
   * @param {array} components - Array of components to be added to the column.
   */
  addComponents({ components, center = true } = {}) 
  { 
    if(!typechecker.check({ type: 'array', value: components })) 
    {
      console.error(this.#errors.componentsTypeError);
      return;
    }
    if(!typechecker.check({ type: 'boolean', value: center })) 
    {
      console.error(this.#errors.centerTypeError);
      return;
    }
    components.forEach(component => 
    {
      if(!typechecker.check({ type: 'component', value: component })) 
      {
        console.error(this.#errors.componentTypeError);
        return;
      }
      if(center == true)
      {
        let centerContainer = document.createElement('div');
        centerContainer.style.display = 'flex';
        centerContainer.style.justifyContent = 'center';
        centerContainer.style.alignItems = 'center';
        centerContainer.style.width = '100%';
        centerContainer.style.height = '100%';
        
        centerContainer.appendChild(component.element);
        this.appendChild({ child: centerContainer });
      }
      else this.element.appendChild(component.element);
    });
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'column', constructor: _Column_ }); 

///////////////////////////////////////////////////////////