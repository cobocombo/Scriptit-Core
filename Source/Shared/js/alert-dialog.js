///////////////////////////////////////////////////////////

/** Class representing the alert dialog component. */
class _AlertDialog_ extends Component 
{
  #errors;
  #buttons;
  #cancelable;
  #contentElement;
  #footerElement;
  #rowfooter;
  #titleElement;
  
  /**
   * Creates the alert dialog object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'ons-alert-dialog', options: options });
    this.setAttribute({ key: 'modifier', value: 'custom-alert' });

    this.#errors = 
    {
      buttonsEmptyError: 'Alert Dialog Error: Buttons array must contain at least one ActionSheetButton.',
      buttonTypeError: 'Alert Dialog Error: Expected type alert dialog button for button in buttons array.',
      buttonsTypeError: 'Alert Dialog Error: Expected type array for buttons when creating the dialog buttons.',
      cancelableTypeError: 'Alert Dialog Error: Expected type boolean for cancelable.',
      componentsTypeError: 'Alert Dialog Error: Expected type array for components in addComponents call.',
      componentTypeError: 'Alert Dialog Error: Expected type component in components array.',
      dismissAnimationTypeError: 'Alert Dialog Error: Expected type boolean for animated when dismissing the dialog.',
      fontTypeError: 'Alert Dialog Error: Expected type string for font.',
      presentAnimationTypeError: 'Alert Dialog Error: Expected type boolean for animated when presenting the dialog.',
      rowfooterTypeError: 'Alert Dialog Error: Expected type boolean for rowfooter.',
      titleTypeError: 'Alert Dialog Error: Expected type string for title.'
    };

    this.#titleElement = document.createElement('div');
    this.#titleElement.classList.add('alert-dialog-title');
  
    this.#contentElement = document.createElement('div');
    this.#contentElement.classList.add('alert-dialog-content');
  
    this.#footerElement = document.createElement('div');
    this.#footerElement.classList.add('alert-dialog-footer');
  
    this.element.appendChild(this.#titleElement);
    this.element.appendChild(this.#contentElement);
    this.element.appendChild(this.#footerElement);

    this.title = options.title || '';
    this.cancelable = options.cancelable || true;
    this.font = options.font || font.library.system;
    this.rowfooter = options.rowfooter || true;
    if(options.buttons) this.buttons = options.buttons;
  }

  /** 
   * Get property to return the dialog's buttons.
   * @return {array} The dialog's buttons.
   */
  get buttons()
  {
    if(!this.#buttons) return [];
    else return [...this.#buttons];
  }

  /** 
   * Set property to set the dialog's buttons.
   * @param {array} value - The dialog's buttons. Will throw an error if value is empty.
   */
  set buttons(value)
  {
    if(!typechecker.check({ type: 'array', value: value }))
    {
      console.error(this.#errors.buttonsTypeError);
      return;
    }
    
    if(value.length === 0) 
    {
      console.error(this.#errors.buttonsEmptyError);
      return;
    }

    if(this.#buttons) 
    {
      this.#footerElement.innerHTML = '';
      this.#buttons = [];
    }

    value.forEach(button => 
    {
      if(!typechecker.check({ type: 'alert-dialog-button', value: button }))
      {
        console.error(this.#errors.buttonTypeError);
        return;
      }

      button.addEventListener({ event: 'click', handler: () => 
      {
        var animated = false;
        if(this.getAttribute({ key: 'animation' }) == 'default') animated = true;
        this.hide({ animated: animated });
      }});

      this.#footerElement.appendChild(button.element);
    });

    this.#buttons = value;
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
   * Get property to return the font value of the alert dialog title.
   * @return {string} The font value of the alert dialog title. 
   */
  get font() 
  { 
    return this.#titleElement.style.fontFamily; 
  }
  
  /** 
   * Set property to set the font value of the alert dialog title.
   * @param {string} value - The font value of the alert dialog title.
   */
  set font(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.fontTypeError);
      return;
    }
    this.#titleElement.style.fontFamily = value;
  }

  /** 
   * Get property to return the dialog's title.
   * @return {string} The dialog's title value.
   */
  get title()
  {
    return this.#titleElement.textContent;
  }

  /** 
   * Set property to set the dialog's title value.
   * @param {string} value - The dialog's title value.
   */
  set title(value)
  {
    if(!typechecker.check({ type: 'string', value: value }))
    {
      console.error(this.#errors.titleTypeError);
      return;
    }
    this.#titleElement.textContent = value;
  }

  /** 
   * Get property to return if the dialog is configured in a rowfooter or not.
   * @return {boolean} The dialog's rowfooter value.
   */
  get rowfooter()
  {
    return this.#rowfooter;
  }

  /** 
   * Set property to set the dialog's rowfooter value.
   * @param {boolean} value - The dialog's rowfooter value.
   */
  set rowfooter(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) 
    {
      console.error(this.#errors.rowfooterTypeError);
      return;
    }
    if(value == true) this.addModifier({ modifier: 'rowfooter' });
    else this.removeModifier({ modifier: 'rowfooter' });
    this.#rowfooter = value;
  }

  /**
   * Public method add other components to the content of the dialog.
   * @param {array} components - Components to be added to the content of the dialog.
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
      this.#contentElement.appendChild(component.element);
    });
  }

  /**
   * Public method to hide an alert dialog, that has previously been shown.
   * @param {boolean} animated - Boolean value to determine if the alert dialog should be hidden with animation or not.
   */
  dismiss({ animated = true } = {})
  {
    if(!typechecker.check({ type: 'boolean', value: animated }))
    {
      console.error(this.#errors.dismissAnimationTypeError);
      return;
    }

    if(animated == true) this.setAttribute({ key: 'animation', value: 'default' });
    else this.setAttribute({ key: 'animation', value: 'none' });
  
    this.element.hide();
  }

  /**
   * Public method to show an alert dialog.
   * @param {boolean} animated - Boolean value to determine if the alert dialog should be shown with animation or not.
   */
  present({ animated = true } = {})
  {
    if(!typechecker.check({ type: 'boolean', value: animated }))
    {
      console.error(this.#errors.presentAnimationTypeError);
      return;
    }

    if(animated == true ) this.setAttribute({ key: 'animation', value: 'default' });
    else this.setAttribute({ key: 'animation', value: 'none' });
    
    document.body.appendChild(this.element);
    this.element.show();
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'alert-dialog', constructor: _AlertDialog_ });

///////////////////////////////////////////////////////////