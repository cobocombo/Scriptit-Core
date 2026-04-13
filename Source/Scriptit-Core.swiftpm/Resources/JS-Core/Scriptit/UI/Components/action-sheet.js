///////////////////////////////////////////////////////////

/** Class representing the action sheet component. */
class _ActionSheet_ extends Component 
{
  #buttons;
  #cancelTextColor;
  #cancelButton;
  #errors;
  #titleElement;

  /**
   * Creates the action sheet object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: "ons-action-sheet" , options: options });

    this.#errors = 
    {
      buttonsEmptyError: 'Action Sheet Error: Buttons array must contain at least one ActionSheetButton.',
      buttonTypeError: 'Action Sheet Error: Expected type ActionSheetButton for button in buttons array when creating the buttons.',
      buttonsTypeError: 'Action Sheet Error: Expected type array for buttons.',
      cancelTextColorTypeError: 'Action Sheet Error: Expected type string for cancel text color.',
      cancelTextColorInvalidError: 'Action Sheet Error: Invalid color value provided for cancel text color.',
      dismissAnimationTypeError: 'Action Sheet Error: Expected type boolean for animated when dismissing the sheet.',
      fontTypeError: 'Action Sheet Error: Expected type string for font.',
      presentAnimationTypeError: 'Action Sheet Error: Expected type boolean for animated when presenting the sheet.',
      titleTypeError: 'Action Sheet Error: Expected type string for title.'
    };

    this.#titleElement = document.createElement('div');
    this.#titleElement.classList.add('action-sheet-title');
    this.element.appendChild(this.#titleElement);
    
    this.title = options.title || '';
    this.cancelTextColor = options.cancelTextColor || '#0076ff';
    this.font = options.font || font.library.system;
    if(options.buttons) this.buttons = options.buttons;
  }

  /** 
   * Get property to return the sheet's buttons.
   * @return {Array} The sheet's buttons.
   */
  get buttons()
  {
    if(!this.#buttons) return [];
    else return [...this.#buttons];
  }

  /** 
   * Set property to set and build the sheet's buttons.
   * @param {Array} value - The sheet's buttons. Will throw an error if empty or has already been set before.
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

    let sheetContainer = this.element.querySelector('.action-sheet');
    if(sheetContainer)
    {
      sheetContainer.querySelectorAll('ons-action-sheet-button').forEach(btn => { sheetContainer.removeChild(btn); });
      this.#buttons = [];
      this.#cancelButton = null;
    }

    let cancelButton = new ui.ActionSheetButton({ text: 'Cancel', textColor: this.cancelTextColor, font: this.font });
    cancelButton.addEventListener({ event: "click", handler: () => 
    {
      let animated = this.getAttribute({ key: 'animation' }) === 'default';
      this.dismiss({ animated: animated });
    }});
    this.#cancelButton = cancelButton;

    let allButtons = [...value, cancelButton];

    allButtons.forEach(button => 
    { 
      if(!typechecker.check({ type: 'action-sheet-button', value: button })) 
      {
        console.error(this.#errors.buttonTypeError);
        return;
      }

      let refNode = this.#titleElement.previousSibling;
      if(!sheetContainer) this.element.insertBefore(button.element, refNode);
      else sheetContainer.insertBefore(button.element, refNode);      

      button.addEventListener({ event: "click", handler: () => 
      {
        let animated = this.getAttribute({ key: 'animation' }) === 'default';
        this.dismiss({ animated: animated });
      }});
    });

    this.#buttons = allButtons;
  }

  /** 
   * Get property to return the sheet's cancel text color value.
   * @return {string} The sheet's cancel text color value.
   */
  get cancelTextColor()
  {
    return this.#cancelTextColor;
  }

  /** 
   * Set property to set the sheet's cancel text color value.
   * @param {string} value - The sheet's cancel text color value. Will throw an error if the color value is not valid.
   */
  set cancelTextColor(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.cancelTextColorTypeError);
      return;
    }
    if(!color.isValid({ color: value })) 
    {
      console.error(this.#errors.cancelTextColorInvalidError);
      return;
    }

    if(this.#cancelButton) this.#cancelButton.textColor = value;
    this.#cancelTextColor = value;
  }
  
  /** 
   * Get property to return the font value of the action sheet object.
   * @return {string} The font value of action sheet object. 
   */
  get font() 
  { 
    return this.#titleElement.style.fontFamily; 
  }
  
  /** 
   * Set property to set the font value of the action sheet object.
   * @param {string} value - The font value of the the action sheet object.
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
   * Get property to return the sheet's title value, if previously set before.
   * @return {string} The sheet's title value, if previously set before.
   */
  get title()
  {
    return this.#titleElement.textContent;
  }

  /** 
   * Set property to set the sheet's title value, if not previously set before.
   * @param {string} value - The sheet's title value.
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
   * Public method to dismiss a action sheet.
   * @param {boolean} animated - Boolean value to determine if the action sheet should be dismissed with animation or not. True by default.
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
   * Public method to present an action sheet.
   * @param {boolean} animated - Boolean value to determine if the action sheet should be presented with animation or not. True by default.
   */
  present({ animated = true } = {})
  {
    if(!typechecker.check({ type: 'boolean', value: animated })) 
    {
      console.error(this.#errors.presentAnimationTypeError);
      return;
    }
    
    if(animated == true) this.setAttribute({ key: 'animation', value: 'default' });
    else this.setAttribute({ key: 'animation', value: 'none' });
   
    document.body.appendChild(this.element);
    this.element.show();
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'action-sheet', constructor: _ActionSheet_ });

///////////////////////////////////////////////////////////