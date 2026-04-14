///////////////////////////////////////////////////////////
// APP MODULE
///////////////////////////////////////////////////////////

/** Singleton class representing the main app object. */
class App 
{
  #componentsById;
  #coreReleaseDate;
  #coreVersion;
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
      componentRegistrationTypeError: 'App Error: Expected type Component during registration.',
      componentNotFoundError: 'App Error: No component found with id',
      idTypeError: 'App Error: Expected type string for parameter id while trying to retrieve a component.',
      noIdComponentRegistrationError: 'App Error: Cannot register component without an id.',
      noRootComponentError: 'App Error: No root component was found',
      rootComponentTypeError: 'App Error: Root was detected as an unsupported type. Supported types are: Navigator, Page, Splitter, Tabbar, & PhaserGame.',
      singleInstanceError: 'App Error: Only one App object can exist at a time.',
      statusBarColorInvalidError: 'Text Error: Invalid color value for color.',
      statusBarColorTypeError: 'Text Error: Expected type string for color.'
    }

    if(App._instance) console.error(this.#errors.singleInstanceError);
    else
    {
      App._instance = this;
      this.#componentsById = new Map();
      this.#isPresented = false;
      this.statusBarColor = 'black';
      this.#coreVersion = '2.0';
      this.#coreReleaseDate = '4/13/26';
    }    
  }
  
  /** Static method to return a new App instance. Allows for Singleton+Module pattern. */
  static getInstance() 
  {
    return new App();
  }

  /** 
   * Get property to return the latest release date of the Scriptit Core framework.
   * @return {string} The latest release date of the Scriptit Core framework.
   */
  get coreReleaseDate()
  {
    return this.#coreReleaseDate;
  }

  /** 
   * Get property to return the current released version of the Scriptit Core framework.
   * @return {string} The current released version of the Scriptit Core framework.
   */
  get coreVersion()
  {
    return this.#coreVersion;
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
   * Get property to return the color of the status bar.
   * @return {string} The color of the status bar. Defaults to black.
   */
  get statusBarColor()
  {
    return document.body.style.backgroundColor;
  }

  /** 
   * Set property to change the color of the status bar.
   * @param {string} value - The color of the status bar.
   */
  set statusBarColor(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.statusBarColorTypeError);
      return;
    }
    if(!color.isValid({ color: value })) 
    {
      console.error(this.#errors.statusBarColorInvalidError);
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