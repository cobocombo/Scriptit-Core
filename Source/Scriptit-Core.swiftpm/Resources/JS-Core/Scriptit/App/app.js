///////////////////////////////////////////////////////////
// APP MODULE
///////////////////////////////////////////////////////////

/** Singleton class representing the main app object. */
class App 
{
  #componentsById;
  #errors;
  #isPresented;
  #root;
  
  /** Creates the app object. **/
  constructor() 
  {
    this.#errors = 
    {
      appAlreadyPresentedError: 'App Error: App is already being presented.',
      appNotYetPresentedError: 'App Error: Cannot retrieve component because the app has not been presented yet.',
      backgroundColorInvalidError: 'Text Error: Invalid color value for color.',
      backgroundColorTypeError: 'Text Error: Expected type string for color.',
      componentRegistrationTypeError: 'App Error: Expected type Component during registration.',
      componentNotFoundError: 'App Error: No component found with id',
      idTypeError: 'App Error: Expected type string for parameter id while trying to retrieve a component.',
      noIdComponentRegistrationError: 'App Error: Cannot register component without an id.',
      noRootComponentError: 'App Error: No root component was found',
      rootComponentTypeError: 'App Error: Root was detected as an unsupported type. Supported types are: Navigator, Page, Splitter, Tabbar, & PhaserGame.',
      singleInstanceError: 'App Error: Only one App object can exist at a time.'
    }

    if(App._instance) console.error(this.#errors.singleInstanceError);
    else
    {
      App._instance = this;
      this.#componentsById = new Map();
      this.#isPresented = false;
      this.backgroundColor = 'black';
    }    
  }
  
  /** Static method to return a new App instance. Allows for Singleton+Module pattern. */
  static getInstance() 
  {
    return new App();
  }

  /** 
   * Get property to determine if this is the first launch of the app.
   * @return {boolean} True if this is the first launch, otherwise false.
   */
  get isFirstLaunch()
  {
    let key = 'is-first-launch';
    if(localStorage.getItem(key) === null)
    {
      localStorage.setItem(key, 'false');
      return true;
    }

    return false;
  }

  /** 
   * Get property to return the color of the background.
   * @return {string} The color of the background bar. Defaults to black.
   */
  get backgroundColor()
  {
    return document.body.style.backgroundColor;
  }

  /** 
   * Set property to change the color of the background.
   * @param {string} value - The color of the background.
   */
  set backgroundColor(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.backgroundColorTypeError);
      return;
    }
    if(!color.isValid({ color: value })) 
    {
      console.error(this.#errors.backgroundColorInvalidError);
      return;
    }
    document.body.style.backgroundColor = value;
  }
  
  /** 
   * Public method to present the app from the root component.
   * @param {Multiple} root - The root component of the app. Supports Navigator, Page, Splitter, Tabbar.
   */
  present({ root } = {}) 
  {
    if(!root) 
    {
      console.error(this.#errors.noRootComponentError);
      return;
    }

    if(typechecker.checkMultiple({ types: [ 'navigator', 'page', 'splitter', 'tabbar', 'phaser-game' ], value: root })) this.#root = root;
    else 
    {
      console.error(this.#errors.rootComponentTypeError);
      return;
    }
    
    if(this.#isPresented == true)
    {
      console.error(this.#errors.appAlreadyPresentedError);
      return;
    }
    else 
    {
      document.body.appendChild(this.#root.element);
      this.#isPresented = true;
    }
  }
  
  previewProject({ project })
  {
    if(window.webkit?.messageHandlers?.projectPreviewMessageManager) 
    {
      window.webkit.messageHandlers.projectPreviewMessageManager.postMessage({ project: project });
    }
  }
  
  /** 
   * Public method to register a component in the componentsById map. This is called automatically when the user sets an id in any component.
   * @param {Component} component - The component to be registered in the map.
   */
  registerComponent({ component } = {}) 
  {
    if(!typechecker.check({ type: 'component', value: component })) 
    {
      console.error(this.#errors.componentRegistrationTypeError);
      return;
    }    
    if(!component.id) 
    {
      console.error(this.#errors.noIdComponentRegistrationError);
      return;
    }
    this.#componentsById.set(component.id, component);
  }
  
  /** 
   * Public method to retrieve a previously saved component in the componentsById map.
   * @param {string} id - The id of the component that should be registered in the map.
   */
  getComponentById({ id } = {}) 
  {
    if(!typechecker.check({ type: 'string', value: id })) 
    {
      console.error(this.#errors.idTypeError);
      return;
    }
    if(!this.#isPresented) 
    {
      console.error(this.#errors.appNotYetPresentedError);
      return;
    }
    let component = this.#componentsById.get(id);
    if(!component) 
    {
      console.error(this.#errors.componentNotFoundError + ` "${id}".`);
      return;
    }
    return component;
  }
}

///////////////////////////////////////////////////////////

globalThis.app = App.getInstance();

///////////////////////////////////////////////////////////