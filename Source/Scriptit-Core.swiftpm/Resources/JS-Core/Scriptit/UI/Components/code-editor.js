//////////////////////////////////////////////////

/** Class representing the code editor component. */
class _CodeEditor_ extends Component
{
  #autoCloseBrackets;
  #cmChangeHandler;
  #editor;
  #errors;
  #font;
  #fonts;
  #fontSize;
  #lineNumbers;
  #lineWrapping;
  #mode;
  #modes;
  #onTextChange;
  #readOnly;
  #tabSize;
  #textarea;
  #theme;
  #themes;
  
  /** Creates the code editor object. */
  constructor(options = {})
  {
    super({ tagName: 'div', options: options });
    this.#errors = 
    {
      autoCloseBracketsTypeError: 'Code Editor Error: Expected type boolean for autoCloseBrackets.',
      codeMirrorNotLoadedError: 'Code Editor Error: CodeMirror has not been loaded yet.',
      fontTypeError: 'Code Editor Error: Expected type string for font.',
      fontSizeTypeError: 'Code Editor Error: Expected type number for fontSize.',
      lineNumbersTypeError: 'Code Editor Error: Expected type boolean for lineNumbers.',
      lineWrappingTypeError: 'Code Editor Error: Expected type boolean for lineWrapping.',
      modeTypeError: 'Code Editor Error: Expected type string for mode.',
      modeNotSupportedError: (mode) => `Code Editor Error: Mode "${mode}" is not supported.`,
      onTextChangeTypeError: 'Code Editor Error: Expected type function for onTextChange.',
      readOnlyTypeError: 'Code Editor Error: Expected type boolean for readOnly.',
      tabSizeTypeError: 'Code Editor Error: Expected tabSize to be 2 or 4.',
      textTypeError: 'Code Editor Error: Expected type string for text.',
      themeTypeError: 'Code Editor Error: Expected type string for theme.',
      themeNotSupportedError: (theme) => `Code Editor Error: Theme "${theme}" is not supported.`
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
    
    this.#themes = 
    {
      atomOneLight: 'atom-one-light',
      githubLight: 'github-light',
      default: 'default',
      xcodeLight: 'xcode-light'
    };
    
    this.#createTextarea();
    this.#createEditor();
    
    this.autoCloseBrackets = options.autoCloseBrackets || true;
    this.mode = options.mode || this.modes.javascript;
    this.text = options.text || '';
    this.font = options.font || this.fonts.systemMono;
    this.fontSize = options.fontSize || '10px';
    this.theme = options.theme || this.themes.atomOneLight;
    this.lineNumbers = options.lineNumbers || true;
    this.lineWrapping = options.lineWrapping || true;
    this.readOnly = options.readOnly || false;
    this.tabSize = options.tabSize || 2;
    if(options.onTextChange) this.onTextChange = options.onTextChange;
  }

  /** Create backing textarea (required by CodeMirror 5) */
  #createTextarea()
  {
    this.#textarea = document.createElement('textarea');
    this.#textarea.value = '';
    this.element.appendChild(this.#textarea);
  }

  /** Private method to initialize CodeMirror and create the internal editor. */
  #createEditor()
  {
    if(!window.CodeMirror)
    {
      console.error(this.#errors.codeMirrorNotLoadedError);
      return;
    }
    
    this.#editor = CodeMirror.fromTextArea(this.#textarea, 
    {
      mode: 'javascript',
      theme: 'default',
      lineNumbers: true,
      dragDrop: false,
      autoCloseBrackets: true,
      lineWrapping: true
    });
    
    requestAnimationFrame(() =>
    {
      this.refresh();
      this.#editor.scrollIntoView({ line: 0, ch: 0 });
    });

    this.#editor.setSize('100%', '100%');
    this.#editor.on('focus', () => { scroll.lock(); });
    this.#editor.on('blur', () => { scroll.unlock(); });
  }
  
  /** 
   * Get property to return the editor's auto close brackets value.
   * @return {Boolean} The editor's auto close brackets value.
   */
  get autoCloseBrackets()
  {
    return this.#autoCloseBrackets;
  }
  
  /** 
   * Set property to set the editor's auto close brackets value.
   * @param {Boolean} value - The editor's auto close brackets value.
   */
  set autoCloseBrackets(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value }))
    {
      console.error(this.#errors.autoCloseBracketsTypeError);
      return;
    }
  
    this.#autoCloseBrackets = value;
  
    if(this.#editor)
    {
      this.#editor.setOption('autoCloseBrackets', value);
    }
  }
  
  /** 
   * Get property to return the editor's current font.
   * @return {String} The editor's current font.
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
  
    if(this.#font === value) return;
    this.#font = value;

    if(this.#editor)
    {
      let wrapper = this.#editor.getWrapperElement(); 
      wrapper.style.fontFamily = value;
      wrapper.querySelectorAll('.CodeMirror pre, .CodeMirror-gutters')
        .forEach(el => el.style.fontFamily = value);
      this.refresh();
    }
  }
  
  /** 
   * Get property to return the editor's supported fonts.
   * @return {Object} The editor's supported fonts.
   */
  get fonts()
  {
    return this.#fonts;
  }
  
  /** 
   * Get property to return the editor's current font size.
   * @return {String} The editor's current font size.
   */
  get fontSize()
  {
    return this.#fontSize;
  }
  
  /** 
   * Set property to set the editor's font size.
   * @param {String} value - Font size in pixels.
   */
  set fontSize(value)
  {
    if(!typechecker.check({ type: 'string', value: value }))
    {
      console.error(this.#errors.fontSizeTypeError);
      return;
    }
  
    if(this.#fontSize === value) return;
    this.#fontSize = value;
  
    if(this.#editor)
    {
      let wrapper = this.#editor.getWrapperElement();
      wrapper.style.fontSize = value;
      wrapper.querySelectorAll('.CodeMirror pre, .CodeMirror-gutters')
        .forEach(el => el.style.fontSize = value);
      this.refresh();
    }
  }
  
  /** 
   * Get property to return if the editor is currently showing line numbers or not.
   * @return {Boolean} Value determining if the editor is currently showing line numbers or not.
   */
  get lineNumbers()
  {
    return this.#lineNumbers;
  }
  
  /** 
   * Set property to set the editor's lineNumbers value.
   * @param {Boolean} value - The editor's lineNumbers value. True shows lineNumbers gutter and false does not.
   */
  set lineNumbers(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value }))
    {
      console.error(this.#errors.lineNumbersTypeError);
      return;
    }
    
    if(this.#editor)
    {
      this.#lineNumbers = value;
      this.#editor.setOption('lineNumbers', value);
      this.refresh();
    }
  }
  
  /** 
   * Get property to return if the editor is currently wrapping the line or not.
   * @return {Boolean} Value determining if the editor is currently wrapping the line or not.
   */
  get lineWrapping()
  {
    return this.#lineWrapping;
  }
  
  /** 
   * Set property to set the editor's lineWrapping value.
   * @param {Boolean} value - The editor's lineWrapping value.
   */
  set lineWrapping(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value }))
    {
      console.error(this.#errors.lineWrappingTypeError);
      return;
    }
  
    this.#lineWrapping = value;
  
    if(this.#editor)
    {
      this.#editor.setOption('lineWrapping', value);
      this.refresh();
    }
  }
  
  /** 
   * Get property to return the editor's current mode.
   * @return {String} The editor's current mode.
   */
  get mode()
  {
    return this.#mode;
  }

  /** 
   * Set property to set the editor's current mode.
   * @param {String} value - The editor's current mode.
   */
  set mode(value)
  {
    if(!typechecker.check({ type: 'string', value: value }))
    {
      console.error(this.#errors.modeTypeError);
      return;
    }
    
    let supportedModes = Object.values(this.#modes);
    if(!supportedModes.includes(value))
    {
      console.error(this.#errors.modeNotSupportedError(value));
      return;
    }
    
    if(this.#mode === value) return;
    
    if(this.#editor)
    {
      if(value === 'json') 
      {
        this.#mode = value;
        value = { name: 'javascript', json: true };
      }
      else this.#mode = value;
    
      this.#editor.setOption('mode', value);
      this.refresh();
    }
  }
  
  /** 
   * Get property to return all the supported modes for the editor.
   * @return {Object} The editor's supported modes.
   */
  get modes()
  {
    return this.#modes;
  }
  
  /** 
   * Get property to return the function being called during on text change events.
   * @return {Function} The function being called during on text change events.
   */
  get onTextChange() 
  { 
    return this.#onTextChange; 
  }

  /** 
   * Set property to set the function being called during on text change events.
   * @param {Function} value - The function being called during on text change events.
   */
  set onTextChange(handler)
  {
    if(!typechecker.check({ type: 'function', value: handler }))
    {
      console.error(this.#errors.onTextChangeTypeError);
      return;
    }
  
    if(this.#editor && this.#cmChangeHandler)
    {
      this.#editor.off('change', this.#cmChangeHandler);
    }
  
    this.#onTextChange = handler;
  
    this.#cmChangeHandler = (cm, change) =>
    {
      handler(cm.getValue(), change, cm);
    };
  
    if(this.#editor)
    {
      this.#editor.on('change', this.#cmChangeHandler);
    }
  }
  
  /** 
   * Get property to return the editor's current tab size.
   * @return {Number} The editor's tab size.
   */
  get tabSize()
  {
    return this.#tabSize;
  }
  
  /** 
   * Set property to set the editor's tab size.
   * Only supports 2 or 4.
   * @param {Number} value - The editor's tab size.
   */
  set tabSize(value)
  {
    if(value !== 2 && value !== 4)
    {
      console.error(this.#errors.tabSizeTypeError);
      return;
    }
  
    if(this.#tabSize === value) return;
    this.#tabSize = value;
  
    if(this.#editor)
    {
      this.#editor.setOption('tabSize', value);
      this.#editor.setOption('indentUnit', value);
      this.refresh();
    }
  }

  /** 
   * Get property to return the editor's current text.
   * @return {String} The editor's current text.
   */
  get text()
  {
    return this.#editor?.getValue() || '';
  }

  /** 
   * Set property to set the editor's current text.
   * @param {String} value - The editor's current text.
   */
  set text(value)
  {
    if(!typechecker.check({ type: 'string', value: value }))
    {
      console.error(this.#errors.textTypeError);
      return;
    }
    
    this.#editor?.setValue(value);
  }
  
  /** 
   * Get property to return the editor's current theme.
   * @return {String} The editor's current theme.
   */
  get theme()
  {
    return this.#theme;
  }

  /** 
   * Set property to set the editor's current theme.
   * @param {String} value - The editor's current theme.
   */
  set theme(value)
  {
    if(!typechecker.check({ type: 'string', value: value }))
    {
      console.error(this.#errors.themeTypeError);
      return;
    }
   
    let supportedThemes = Object.values(this.#themes);
    if(!supportedThemes.includes(value))
    {
      console.error(this.#errors.themeNotSupportedError(value));
      return;
    }
    
    if(this.#theme === value) return;
    if(this.#editor)
    {
      this.#theme = value;
      this.#editor.setOption('theme', value);
      this.refresh();
    }
  }
  
  /** 
   * Get property to return all the supported themes for the editor.
   * @return {Object} The editor's supported themes.
   */
  get themes()
  {
    return this.#themes;
  }
  
  /** 
   * Get property to return if the editor is currently readOnly or not.
   * @return {Boolean} Value determining if the editor is currently readOnly or not.
   */
  get readOnly()
  {
    return this.#readOnly;
  }
  
  /** 
   * Set property to set the editor's readOnly value.
   * @param {Boolean} value - The editor's readOnly value.
   */
  set readOnly(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value }))
    {
      console.error(this.#errors.readOnly);
      return;
    }
    
    if(this.#editor)
    {
      this.#readOnly = value;
      this.#editor.setOption('readOnly', value);
      this.refresh();
    }
  }
  
  /** Public method called to focus the editor. */
  focus()
  {
    this.#editor?.focus();
  }

  /** Public method called to refresh the editor. */
  refresh()
  {
    this.#editor?.refresh();
  }
}

//////////////////////////////////////////////////

typechecker.register({ name: 'code-editor', constructor: _CodeEditor_ });

//////////////////////////////////////////////////