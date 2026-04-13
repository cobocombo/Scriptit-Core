///////////////////////////////////////////////////////////

/** Class representing the navigator component. */
class _Navigator_ 
{
  #errors;
  #container;
  #stack;

  /**
   * Creates the navigator object.
   * @param {Multiple} root - First page to be shown in the navigation stack.
   */
  constructor({ root, id } = {}) 
  {
    this.#errors = 
    {
      idTypeError: 'Navigator Error: Expected type string for id.',
      indexTypeError: 'Navigator Error: Expected type number for index when switching to another page.',
      lastPagePopError: 'Navigator Error: Cannot pop the last page of the stack.',
      noRootComponentError: 'Navigator Error: A root page is required when creating a navigator.',
      rootTypeError: 'Navigator Error: Root was detected as an unsupported type. Supported types are: Page, Splitter, Tabbar, & PhaserGame.',
      pushAnimationTypeError: 'Navigator Error: Expected type boolean for animated when pushing a new page.',
      popAnimationTypeError: 'Navigator Error: Expected type boolean for animated when popping the top page.',
      stackOutOfBoundsError: 'Navigator Error: Stack index out of bounds.',
      switchToAnimationTypeError: 'Navigator Error: Expected type boolean for animation when switching to another page.'
    }
  
    this.#container = document.createElement('div');
    this.#stack = [];
    
    if(root) this.push({ root: root, animated: false });
    else console.error(this.#errors.noRootComponentError);
    if(id) this.id = id;
  }
  
  /** 
   * Get property to return the navigator container.
   * @return {object} The navigator container. Not meant to be used publically by users.
   */
  get element() 
  { 
    return this.#container; 
  }

  /** 
   * Get property to return the navigator's id.
   * @return {string} The navigator's id.
   */
  get id()
  {
    return this.#container.id;
  }

  /** 
   * Set property to set the navigator's id.
   * @param {string} value - The navigator's id.
   */
  set id(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.idTypeError);
      return;
    }
    this.#container.id = value;
    app.registerComponent({ component: this });
  }

  /**
   * Public method to push a new page onto the navigation stack.
   * @param {Multiple} root - Root component to be pushed onto the navigation stack.
   * @param {boolean} animated - Boolean value to determine if the page should be pushed with animation or not.
   */
  push({ root, animated = true } = {}) 
  {
    
    if(!typechecker.checkMultiple({ types: [ 'page', 'splitter', 'tabbar', 'phaser-game' ], value: root })) 
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
    if(!typechecker.check({ type: 'boolean', value: animated })) 
    {
      console.error(this.#errors.pushAnimationTypeError);
      return;
    }
    
    if(this.#stack.length === 0) 
    {
      this.#stack.push(root);
      this.#container.appendChild(root.element);
      return;
    }

    let currentPage = this.#stack[this.#stack.length - 1];
    setTimeout(() => { currentPage.element.style.display = 'none'; }, 300);

    this.#stack.push(root);
    this.#container.appendChild(root.element);

    if(animated) 
    {
      root.element.style.transform = 'translateX(100%)';
      root.element.style.transition = 'transform 0.3s ease-in-out';
      setTimeout(() => { root.element.style.transform = 'translateX(0)'; }, 0);
    }
  }

  /**
   * Public method to pop the top page off the navigation stack.
   * @param {boolean} animated - Boolean value to determine if the page should be popped with animation or not.
   */
  pop({ animated = true } = {}) 
  {
    if(this.#stack.length <= 1) console.error(this.#errors.lastPagePopError);
    if(!typechecker.check({ type: 'boolean', value: animated })) console.error(this.#errors.popAnimationTypeError);

    let currentPage = this.#stack.pop();
    let previousPage = this.#stack[this.#stack.length - 1];

    currentPage.onHide?.();
    previousPage.onShow?.();

    if(animated) 
    {
      currentPage.element.style.transform = 'translateX(100%)';
      currentPage.element.style.transition = 'transform 0.42s ease-in-out';

      previousPage.element.style.display = '';
      previousPage.element.style.transform = 'translateX(-100%)';
      previousPage.element.style.transition = 'transform 0.3s ease-in-out';

      setTimeout(() => { previousPage.element.style.transform = 'translateX(0)'; }, 0);
      setTimeout(() => { currentPage.onDestroy?.(); this.#container.removeChild(currentPage.element); }, 350);
    } 
    else 
    {
      currentPage.onDestroy?.();
      this.#container.removeChild(currentPage.element);
      previousPage.element.style.display = '';
    }
  }

  /**
   * Public method to switch to a previous page that is already on the stack.
   * @param {number} index - Index of the corresponding page to switch to.
   * @param {boolean} animated - Boolean value to determine if the page should be switched with animation or not.
   */
  switchTo({ index, animated = true } = {}) 
  {
    if(!typechecker.check({ type: 'number', value: index })) 
    {
      console.error(this.#errors.indexTypeError);
      return;
    }
    if(!typechecker.check({ type: 'boolean', value: animated })) 
    {
      console.error(this.#errors.switchToAnimationTypeError);
      return;
    }

    if(index < 0 || index >= this.#stack.length) 
    {
      console.error(this.#errors.stackOutOfBoundsError);
      return;
    }
    
    let currentPage = this.#stack[this.#stack.length - 1];
    let targetPage = this.#stack[index];

    if(currentPage === targetPage) return;

    currentPage.onHide?.();

    if(animated) 
    {
      currentPage.element.style.transform = 'translateX(100%)';
      currentPage.element.style.transition = 'transform 0.42s ease-in-out';

      targetPage.element.style.display = '';
      targetPage.element.style.transform = 'translateX(-100%)';
      targetPage.element.style.transition = 'transform 0.3s ease-in-out';

      setTimeout(() => { targetPage.element.style.transform = 'translateX(0)'; }, 0);
    } 
    else 
    {
      currentPage.element.style.display = 'none';
      targetPage.element.style.display = '';
    }
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'navigator', constructor: _Navigator_ });

///////////////////////////////////////////////////////////