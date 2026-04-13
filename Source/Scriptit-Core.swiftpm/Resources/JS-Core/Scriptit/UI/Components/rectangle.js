///////////////////////////////////////////////////////////

/** Class representing the Rectangle component. */
class _Rectangle_ extends Component
{
  /**
   * Creates the rectangle object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'div', options });

    this.width = options.width || '100px';
    this.height = options.height || '100px';
    this.backgroundColor = options.backgroundColor || 'gray';
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'rectangle', constructor: _Rectangle_ });

///////////////////////////////////////////////////////////