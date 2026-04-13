//////////////////////////////////////////////////

/** Class representing the inspector component. */
class _Inspector_ extends Component
{
  #errors;
  #convertEol;
  #cursorBlink;
  #disableStdin;
  #font;
  #fontSize;
  #height;
  #lastCols;
  #lastRows;
  #resizeObserver;
  #scrollback;
  #terminal;
  #width;
  
  /** Creates the inspector object. */
  constructor(options = {})
  {
    super({ tagName: 'div', options: options });
    this.#errors = 
    {
      convertEolTypeError: 'Inspector Error: Expected type boolean for converEol.',
      contentTypeError: 'Inspector Error: Expected type string or number or number for content in write method.',
      cursorBlinkTypeError: 'Inspector Error: Expected type boolean for cursorBlink.',
      disableStdinTypeError: 'Inspector Error: Expected type boolean for disableStdin.',
      fontTypeError: 'Inspector Error: Expected type string for font.',
      fontSizeTypeErorr: 'Inspector Error: Expected type number for fontSize.',
      heightTypeError: 'Inspector Error: Expected type string for height.',
      newlineTypeError: 'Inspector Error: Expected type boolean for newline.',
      scrollbackTypeError: 'Inspector Error: Expected type number for scrollback.',
      widthTypeError: 'Inspector Error: Expected type string for width.'
    };
    
    this.style.display = 'block';
    this.style.width = '100%';
    this.style.height = '100%';
    this.style.minHeight = '0';
    this.style.flex = '1 1 auto';
    this.style.overflow = 'hidden';
    this.style.textAlign = 'left';
    
    this.#createTerminal();
    this.#resizeObserver = new ResizeObserver(() =>
    {
      requestAnimationFrame(() =>
      {
        this.#resizeTerminal();
      });
    });
    this.#resizeObserver.observe(this.element);
    
    this.convertEol = options.convertEol || true;
    this.cursorBlink = options.cursorBlink || false;
    this.disableStdin = options.disableStdin || true;
    this.font = options.font || font.library.menlo;
    this.height = options.height || '100%';
    this.fontSize = options.fontSize || 12;
    this.scrollback = options.scrollback || 1000;
    this.width = options.width || '100%';
  }
  
  #createTerminal()
  {
    this.#terminal = new Terminal({
      disableStdin: true,
      convertEol: true,
      cursorBlink: false,
      fontSize: 12,
      fontFamily: 'Menlo, monospace',
      scrollback: 1000
    });

    this.#terminal.open(this.element);
  }
  
  #resizeTerminal()
  {
    if(!this.#terminal) return;
  
    let rect = this.element.getBoundingClientRect();
    if(rect.width === 0 || rect.height === 0) return;
  
    let fontSize = parseInt(this.#terminal.options.fontSize, 10);
    let lineHeight = fontSize * 1.2;
    let charWidth = fontSize * 0.6;
  
    let cols = Math.floor(rect.width / charWidth);
    let rows = Math.floor(rect.height / lineHeight);
  
    if(cols <= 0 || rows <= 0) return;
    if(cols === this.#lastCols && rows === this.#lastRows) { return; }
    
    this.#lastCols = cols;
    this.#lastRows = rows;
  
    this.#terminal.resize(cols, rows);
  }
  
  /** 
   * Get property to return the terminal's convertEol value.
   * @return {Boolean} The terminal's convertEol value.
   */
  get convertEol()
  {
    return this.#convertEol;
  }
  
  /** 
   * Set property to set the terminal's convertEol value.
   * @param {Boolean} value - The terminal's convertEol value.
   */
  set convertEol(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value }))
    {
      console.error(this.#errors.convertEolTypeError);
      return;
    }
    
    this.#convertEol = value;
    if(this.#terminal) { this.#terminal.options.convertEol = value; }
  }
  
  /** 
   * Get property to return the terminal's cursorBlink value.
   * @return {Boolean} The terminal's cursorBlink value.
   */
  get cursorBlink()
  {
    return this.#cursorBlink;
  }
  
  /** 
   * Set property to set the terminal's cursorBlink value.
   * @param {Boolean} value - The terminal's cursorBlink value.
   */
  set cursorBlink(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value }))
    {
      console.error(this.#errors.cursorBlinkTypeError);
      return;
    }
    
    this.#cursorBlink = value;
    if(this.#terminal) { this.#terminal.options.cursorBlink = value; }
  }
  
  /** 
   * Get property to return the terminal's disableStdin value.
   * @return {Boolean} The terminal's disableStdin value.
   */
  get disableStdin()
  {
    return this.#disableStdin;
  }
  
  /** 
   * Set property to set the terminal's disableStdin value.
   * @param {Boolean} value - The terminal's disableStdin value.
   */
  set disableStdin(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value }))
    {
      console.error(this.#errors.disableStdinTypeError);
      return;
    }
    
    this.#disableStdin = value;
    if(this.#terminal) { this.#terminal.options.disableStdin = value; }
  }
  
  /** 
   * Get property to return the terminal's font value.
   * @return {String} The terminal's font value.
   */
  get font()
  {
    return this.#font;
  }
  
  /** 
   * Set property to set the terminal's font value.
   * @param {String} value - The terminal's font value.
   */
  set font(value)
  {
    if(!typechecker.check({ type: 'string', value: value }))
    {
      console.error(this.#errors.fontTypeError);
      return;
    }
    
    this.#font = value;
    if(this.#terminal) { this.#terminal.options.fontFamily = value; }
  }
  
  /** 
   * Get property to return the terminal's fontSize value.
   * @return {Number} The terminal's fontSize value.
   */
  get fontSize()
  {
    return this.#fontSize;
  }
  
  /** 
   * Set property to set the terminal's fontSize value.
   * @param {Number} value - The terminal's fontSize value.
   */
  set fontSize(value)
  {
    if(!typechecker.check({ type: 'number', value: value }))
    {
      console.error(this.#errors.fontSizeTypeError);
      return;
    }
    
    this.#fontSize = value;
    if(this.#terminal) { this.#terminal.options.fontSize = value; }
  }
  
  /** 
   * Get property to return the terminal's height value.
   * @return {String} The terminal's height.
   */
  get height()
  {
    return this.#height;
  }
  
  /** 
   * Set property to set the terminal's height.
   * @param {String} value - CSS height value (e.g. '300px', '50%').
   */
  set height(value)
  {
    if(!typechecker.check({ type: 'string', value: value }))
    {
      console.error(this.#errors.heightTypeError);
      return;
    }
  
    this.#height = value;
    this.element.style.height = value;
  
    if(this.#terminal)
    {
      this.#resizeTerminal();
    }
  }
  
  /** 
   * Get property to return the terminal's scrollback value.
   * @return {Number} The terminal's scrollback value.
   */
  get scrollback()
  {
    return this.#scrollback;
  }
  
  /** 
   * Set property to set the terminal's scrollback value.
   * @param {Number} value - The terminal's scrollback value.
   */
  set scrollback(value)
  {
    if(!typechecker.check({ type: 'number', value: value }))
    {
      console.error(this.#errors.scrollbackTypeError);
      return;
    }
    
    this.#scrollback = value;
    if(this.#terminal) { this.#terminal.options.scrollback = value; }
  }
  
  get theme()
  {
    
  }
  
  set theme(value)
  {
    
  }
  
  /** 
   * Get property to return the terminal's width value.
   * @return {String} The terminal's width.
   */
  get width()
  {
    return this.#width;
  }
  
  /** 
   * Set property to set the terminal's width.
   * @param {String} value - CSS width value (e.g. '100%', '400px').
   */
  set width(value)
  {
    if(!typechecker.check({ type: 'string', value: value }))
    {
      console.error(this.#errors.widthTypeError);
      return;
    }
  
    this.#width = value;
    this.element.style.width = value;
  
    if(this.#terminal)
    {
      this.#resizeTerminal();
    }
  }
  
  /** Public method to clear the buffer and terminal. */
  clear()
  {
    if(!this.#terminal) return;
    this.#terminal.clear();
  }
  
  /**
   * Writes content to the terminal.
   * @param {String|Number} value - The text to write.
   * @param {Boolean} newLine - Whether to append a newline.
   */
  write({ content, newline = false })
  {
    if(!this.#terminal) return;
  
    if(!typechecker.checkMultiple({ types: ['string', 'number'], value: content }))
    {
      console.error(this.#errors.contentTypeError);
      return;
    }
    
    if(!typechecker.check({ type: 'boolean', value: newline }))
    {
      console.error(this.#errors.newlineTypeError);
      return;
    }
    
    this.#terminal.write('\x1b[0G');
    let output = '  ' + String(content);

    if(newline) { this.#terminal.writeln(output); }
    else { this.#terminal.write(output); }
  }
}

//////////////////////////////////////////////////

typechecker.register({ name: 'inspector', constructor: _Inspector_ });

//////////////////////////////////////////////////