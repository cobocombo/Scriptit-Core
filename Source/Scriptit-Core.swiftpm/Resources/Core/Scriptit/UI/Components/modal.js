///////////////////////////////////////////////////////////

/** Class representing the modal component. */
class _Modal_ extends Component
{
  #errors;
  #root;
  
  /**
   * Creates the modal object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {})
  {
    super({ tagName: 'ons-modal' , options: options });

    this.#errors = 
    {
      componentTypeError: 'Modal Error: Expected type component in components array.',
      componentsTypeError: 'Modal Error: Expected type array for components in addComponents call.',
      dismissAnimationTypeError: 'Modal Error: Expected type boolean for animated when dismissing the modal.',
      presentAnimationTypeError: 'modal Error: Expected type boolean for animated when presenting the modal.',
      rootComponentPreventsOtherComponentsError: 'Modal Error: Modal already contains an instance of root and cannot add any other components.',
      rootComponentTypeError: 'Modal Error: Expected type Page when adding page to modal.'
    }
  }
  
  /**
   * Public method to add one or multiple components to a modal.
   * @param {array} components - Array of components to be added to the modal.
   */
  addComponents({ components } = {})
  {
    if(this.#root) 
    {
      console.error(this.#errors.rootComponentPreventsOtherComponentsError);
      return;
    }
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
      this.appendChild({ child: component });
    });
  }
  
  /**
   * Public method to dismiss a modal, that has previously been shown.
   * @param {boolean} animated - Boolean value to determine if the modal should be hidden with animation or not.
   */
  dismiss({ animated = true } = {})
  {
    if(!typechecker.check({ type: 'boolean', value: animated })) 
    {
      console.error(this.#errors.dismissAnimationTypeError);
      return;
    }
    if(animated) this.setAttribute({ key: 'animation', value: 'lift' });
    else this.setAttribute({ key: 'animation', value: 'none' });    
    this.element.hide();
  }
  
  /**
   * Public method to present a modal.
   * @param {boolean} animated - Boolean value to determine if the modal should be shown with animation or not.
   */
  present({ animated = true, root = null } = {})
  {
    if(!this.#root)
    {
      if(root)
      {
        if(!typechecker.check({ type: 'page', value: root })) // Need to add Navigator support here.
        {
          console.error(this.#errors.rootComponentTypeError);
          return;
        }
        this.#root = root;
        this.appendChild({ child: root });
      }
    }

    if(!typechecker.check({ type: 'boolean', value: animated })) 
    {
      console.error(this.#errors.presentAnimationTypeError);
      return;
    }
    if(animated) this.setAttribute({ key: 'animation', value: 'lift' });
    else this.setAttribute({ key: 'animation', value: 'none' });

    document.body.appendChild(this.element);
    this.element.show();
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'modal', constructor: _Modal_ });

///////////////////////////////////////////////////////////
