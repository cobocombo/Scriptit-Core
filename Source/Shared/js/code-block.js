
///////////////////////////////////////////////////////////

/** Class representing the code block component. */
class _Codeblock_ extends Component 
{
  #codeElement;
  #copyButton;
  #errors;
  #font;
  #fonts;
  #fontSize;
  #mode;
  #modes;
  #theme;
  #themes;
  
  /**
   * Creates the code block object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'pre', options: options });
    
    this.#errors = 
    {
      codeTypeError: 'Codeblock Error: Expected type string for code.',
      copyFailedError: 'Codeblock Error: Copy functionality failed.',
      modeTypeError: 'Codeblock Error: Expected type string for mode.',
      themeTypeError: 'Codeblock Error: Expected type string for theme.',
      fontTypeError: 'Codeblock Error: Expected type string for font.',
      fontSizeTypeError: 'Codeblock Error: Expected type string for fontSize.',
      invalidThemeError: (theme) => `Codeblock Error: Theme ${theme} provided is invalid.`,
      invalidFontError: (font) => `Codeblock Error: Font ${font} provided is invalid.`
    };
    
    this.#themes = 
    {
      atomOneLight: 'atom-one-light',
      githubLight: 'github-light',
      xcodeLight: 'xcode-light'
    };
    
    this.#fonts = 
    {
      systemMono: 'ui-monospace',
      menlo: 'Menlo',
      courier: 'Courier'
    };
    
    this.#modes = 
    {
      javascript: 'javascript',
      json: 'json',
      markdown: 'markdown',
      plainText: 'text/plain'
    };

    this.element.classList.add('codeblock');
    
    this.#codeElement = document.createElement('code');
    this.#codeElement.classList.add('hljs');
    this.element.appendChild(this.#codeElement);

    this.theme = options.theme ?? this.themes.atomOneLight;
    this.code = options.code ?? '';
    this.font = options.font ?? this.fonts.systemMono;
    this.fontSize = options.fontSize ?? '12px';
    
    this.#applyBaseStyles();
    this.#createCopyButton();
  }
  
  /** Private method to apply the base styles for the pre and code elements. */
  #applyBaseStyles()
  {
    this.style.position = 'relative';
    this.style.padding = '12px 20px';
    this.style.margin = '12px 0';
    this.style.overflowX = 'auto';
    this.style.borderRadius = '5px';
    this.style.border = '1px solid lightgray';
    this.style.minWidth = '15%';
    this.style.maxWidth = '30%';
    
    this.#codeElement.style.display = 'block';
    this.#codeElement.style.padding = '0';
    this.#codeElement.style.background = 'transparent';
  }
  
  /** Private method to apply the specific theme based on the user's option. */
  #applyTheme()
  {
    Object.values(this.#themes).forEach(theme =>
    {
      this.element.classList.remove(`codeblock-theme-${theme}`);
    });
    this.element.classList.add(`codeblock-theme-${this.#theme}`);
    
    if(this.theme === this.themes.atomOneLight) { this.backgroundColor = '#fafafa'; }
    else if(this.theme === this.themes.githubLight) { this.backgroundColor = '#ffffff'; }
    else if(this.theme === this.themes.xcodeLight) { this.backgroundColor = '#fff'; }
  }
  
  /** Private method to create the copy button. */
  #createCopyButton()
  {
    this.#copyButton = new ui.Button();
    this.#copyButton.icon = 'fa-clipboard';
    this.#copyButton.iconColor = 'black';
    this.#copyButton.style.position = 'absolute';
    this.#copyButton.style.top = '-2px';
    this.#copyButton.style.right = '-2px';
    this.#copyButton.style.border = 'none';
    this.#copyButton.style.background = 'transparent';
    this.#copyButton.style.cursor = 'pointer';
    this.#copyButton.alpha = '0.5';
    
    this.#copyButton.addEventListener({ event: 'mouseenter', handler: () =>
    {
      this.#copyButton.alpha  = '1.0';
    }});
    
    this.#copyButton.addEventListener({ event: 'mouseleave', handler: () =>
    {
      this.#copyButton.alpha = '0.5';
    }});
    
    this.#copyButton.onTap = () => { this.#copyToClipboard(); }
    this.element.appendChild(this.#copyButton.element);
  }
  
  /** Private method called when the user taps the copy button. */
  #copyToClipboard()
  {
    clipboard.write({ text: this.code })
    .then(() => 
    {
      let originalIcon = this.#copyButton.icon;
      this.#copyButton.icon = 'fa-check';
      setTimeout(() => { this.#copyButton.icon = originalIcon; }, 1500);
    });
  }
  
  /** Private method to apply appropriate highlighting. */
  #highlight()
  {
    if(window.hljs)
    {
      this.#codeElement.removeAttribute('data-highlighted');
      window.hljs.highlightElement(this.#codeElement);
    }
  }

  /** 
   * Get property to return the codeblock's current code.
   * @return {String} The codeblock's current code.
   */
  get code() 
  { 
    return this.#codeElement.textContent; 
  }
  
  /** 
   * Set property to set the codeblock's code.
   * @param {String} value - The codeblock's code.
   */
  set code(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.codeTypeError);
      return;
    }

    this.#codeElement.textContent = value;
    this.#highlight();
  }
  
  /** 
   * Get property to return the codeblock's current font.
   * @return {String} The codeblock's current font.
   */
  get font()
  {
    return this.#font;
  }
  
  /** 
   * Set property to set the editor's font.
   * @param {String} value - The editor's font.
   */
  set font(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.fontTypeError);
      return;
    }
    
    if(!Object.values(this.#fonts).includes(value))
    {
      console.error(this.#errors.invalidFontError(value));
      return;
    }
    
    this.#font = value;
    this.#codeElement.style.fontFamily = value;
  }
  
  /** 
   * Get property to return the codeblock's supported fonts.
   * @return {Object} The codeblock's supported fonts.
   */
  get fonts()
  {
    return this.#fonts;
  }
  
  /** 
   * Get property to return the codeblock's current font size.
   * @return {String} The codeblock's current font size.
   */
  get fontSize()
  {
    return this.#fontSize;
  }
  
  /** 
   * Set property to set the codeblock's font size.
   * @param {String} value - Font size in pixels.
   */
  set fontSize(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.fontSizeTypeError);
      return;
    }

    this.#fontSize = value;
    this.#codeElement.style.fontSize = value;
  }
  
  /** 
   * Get property to return the codeblock's current mode.
   * @return {String} The codeblock's current mode.
   */
  get mode() 
  { 
    return this.#mode; 
  }
  
  /** 
   * Set property to set the codeblock's current mode.
   * @param {String} value - The codeblock's current mode.
   */
  set mode(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.modeTypeError);
      return;
    }

    this.#mode = value;
    this.#codeElement.className = `hljs language-${value}`;
    this.#highlight();
  } 
 
  /** 
   * Get property to return all the supported modes for the codeblock.
   * @return {Object} The codeblock's supported modes.
   */
  get modes() 
  { 
    return this.#modes; 
  } 
  
  /** 
   * Get property to return the codeblock's current theme.
   * @return {String} The codeblock's current theme.
   */
  get theme()
  {
    return this.#theme;
  }
  
  /** 
   * Set property to set the codeblock's current theme.
   * @param {String} value - The codeblock's current theme.
   */
  set theme(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.themeTypeError);
      return;
    }
    
    if(!Object.values(this.#themes).includes(value))
    {
      console.error(this.#errors.invalidThemeError(value));
      return;
    }
    
    this.#theme = value;
    this.#applyTheme();
  }
  
  /** 
   * Get property to return all the supported themes for the codeblock.
   * @return {Object} The codeblock's supported themes.
   */
  get themes()
  {
    return this.#themes;
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'code-block', constructor: _Codeblock_ });

///////////////////////////////////////////////////////////