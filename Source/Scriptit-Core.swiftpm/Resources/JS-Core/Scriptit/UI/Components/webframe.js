///////////////////////////////////////////////////////////

/** Class representing the Webframe component. */
class _Webframe_ extends Component
{
  #doc;
  #errors;
  #html;
  #parser;
  #url;

  constructor(options = {})
  {
    super({ tagName: 'iframe', options: options });

    this.#errors =
    {
      executeJSTypeError: 'Webframe Error: Expected type string for script.',
      executeJSError: 'Webframe Error: Ran into the following error while evaluating JS:',
      htmlTypeError: 'Webframe Error: Expected type string for html.',
      invalidHTMLError: 'Webframe Error: Invalid html provided.',
      invalidURLError: 'Webframe Error: Invalid URL provided: ',
      tagTypeError: 'Webframe Error: Expected type string for tag.',
      urlTypeError: 'Webframe Error: Expected type string for url.',
    };
    
    this.#doc = null;
    this.#html = null;
    this.#url = null;
    this.#parser = new DOMParser();
    
    let sandboxScope = ['allow-downloads', 'allow-forms', 'allow-modals', 'allow-orientation-lock', 'allow-pointer-lock', 'allow-popups', 'allow-popups-to-escape-sandbox', 'allow-presentation', 'allow-same-origin', 'allow-scripts', 'allow-top-navigation', 'allow-top-navigation-by-user-activation' ];
    
    this.setAttribute({ key: 'sandbox', value: sandboxScope.join(' ') });
    this.setAttribute({ key: 'frameborder', value: '0' });
    
    this.width = '100%';
    this.height = '100%';
    
    if(options.html) this.html = options.html;
    if(options.url) this.url = options.url;
  }
  
  /** 
   * Get property to return the html of the webframe.
   * @return {String} The html of the webframe.
   */
  get html()
  {
    return this.#html.replace(/></g, '>\n<').replace(/\n\s*\n/g, '\n');
  }
  
  /** 
   * Set property to set the html of the webframe.
   * @param {string} value - The html of the webframe.
   */
  set html(value)
  {
    if(!typechecker.check({ type: 'string', value: value }))
    {
      console.error(this.#errors.htmlTypeError);
      return;
    }
    
    if(!validator.isValidHTML({ html: value }))
    {
      console.error(this.#errors.invalidHTMLError);
      return;
    }
    
    this.#html = value;
    this.#url = null;
    this.#parser = new DOMParser();
    this.#doc = this.#parser.parseFromString(value, 'text/html');
  }
  
  /** 
   * Get property to return the url of the webframe.
   * @return {String} The url of the webframe.
   */
  get url()
  {
    return this.#url;
  }
  
  /** 
   * Set property to set the url of the webframe.
   * @param {string} value - The url of the webframe.
   */
  set url(value)
  {
    if(!typechecker.check({ type: 'string', value: value }))
    {
      console.error(this.#errors.urlTypeError);
      return;
    }
  
    let normalizedURL = value.trim();
    if(!/^https?:\/\//i.test(normalizedURL)) { normalizedURL = `https://${normalizedURL}`; }
    if(!validator.isValidURL({ url: normalizedURL }))
    {
      console.error(this.#errors.invalidURLError + ` (${normalizedURL})`);
      return;
    }
    
    this.#url = normalizedURL;
    this.#html = null;
    this.#parser = null;
    this.#doc = null;
  }
  
  /**
   * Method called to add custom html elements to the current html head of the webframe. A base html must already be set first.
   * @param {String} tag - The element to create and add to the head of the html in the webframe.
   * @param (Object) options - Object containing any element options. Supported options are attributes, properties, style, text, and innerHTML.
   */
  addNewHeadElement({ tag = 'meta', options = {} })
  {
    if(!typechecker.check({ type: 'string', value: tag }))
    {
      console.error(this.#errors.tagTypeError);
      return;
    }
    
    if(this.html !== null && this.#parser !== null && this.#doc !== null)
    {
      let element = this.#doc.createElement(tag);
      this.applyElementOptions({ element: element, options: options });
      this.#doc.head.appendChild(element);
      this.#html = '<!DOCTYPE html>\n' + this.#doc.documentElement.outerHTML;
    }
  }
  
  /**
   * Method called to add custom html elements to the current html body of the webframe. A base html must already be set first.
   * @param {String} tag - The element to create and add to the body of the html in the webframe.
   * @param (Object) options - Object containing any element options. Supported options are attributes, properties, style, text, and innerHTML.
   */
  addNewBodyElement({ tag = 'script', options = {} })
  {
    if(!typechecker.check({ type: 'string', value: tag }))
    {
      console.error(this.#errors.tagTypeError);
      return;
    }
    
    if(this.html !== null && this.#parser !== null && this.#doc !== null)
    {
      let element = this.#doc.createElement(tag);
      this.applyElementOptions({ element: element, options: options });
      this.#doc.body.appendChild(element);
      this.#html = '<!DOCTYPE html>\n' + this.#doc.documentElement.outerHTML;
    }
  }
  
  /**
   * Method called to apply options to existing html elements.
   * @param {String} element - The existing html element to add options to.
   * @param (Object) options - Object containing any element options. Supported options are attributes, properties, style, text, and innerHTML.
   */
  applyElementOptions({ element, options = {} })
  {
    if(!options || typeof options !== 'object') return;
    if(options.attributes)
    {
      for(let [key, value] of Object.entries(options.attributes))
      {
        if(value != null) element.setAttribute(key, String(value));
      }
    }
  
    if(options.properties)
    {
      for(let [key, value] of Object.entries(options.properties))
      {
        if(key in element) element[key] = value;
      }
    }
  
    if(options.style)
    {
      for(let [key, value] of Object.entries(options.style))
      {
        element.style[key] = value;
      }
    }
  
    if(typechecker.check({ type: 'string', value: options.text })) { element.textContent = options.text; }
    if(typechecker.check({ type: 'string', value: options.html })) { element.innerHTML = options.html; }
  }
  
  /**
   * Executes javascript code within the webframe.
   * @param {String} script - The javascript code to run.
   */
  executeJS({ script })
  {
    if(!typechecker.check({ type: 'string', value: script }))
    {
      console.error(this.#errors.executeJSTypeError);
      return;
    }
    
    try { this.element.contentWindow.eval(script); }
    catch(e) { console.error(this.#errors.executeJSError + e); }
  }
  
  /** Public method to load the webframe. */
  load()
  {
    if(this.#url === null && this.#html !== null) 
    { 
      let blob = new Blob([ this.#html ], { type: 'text/html' });
      let src = URL.createObjectURL(blob);
      this.setAttribute({ key: 'src', value: src }); 
    }
    else if(this.#html === null && this.#url !== null) { this.setAttribute({ key: 'src', value: this.#url }); }
    else { return; }
  }
  
  /** Public method to reload the webframe. */
  reload()
  {
    if(this.#url === null && this.#html === null) { return; }
    else { this.load(); }
  }

  /** Public method to stop the webframe. Passes in blank to the src internally. */
  stop()
  {
    this.setAttribute({ key: 'src', value: 'about:blank' });
  }  
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'webframe', constructor: _Webframe_ });

///////////////////////////////////////////////////////////
