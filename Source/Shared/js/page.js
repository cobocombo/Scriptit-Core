///////////////////////////////////////////////////////////

/** Class representing the page component. */
class _Page_ extends Component
{
  #errors;
  #toolbar;
  #contentContainer;
  #lastOrientation;
  #leftToolbarContainer;
  #navigationBar;
  #navigationBarButtonsLeft;
  #navigationBarButtonsRight;
  #onNavigationBarTitleTap;
  #onOrientationChange;
  #rightToolbarContainer;
  #toolbarButtonsLeft;
  #toolbarButtonsRight;
  
  /**
   * Creates the page object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'ons-page', options: options });

    this.#errors = 
    {
      backgroundColorInvalidError: 'Page Error: Invalid color provided for backgroundColor.',
      backgroundColorTypeError: 'Page Error: Expected type string for backgroundColor.',
      componentTypeError: 'Page Error: Expected type component.',
      componentsTypeError: 'Page Error: Expected type array for components in addComponents call.',
      imageTypeError: 'Page Error: Expected type Img.',
      navigationBarButtonLeftTypeError: 'Page Error: Expected type BarButton or BackBarButton when setting left navigation bar button.',
      navigationBarButtonRightTypeError: 'Page Error: Expected type BarButton when setting right navigation bar button.',
      navigationBarButtonsTypeError: 'Page Error: Expected type array for buttons when setting navigation bar buttons.',
      navigationBarColorInvalidError: 'Page Error: Invalid color provided for navigationBarColor',
      navigationBarColorTypeError: 'Page Error: Expected type string for navigationBarColor',
      navigationBarFontTypeError: 'Page Error: Expected type string for navigationBarFont.',
      navigationTitleTypeError: 'Page Error: Expected type string for navigationBarTitle.',
      navigationBarTitleColorInvalidError: 'Page Error: Invalid color provided for navigationBarTitleColor',
      navigationBarTitleColorTypeError: 'Page Error: Expected type string for navigationBarTitleColor.',
      onNavigationBarTitleTapTypeError: 'Page Error: Expected type function for onNavigationBarTitleTap.',
      onOrientationChangeTypeError: 'Page Error: Expected type function for onOrientationChange.',
      searchbarTypeError: 'Page Error: Expected type Searchbar.',
      toolbarButtonTypeError: 'Page Error: Expected type BarButton when setting toolbar button.',
      toolbarButtonsTypeError: 'Page Error: Expected type array for buttons when setting toolbar buttons.'
    }

    this.#lastOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    this.#addContentContainer();
    this.#addBackgroundContainer();
    this.#observeLifecycle();
  }

  /** Private method to add the background container to the page. */
  #addBackgroundContainer() 
  {
    if(!this.element.querySelector('.background')) 
    {
      let background = document.createElement('div');
      background.className = 'background';
      this.element.insertBefore(background, this.element.firstChild);
    }
  }
  
  /** Private method to add the content container to the page. */
  #addContentContainer() 
  {
    if(!this.element.querySelector('.page__content')) 
    {
      let content = document.createElement('div');
      content.className = 'page__content';
      content.style.overflowY = 'auto';
      content.style.height = '100%';
      content.style.webkitOverflowScrolling = 'touch';
      this.element.appendChild(content);
      this.#contentContainer = content;
    }
  }
  
  /** Private method to add the navigation bar to the page. */
  #addNavigationBar()
  {
    if(!this.#navigationBar)
    {
      this.#navigationBar = document.createElement('ons-toolbar');
      this.element.insertBefore(this.#navigationBar, this.element.firstChild);
    }
  }
  
  /** Private method to add the toolbar to the page. */
  #addToolbar()
  {
    if(!this.#toolbar) 
    {
      this.#toolbar = document.createElement('ons-bottom-toolbar');
      this.#toolbar.style.display = 'flex';
      this.#toolbar.style.justifyContent = 'space-between';
      this.#toolbar.style.alignItems = 'center';
      this.#toolbar.style.padding = '4px';

      this.#leftToolbarContainer = document.createElement('div');
      this.#rightToolbarContainer = document.createElement('div');

      this.#leftToolbarContainer.style.display = 'flex';
      this.#rightToolbarContainer.style.display = 'flex';

      this.#toolbar.appendChild(this.#leftToolbarContainer);
      this.#toolbar.appendChild(this.#rightToolbarContainer);

      this.appendChild({ child: this.#toolbar });
    }
  }
  
  /** Private method to help with observng the basic Page lifecycle events. */
  #observeLifecycle() 
  {
    this.addEventListener({ event: 'init', handler: () => this.onInit() });
    this.addEventListener({ event: 'show', handler: () => this.onShow() });

    new MutationObserver(() => 
    {
      if(this.element.style.display === 'none' || this.element.hidden) 
      {
        this.onHide();
      }
    }).observe(this.element, { attributes: true, attributeFilter: ['style', 'hidden'] });

    let observer = new MutationObserver((mutations) => 
    {
      mutations.forEach((mutation) => 
      {
        mutation.removedNodes.forEach((node) => 
        {
          if(node === this.element) 
          {
            this.onDestroy();
            observer.disconnect();
          }
        });
      });
    });

    observer.observe(document.body, { childList: true });
  }

  /** 
   * Get property to return the page's background color.
   * @return {string} The page's background color.
   */
  get backgroundColor()
  {
    let background = this.element.querySelector('.background');
    if(background) return background.style.backgroundColor;
  }
  
  /** 
   * Set property to change the page's background color.
   * @param {string} value - The page's background color.
   */
  set backgroundColor(value)
  { 
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.backgroundColorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.backgroundColorInvalidError);
    let background = this.element.querySelector('.background');
    if(background) background.style.backgroundColor = value;
  }

  /** 
   * Get property to return the navigation bar's color.
   * @return {string} The navigation bar's color.
   */
  get navigationBarColor()
  {
    return this.#navigationBar.style.backgroundColor;
  }

  /** 
   * Set property to change the the navigation bar's color.
   * @param {string} value - The navigation bar's color.
   */
  set navigationBarColor(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.navigationBarColorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.navigationBarColorInvalidError);
    if(this.#navigationBar) this.#navigationBar.style.backgroundColor = value;
  }
  
  /** 
   * Get property to return the page's navigation bar font.
   * @return {string} The page's navigation bar font.
   */
  get navigationBarFont()
  {
    let centerDiv = this.#navigationBar.querySelector('.center');
    return centerDiv.style.fontFamily;
  }
  
  /** 
   * Set property to change the page's navigation bar font.
   * @param {string} value - The page's navigation bar font. 
   */
  set navigationBarFont(value)
  { 
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.navigationBarFontTypeError);
    let centerDiv = this.#navigationBar.querySelector('.center');
    if(centerDiv) 
    {
      centerDiv.style.fontFamily = value;
    }
  }
  
  /** 
   * Get property to return the page's navigation bar title.
   * @return {string} The page's navigation bar title.
   */
  get navigationBarTitle()
  {
    let centerDiv = this.#navigationBar.querySelector('.center');
    return centerDiv.textContent;
  }
  
  /** 
   * Set property to change the page's navigation bar title.
   * @param {string} value - The page's navigation bar title. 
   */
  set navigationBarTitle(value)
  { 
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.navigationTitleTypeError);
    if(!this.#navigationBar) this.#addNavigationBar();

    let centerDiv = this.#navigationBar.querySelector('.center');
    if(!centerDiv) 
    {
      centerDiv = document.createElement('div');
      centerDiv.className = 'center';
      this.#navigationBar.appendChild(centerDiv);
    }

    centerDiv.textContent = value;
  }

  /** 
   * Get property to return the page's navigation bar title color.
   * @return {string} The page's navigation bar title color.
   */
  get navigationBarTitleColor()
  {
    let centerDiv = this.#navigationBar.querySelector('.center');
    return centerDiv.style.color;
  }

  /** 
   * Set property to change the page's navigation bar title color.
   * @param {string} value - The page's navigation bar title color. 
   */
  set navigationBarTitleColor(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) console.error(this.#errors.navigationBarTitleColorTypeError);
    if(!color.isValid({ color: value })) console.error(this.#errors.navigationBarColorInvalidError);
    if(this.#navigationBar)
    {
      let centerDiv = this.#navigationBar.querySelector('.center');
      centerDiv.style.color = value;
    }
  }
  
  /** 
   * Get property to return the page's buttons on the left side of the navigation bar.
   * @return {array} The page's buttons of the left side of the navigation bar.
   */
  get navigationBarButtonsLeft()
  {
    return this.#navigationBarButtonsLeft;
  }
  
  /** 
   * Set property to change the page's buttons on the left side of the navigation bar.
   * @param {array} buttons - The page's buttons on the left side of the navigation bar. 
   */
  set navigationBarButtonsLeft(value)
  {
    if(!typechecker.check({ type: 'array', value: value })) console.error(this.#errors.navigationBarButtonsTypeError);
    if(!this.#navigationBar) this.#addNavigationBar();
    
    let leftDiv = this.#navigationBar.querySelector('.left');
    if(!leftDiv) 
    {
      leftDiv = document.createElement('div');
      leftDiv.className = 'left';
      this.#navigationBar.insertBefore(leftDiv, this.#navigationBar.firstChild);
    }

    leftDiv.innerHTML = '';
    
    value.forEach(button => 
    {
      if(typechecker.checkMultiple({ types: [ 'bar-button', 'back-bar-button' ], value: button })) leftDiv.appendChild(button.element);
      else console.error(this.#errors.navigationBarButtonLeftTypeError);
    });
    this.#navigationBarButtonsLeft = value;
  }
  
  /** 
   * Get property to return the page's buttons on the right side of the navigation bar.
   * @return {array} The page's buttons of the right side of the navigation bar.
   */
  get navigationBarButtonsRight()
  {
    return this.#navigationBarButtonsRight;
  }
  
  /** 
   * Set property to change the page's buttons on the right side of the navigation bar.
   * @param {array} buttons - The page's buttons on the right side of the navigation bar. 
   */
  set navigationBarButtonsRight(value)
  {
    if(!typechecker.check({ type: 'array', value: value })) console.error(this.#errors.navigationBarButtonsTypeError);
    if(!this.#navigationBar) this.#addNavigationBar();
    
    let rightDiv = this.#navigationBar.querySelector('.right');
    if(!rightDiv) 
    {
      rightDiv = document.createElement('div');
      rightDiv.className = 'right';
      this.#navigationBar.insertBefore(rightDiv, this.#navigationBar.firstChild);
    }

    rightDiv.innerHTML = '';
    
    value.forEach(button => 
    {
      if(typechecker.check({ type: 'bar-button', value: button })) rightDiv.appendChild(button.element);
      else console.error(this.#errors.navigationBarButtonRightTypeError);
    });
    this.#navigationBarButtonsRight = value;
  }
  
  /** 
   * Get property to return the page's function declaration for the onNavigationBarTitleTap event.
   * @return {Function} The page's function declaration for the onNavigationBarTitleTap event.
   */
  get onNavigationBarTitleTap()
  {
    return this.#onNavigationBarTitleTap;
  }
  
  /** 
   * Set property to change the page's function declaration for the onNavigationBarTitleTap event.
   * @param {Function} value - The page's function declaration for the onNavigationBarTitleTap event.
   */
  set onNavigationBarTitleTap(value)
  {
    if(!typechecker.check({ type: 'function', value: value }))
    {
      console.error(this.#errors.onNavigationBarTitleTapTypeError);
      return;
    }
    
    if(!this.#navigationBar) this.#addNavigationBar();
    let centerDiv = this.#navigationBar.querySelector('.center');
    if(!centerDiv) 
    {
      centerDiv = document.createElement('div');
      centerDiv.className = 'center';
      this.#navigationBar.appendChild(centerDiv);
    }
    
    if(this.#onNavigationBarTitleTap) centerDiv.removeEventListener('click', this.#onNavigationBarTitleTap );
    this.#onNavigationBarTitleTap = value;
    centerDiv.addEventListener('click', value );
  }

  /** 
   * Get property to return the component's function declaration for orientation change events.
   * @return {function} The component's function declaration for orientation change events.
   */
  get onOrientationChange() 
  {
    return this.#onOrientationChange;
  }

  /** 
   * Set property to change the component's function declaration for orientation change events.
   * @param {function} value - The component's function declaration for orientation change events.
   */
  set onOrientationChange(value) 
  {
    if(!typechecker.check({ type: 'function', value: value })) 
    {
      console.error(this.#errors.onOrientationChangeTypeError);
      return;
    }

    if(this.#onOrientationChange) 
    {
      window.removeEventListener('resize', this.#onOrientationChange);
    }

    this.#lastOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    this.#onOrientationChange = () => 
    {
      let currentOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';

      if(this.#lastOrientation !== currentOrientation) 
      {
        this.#lastOrientation = currentOrientation;
        value(currentOrientation);
      }
    };

    window.addEventListener('resize', this.#onOrientationChange);
  }
  
  /** 
   * Get property to return the page's buttons on the left side of the toolbar.
   * @return {array} The page's buttons of the left side of the toolbar.
   */
  get toolbarButtonsLeft()
  {
    return this.#toolbarButtonsLeft;
  }
  
  /** 
   * Set property to change the page's buttons on the left side of the toolbar.
   * @param {array} buttons - The page's buttons on the left side of the toolbar. 
   */
  set toolbarButtonsLeft(value)
  {
    if(!typechecker.check({ type: 'array', value: value })) console.error(this.#errors.toolbarButtonsTypeError);
    if(!this.#toolbar) this.#addToolbar();
   
    this.#leftToolbarContainer.innerHTML = '';
    
    value.forEach(button => 
    {
      if(typechecker.check({ type: 'bar-button', value: button })) this.#leftToolbarContainer.appendChild(button.element);
      else console.error(this.#errors.toolbarButtonTypeError);
    });
    this.#leftToolbarContainer.style.justifyContent = 'flex-start';
    this.#toolbarButtonsLeft = value;
  }
  
  /** 
   * Get property to return the page's buttons on the right side of the toolbar, if previously set before.
   * @return {array} The page's buttons of the right side of the toolbar.
   */
  get toolbarButtonsRight()
  {
    return this.#toolbarButtonsRight;
  }
  
  /** 
   * Set property to change the page's buttons on the right side of the toolbar.
   * @param {array} buttons - The page's buttons on the right side of the toolbar. 
   */
  set toolbarButtonsRight(value)
  {
    if(!typechecker.check({ type: 'array', value: value })) console.error(this.#errors.toolbarButtonsTypeError);
    if(!this.#toolbar) this.#addToolbar();
    
    this.#rightToolbarContainer.innerHTML = '';
    
    value.forEach(button => 
    {
      if(typechecker.check({ type: 'bar-button', value: button }))  this.#rightToolbarContainer.appendChild(button.element);
      else console.error(this.#errors.toolbarButtonTypeError);
    });
    this.#rightToolbarContainer.style.justifyContent = 'flex-start';
    this.#toolbarButtonsRight = value;
  }
  
  /**
   * Public method to add one or multiple components to a page.
   * @param {array} components - Array of components to be added to the page.
   */
  addComponents({ components } = {}) 
  { 
    if(!typechecker.check({ type: 'array', value: components })) console.error(this.#errors.componentsTypeError);
    components.forEach(component => 
    {
      if(typechecker.check({ type: 'component', value: component })) this.#contentContainer.appendChild(component.element);
      else console.error(this.#errors.componentTypeError);  
    });
  }
  
  /**
   * Public method to add one component to the center of the page.
   * @param {Component} component - Component to be added to the center of the page.
   */
  addComponentToCenter({ component } = {}) 
  {
    if(typechecker.check({ type: 'component', value: component }))
    {
      let centerContainer = this.element.querySelector('.center-content-container');
    
      if(!centerContainer) 
      {
        centerContainer = document.createElement('div');
        centerContainer.className = 'center-content-container';
        centerContainer.style.position = 'absolute';
        centerContainer.style.left = '50%';
        centerContainer.style.transform = 'translate(-50%, -50%)';
        centerContainer.style.display = 'flex';
        centerContainer.style.justifyContent = 'center';
        centerContainer.style.alignItems = 'center';
        centerContainer.style.width = '100%';
        centerContainer.style.height = 'auto';
        
        this.#contentContainer.appendChild(centerContainer);
      }
    
      let toolbar = this.element.querySelector('ons-toolbar');
      let toolbarHeight = toolbar ? 44 : 0;
    
      centerContainer.style.top = `calc(42% + ${toolbarHeight/2}px)`;
    
      centerContainer.innerHTML = '';
      centerContainer.appendChild(component.element);
    }
    else console.error(this.#errors.componentTypeError);
  }
  
  /**
   * Public method to add an image to the center of the navigation bar of the page.
   * @param {Img} image - Img to be added to the navigation bar of the page.
   */
  addImageToNavigationBar({ image } = {})
  {
    if(!typechecker.check({ type: 'img', value: image })) console.error(this.#errors.imageTypeError);
    if(!this.#navigationBar) this.#addNavigationBar();
    
    let centerDiv = this.#navigationBar.querySelector('.center');
    if(!centerDiv) 
    {
      centerDiv = document.createElement('div');
      centerDiv.className = 'center';
      image.style.maxWidth = '100%';
      image.style.padding = '4px';
      image.style.maxHeight = '80%';
      image.style.objectFit = 'contain';
      image.style.display = 'block';
      image.style.margin = 'auto';
      centerDiv.appendChild(image.element);
      this.#navigationBar.appendChild(centerDiv);
    }
  }
  
  /**
   * Public method to add a searchbar to the center of the navigation bar of the page.
   * @param {Searchbar} searchbar - Searchbar to be added to the navigation bar of the page.
   */
  addSearchToNavigationBar({ searchbar } = {})
  {
    if(!typechecker.check({ type: 'searchbar', value: searchbar })) console.error(this.#errors.searchbarTypeError);
    if(!this.#navigationBar) this.#addNavigationBar();
  
    let centerDiv = this.#navigationBar.querySelector('.center');
    if(!centerDiv) 
    {
      centerDiv = document.createElement('div');
      centerDiv.className = 'center';
      searchbar.style.padding = '7px';
      searchbar.style.maxWidth = '50%';
      searchbar.style.objectFit = 'contain';
      searchbar.style.display = 'block';
      searchbar.style.margin = 'auto';
      centerDiv.appendChild(searchbar.element);
      this.#navigationBar.appendChild(centerDiv);
    }
  }
  
  /** Public method to hide the navigation bar as needed. */
  hideNavigationBar() 
  { 
    if(this.#navigationBar) this.#navigationBar.hide();
  }
  
  /** Public method to hide the toolbar as needed. */
  hideToolbar()
  {
    if(this.#toolbar) this.#toolbar.style.display = 'none';
  }

  // Init lifecycle hooks meant to be overriden by an extended class.
  onInit() { }

  onShow() { }

  onHide() { }
 
  onDestroy() { }
  
  /** Public method to show the navigation bar as needed. */
  showNavigationBar() 
  { 
    if(this.#navigationBar)  this.#navigationBar.show();
  }
  
  /** Public method to show the toolbar as needed. */
  showToolbar()
  {
    if(this.#toolbar) this.#toolbar.style.display = 'flex';
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'page', constructor: _Page_ });

///////////////////////////////////////////////////////////