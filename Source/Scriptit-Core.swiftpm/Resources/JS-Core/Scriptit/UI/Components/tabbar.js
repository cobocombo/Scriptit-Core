
///////////////////////////////////////////////////////////

/** Class representing the tabbar component. */
class _Tabbar_ extends Component 
{
  #activetab;
  #errors;
  #tabs;
  #rootComponents;
  #contentContainer;

  /**
   * Creates the tabbar object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'ons-tabbar', options: options });

    this.#errors = 
    {
      activeTabIndexOutOfBoundsError: 'Tabbar Error: Index out of bounds.',
      activeTabTypeError: 'Tabbar Error: Expected type number for activeTab.',
      tabsAlreadySetError: 'Tabbar Error: Setting tabs can only be done statically once.',
      tabTypeError: 'Tabbar Error: Expected type tab in tabs.',
      tabsTypeError: 'Tabbar Error: Expected type array for tabs.'
    };

    this.#contentContainer = document.createElement('div');
    this.#contentContainer.className = 'tabbar__content';
    this.element.appendChild(this.#contentContainer);
    if(options.tabs) this.tabs = options.tabs;
  }

  /** 
   * Get property to return the active tab of the tabbar.
   * @return {Tab} The active tab of the tabbar. 
   */
  get activeTab() 
  {
    return this.#activetab;
  }

  /** 
   * Set property to set the active tab by index.
   * @param {number} value - The index of the tab that nedds to be shown as active in the tabbar. First tab starts at 1.
   */
  set activeTab(value) 
  {
    if(!typechecker.check({ type: 'number', value: value })) 
    {
      console.error(this.#errors.activeTabTypeError);
      return;
    }

    let selectedTab = null;
    let index = value === 0 ? 1 : value;
    if(index < 1 || index >= this.#tabs.length) 
    {
      console.error(this.#errors.activeTabIndexOutOfBoundsError);
      return;
    }
    selectedTab = this.#tabs[index];

    if(selectedTab === 0) selectedTab = 1;
  
    this.#rootComponents.forEach((component, index) => 
    {
      let tab = this.#tabs[index];
      let isActive = (tab === selectedTab);

      component.element.style.display = isActive ? 'block' : 'none';
      setTimeout(() => { component.element.classList.remove('ons-swiper-blocker'); }, 5);

      let icon = tab.element.querySelector(".tabbar__icon ons-icon");
      let text = tab.element.querySelector(".tabbar__label");
  
      if(icon) icon.style.color = isActive ? tab.color : '#999';
      if(text) text.style.color = isActive ? tab.color : '#999';
      if(text && tab.font) text.style.fontFamily = tab.font;
    });
  
    let selectedIndex = this.#tabs.indexOf(selectedTab);
    let selectedComponent = this.#rootComponents[selectedIndex];

    if(selectedComponent?.constructor?.name === 'Page') 
    {
      let content = selectedComponent.element.querySelector('.page__content');
      let background = selectedComponent.element.querySelector('.page__background');
      let toolbar = selectedComponent.element.querySelector('ons-toolbar');
  
      if(toolbar) if(background) background.style.marginTop = '-44px'; 
      else 
      {
        if(content) content.style.marginTop = '0px';
        if(background) background.style.marginTop = '0px';
      }
    }

    this.#activetab = selectedTab;
  }

  /** 
   * Get property to return the tabs in the tabbar.
   * @return {array} The tabs in the tabbar. 
   */
  get tabs() 
  { 
    return this.#tabs; 
  }

  /** 
   * Set property to set the tabs of the tabbar.
   * @param {array} value - The tabs of the tabbar.
   */
  set tabs(value)
  {
    if(!typechecker.check({ type: 'array', value: value })) 
    {
      console.error(this.#errors.tabsTypeError);
      return;
    }

    if(!this.#tabs)
    {
      this.#tabs = [];
      this.#rootComponents = [];
      this.#contentContainer.innerHTML = '';

      value.forEach(tab => { if(!typechecker.check({ type: 'tab', value: tab })) console.error(this.#errors.tabTypeError); });
      this.#tabs = value;
      let ghostTab = new ui.Tab({ text: '', icon: '', root: new ui.Page(), color: 'transparent' });
      ghostTab.element.style.display = 'none';
      ghostTab.root.element.style.display = 'none';
    
      this.#tabs.unshift(ghostTab);
      this.#tabs.forEach((tab, index) => 
      {
        tab.onSelect = () => this.activeTab = index;
        this.appendChild({ child: tab.element });
      });
    
      this.#rootComponents = this.#tabs.map((tab) => tab.root);
      this.#rootComponents.forEach((component) => { this.#contentContainer.appendChild(component.element); });
    
      setTimeout(() => { if(this.#tabs.length > 1) this.activeTab = 1; }, 1);
    }
    else 
    {
      console.error(this.#errors.tabsAlreadySetError);
      return;
    }
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'tabbar', constructor: _Tabbar_ });

///////////////////////////////////////////////////////////
