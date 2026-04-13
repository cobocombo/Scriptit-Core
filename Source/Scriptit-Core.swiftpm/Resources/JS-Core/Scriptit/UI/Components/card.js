
///////////////////////////////////////////////////////////

/** Class representing the card component. */
class _Card_ extends Component
{
  #errors;

  /**
   * Creates the card object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {})
  {
    super({ tagName: 'ons-card', options: options });

    this.#errors = 
    {
      componentTypeError: 'Card Error: Expected type component for component.',
      componentsTypeError: 'Card Error: Expected type array for components.',
      pageUnsupportedTypeError: 'Card Error: Cannot add a page to a card component. See modal instead.'
    }
  }

  /**
   * Public method to add one or multiple components to a card.
   * @param {array} components - Array of components to be added to the card.
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
      if(!typechecker.check({ type: 'component', value: component })) 
      {
        console.error(this.#errors.componentTypeError);
        return;
      }
      if(typechecker.check({ type: 'page', value: component })) 
      {
        console.error(this.#errors.pageUnsupportedTypeError);
        return;
      }
      this.appendChild({ child: component });
    });
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'card', constructor: _Card_ });

///////////////////////////////////////////////////////////
