///////////////////////////////////////////////////////////
// APP MODULE
///////////////////////////////////////////////////////////

/** Singleton class representing the main app object. */
class App 
{
  #appInfoStorageKey;
  #componentsById;
  #errors;
  #getVersionPending;
  #getVersionRequestCounter;
  #isFirstLaunch;
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
      ons.disableIconAutoPrefix();
      
      this.#getVersionPending = new Map();
      this.#getVersionRequestCounter = 0;
      
      // APP INFO STORAGE
      this.#appInfoStorageKey = 'app-information-storage';
      let appInfo = Lockr.get(this.#appInfoStorageKey, {});
      
      // FIRST LAUNCH TRACKING
      if(appInfo.hasLaunchedBefore === undefined)
      {
        this.#isFirstLaunch = true;
        appInfo.hasLaunchedBefore = true;
      }
      else { this.#isFirstLaunch = false; }
      
      // TOTAL LAUNCH TRACKING
      if(appInfo.totalNumLaunches === undefined) { appInfo.totalNumLaunches = 1; }
      else { appInfo.totalNumLaunches += 1; }
      
      // CURRENT VERSION TRACKING
      if(appInfo.currentVersion === undefined)
      {
        this._getVersion()
        .then(version => { appInfo.currentVersion = version; })
        .catch(error => { console.debug(error); });
      }
      
      Lockr.set(this.#appInfoStorageKey, appInfo);
    }    
  }
  
  /** Static method to return a new App instance. Allows for Singleton+Module pattern. */
  static getInstance() 
  {
    return new App();
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
   * Get property to determine the current stored version string of the app.
   * @return {string} Current version string of the app.
   */
  get currentVersion()
  {
    let appInfo = Lockr.get(this.#appInfoStorageKey, {});
    return appInfo.currentVersion || '0.0s';
  }
  
  /** 
   * Get property to determine if this is the first launch of the app.
   * @return {boolean} True if this is the first launch, otherwise false.
   */
  get isFirstLaunch()
  {
    return this.#isFirstLaunch;
  }
  
  /** 
   * Get property to determine the total number of app launches.
   * @return {number} Total lifetime launches of the app.
   */
  get totalNumLaunches()
  {
    let appInfo = Lockr.get(this.#appInfoStorageKey, {});
    return appInfo.totalNumLaunches || 0;
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
  
  /** 
   * Public method to present the app from the root component.
   * @param {Multiple} root - The root component of the app. Supports Navigator, Page, Splitter, Tabbar, and Phaser Game.
   */
  present({ root } = {}) 
  {
    if(!root) 
    {
      console.error(this.#errors.noRootComponentError);
      return;
    }

    if(typechecker.checkMultiple({ types: [ 'navigator', 'page', 'splitter', 'tabbar', 'phaser-game' ], value: root }))
    {
      this.#root = root;
    }
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
   * Public method to preview a project in the native iOS preview webview.
   * @param {string} project - The name of the project to preview.
   */
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
   * Private method to request the app version from the native app.
   */
  _getVersion()
  {
    return new Promise((resolve, reject) =>
    {
      let requestId = ++this.#getVersionRequestCounter;
      this.#getVersionPending.set(requestId, { resolve, reject });
  
      window.webkit?.messageHandlers?.appMessageManager?.postMessage({
        command: 'getVersion',
        requestId: requestId
      });
    });
  }
  
  /** 
   * Private method called when the app version request succeeds.
   * @param {Object} payload - The success payload returned from native code.
   */
  _getVersionSuccess(payload)
  {
    let pending = this.#getVersionPending.get(payload.requestId);
    if(!pending) return;
    
    pending.resolve(payload.data);
    this.#getVersionPending.delete(payload.requestId);
  }
  
  /** 
   * Private method called when the app version request fails.
   * @param {Object} payload - The failure payload returned from native code.
   */
  _getVersionFail(payload)
  {
    let pending = this.#getVersionPending.get(payload.requestId);
    if(!pending) return;
  
    pending.reject(payload.error);
    this.#getVersionPending.delete(payload.requestId);
  }
}

///////////////////////////////////////////////////////////

globalThis.app = App.getInstance();

///////////////////////////////////////////////////////////