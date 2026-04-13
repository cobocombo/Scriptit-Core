
///////////////////////////////////////////////////////////

/** Class representing the dialog component. */
class _Dialog_ extends Component
{
  #cancelable;
  #errors;
  #height;
  #root;
  #width;
  
  /**
   * Creates the dialog object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {})
  {
    super({ tagName: 'ons-dialog', options: options });

    this.#errors = 
    {
      cancelableTypeError: 'Dialog Error: Expected type boolean for cancelable.',
      componentTypeError: 'Dialog Error: Expected type component in components array.',
      componentsTypeError: 'Dialog Error: Expected type array for components in addComponents call.',
      dismissAnimationTypeError: 'Dialog Error: Expected type boolean for animated when dismissing the dialog.',
      heightTypeError: 'Dialog Error: Expected type string for height.',
      presentAnimationTypeError: 'Dialog Error: Expected type boolean for animated when presenting the dialog.',
      rootComponentTypeError: 'Dialog Error: Expected type Page when adding page to dialog.',
      rootComponentAlreadyAddedError: 'Dialog Error: Dialog already contains a root component.',
      rootComponentPreventsOtherComponentsError: 'Dialog Error: Dialog already contains an instance of root and cannot add any other components.',
      widthTypeError: 'Dialog Error: Expected type string for width.'
    }

    this.cancelable = options.cancelable || true;
    if(options.height) this.height = options.height;
    if(options.width) this.width = options.width;
  }

  /** 
   * Get property to return if the dialog is cancelable or not.
   * @return {boolean} The dialog's cancelable value.
   */
  get cancelable()
  {
    return this.#cancelable;
  }

  /** 
   * Set property to set the dialog's cancelable value.
   * @param {boolean} value - The dialog's cancelable value.
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
   * Get property to return the dialog's height.
   * @return {string} The dialog's height.
   */
  get height()
  {
    return this.#height;
  }
  
  /** 
   * Set property to change the dialog's height.
   * @param {string} value - The dialog's height. 
   */
  set height(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.heightTypeError);
      return;
    }

    setTimeout(() => 
    {
      let container = this.element.querySelector('.dialog');
      if(container) container.style.height = value;
      this.#height = value;
    }, 1);
  }
  
  /** 
   * Get property to return the dialog's width.
   * @return {string} The dialog's width.
   */
  get width()
  {
    return this.#width;
  }
  
  /** 
   * Set property to change the dialog's width.
   * @param {string} value - The dialog's width. 
   */
  set width(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.widthTypeError);
      return;
    }

    setTimeout(() => 
    {
      let container = this.element.querySelector('.dialog-container');
      let dialog = this.element.querySelector('.dialog');
  
      if(dialog) 
      {
        dialog.style.maxWidth = 'none';
        dialog.style.width = value;
        dialog.style.margin = '0 auto';
      }
  
      if(container) 
      {
        container.style.width = value;
        container.style.maxWidth = 'none';
        container.style.margin = '0 auto';
      }
  
      this.#width = value;
    }, 1);
  }

  /**
   * Public method to add one or multiple components to a dialog.
   * @param {array} components - Array of components to be added to the dialog. Will throw an error if it already contains a root component type.
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
   * Public method to present a dialog.
   * @param {boolean} animated - Boolean value to determine if the dialog should be shown with animation or not.
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
        setTimeout(() => 
        {
          let container = this.element.querySelector('.dialog-container');
          container.appendChild(root.element);
        }, 1)
        this.#root = root;
      }
    }

    if(!typechecker.check({ type: 'boolean', value: animated })) 
    {
      console.error(this.#errors.presentAnimationTypeError);
      return;
    }
    if(animated) this.setAttribute({ key: 'animation', value: 'default' });
    else this.setAttribute({ key: 'animation', value: 'none' });

    setTimeout(() => 
    {
      document.body.appendChild(this.element);
      this.element.show();
    }, 1);
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'dialog', constructor: _Dialog_ });

///////////////////////////////////////////////////////////