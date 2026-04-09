///////////////////////////////////////////////////////////

/** Class representing the link component. */
class _Link_ extends Component
{
  #containsIcon;
  #containsText;
  #errors;
  #iconElement;
  #rawText;
  #tagMap;
  #type;
  #types;
  #url;
  #scrollId;
  #target;
  #targets;
  
  /**
   * Creates the link object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {})
  {
    super({ tagName: 'a', options: options });
    
    this.#errors = 
    {
      colorInvalidError: 'Link Error: Invalid color value provided for color.',
      colorTypeError: 'Link Error: Expected type string for color.',
      fontTypeError: 'Link Error: Expected type string for font.',
      fontSizeTypeError: 'Link Error: Expected type string for font size.',
      iconTypeError: 'Link Error: Expected type string or Icon for icon.',
      invalidEmailError: 'Link Error: Provided email was invalid.',
      invalidPhoneNumberError: 'Link Error: Provided phone number was invalid.', 
      invalidTypeError: (type) => `Link Error: Invalid type for link: ${type}.`,
      invalidUrlError: 'Link Error: Provided url was invalid.',
      invalidTargetError: (target) => `Link Error: Invalid web target for web target: ${target}.`,
      linkTypeError: "Link Error: Link can only have either 'text' or 'icon', not both.",
      scrollIdTypeError: 'Link Error: Expected type string for scrollId.',
      textTypeError: 'Link Error: Expected type string for text.',
      typeTypeError: 'Link Error: Expected type string for type.',
      unsupportedTargetError: 'Link Error: Unsupported web target provided for type web.',
      targetTypeError: 'Link Error: Expected type string for webTarget.'
    };
    
    this.#types = 
    {
      email: 'email',
      phoneNumber: 'phone-number',
      web: 'web'
    };
    
    this.#targets = 
    {
      inApp: 'in-app',
      safari: 'safari',
      self: '_self',
      blank: '_blank',
      none: 'none'
    };
    
    this.#containsIcon = false;
    this.#containsText = false;
    
    this.#rawText = '';
    this.#tagMap = ['b','i','s','u','mark','small','sub','sup'];
    this.style.textDecoration = 'none';
    
    if(options.text && options.icon) 
    {
      console.error(this.#errors.linkTypeError);
      return;
    }
    if(options.text) this.text = options.text;
    else if(options.icon) this.icon = options.icon;
    
    this.type = options.type ?? this.types.web;
    this.target = options.target ?? this.targets.inApp;
    this.font = options.font ?? font.library.system;
    this.fontSize = options.fontSize ?? '12px';
    if(options.url) this.url = options.url;
    if(options.scrollId) this.scrollId = options.scrollId;
    if(options.color) this.color = options.color;
    
    this.onTap = () => 
    {
      if(this.#scrollId) { return; }
      if(!this.#url)
      {
        console.error(this.#errors.invalidUrlError);
        return;
      }
      
      if(this.type === this.types.web)
      {
        console.log(this.#url);
        if(this.target === this.targets.inApp)
        {
          browser.open({ url: this.#url, inApp: true, animated: false });
        }
        else if(this.target === this.target.safari) 
        {
          browser.open({ url: this.#url, inApp: false, animated: false });
        }
      }
    };
  }
  
  /** 
   * Get property to return the color of the link.
   * @return {string} The color of the link.
   */
  get color()
  {
    return this.element.style.color;
  }
  
  /** 
   * Set property to set the color of the link.
   * @param {string} value - The color of the link.
   */
  set color(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.colorTypeError);
      return;
    }
    if(!color.isValid({ color: value })) 
    {
      console.error(this.#errors.colorInvalidError);
      return;
    }
    this.element.style.color = value;
  }
    
  /** 
   * Get property to return the font value of the link.
   * @return {string} The font value of the link. 
   */
  get font() 
  { 
    return this.style.fontFamily; 
  }
  
  /** 
   * Set property to set the font value of the link.
   * @param {string} value - The font value of the link.
   */
  set font(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.fontTypeError);
      return;
    }
    this.style.fontFamily = value;
  }
  
  /** 
   * Get property to return the font size of the link.
   * @return {string} The font size of link. 
   */
  get fontSize() 
  { 
    return this.style.fontSize; 
  }
  
  /** 
   * Set property to set the font size of the the link.
   * @param {string} value - The font size of the the link.
   */
  set fontSize(value) 
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.fontSizeTypeError);
      return;
    }
    this.style.fontSize = value;
  }
  
  /** 
   * Get property to return the icon of the link.
   * @return {string} The icon of link. 
   */
  get icon()
  {
    return this.#iconElement?.icon || null;
  }
  
  /** 
   * Set property to set the icon of the the link.
   * @param {string} value - The icon of the the link.
   */
  set icon(value)
  {
    if(this.#containsText == true) 
    {
      console.error(this.#errors.linkTypeError);
      return;
    }
    if(this.#iconElement) this.element.innerHTML = '';
    if(typechecker.check({ type: 'string', value: value })) this.#iconElement = new ui.Icon({ icon: value });
    else if(typechecker.check({ type: 'icon', value: value })) this.#iconElement = value;
    else 
    {
      console.error(this.#errors.iconTypeError);
      return;
    }
    this.appendChild({ child: this.#iconElement.element });
    this.#containsIcon = true;
  }
  
  /** 
   * Get property to return the scroll id of the link.
   * @return {string} The scroll id of link. 
   */
  get scrollId()
  {
    return this.#scrollId;
  }
  
  /** 
   * Set property to set the scroll id of the link.
   * @param {string} value - The scroll id of the link.
   */
  set scrollId(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.scrollIdTypeError);
      return;
    }
    
    if(this.type === this.types.web)
    {
      this.setAttribute({ key: 'href', value: '#' + value });
      this.#scrollId = value;
    }
    else { return; }
  }
  
  /** 
   * Get property to return the link's text value.
   * @return {string} The link's text value. If inline elements were used the same text will be returned. 
   */
  get text() 
  {
    if(!this.#rawText) return '';
    let raw = this.element.innerHTML;
    raw = raw.replace(
      /<abbr title="(.+?)">(.+?)<\/abbr>/g,
      '[abbr:$2|$1]'
    );

    for(let tag of this.#tagMap) 
    {
      let regex = new RegExp(`<${tag}>(.+?)<\/${tag}>`, 'g');
      raw = raw.replace(regex, `[${tag}:$1]`);
    }

    return raw;
  }
  
  /** 
   * Set property to set the link's text value.
   * @param {string} value - The link's text value.
   * 
   * Supports inline element support through bracket notation.
   * Ex: This is a [i:very] [b:strong] paragraph! 
   * It Supports the following tags:
   * 
   * - b: bold
   * - i: italic
   * - s: strikethrough
   * - u: underline
   * - mark: highlight
   * - shrink: small
   * - subscript: sub
   * - superscript: sup
   */
  set text(value) 
  {
    if(this.#containsIcon == true) 
    {
      console.error(this.#errors.linkTypeError);
      return;
    }
    
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.textTypeError);
      return;
    }

    this.#rawText = value;
    
    let formatted = value;
    formatted = formatted.replace(
      /\[abbr:(.+?)\|(.+?)\]/g,
      '<abbr title="$2">$1</abbr>'
    );

    for(let tag of this.#tagMap) 
    {
      let regex = new RegExp(`\\[${tag}:(.+?)\\]`, 'g');
      formatted = formatted.replace(regex, `<${tag}>$1</${tag}>`);
    }

    this.element.innerHTML = formatted;
  }
  
  /** 
   * Get property to return the link's type.
   * @return {string} The link's type.
   */
  get type()
  {
    return this.#type;
  }
  
  /** 
   * Set property to set the link's type value.
   * @param {string} value - The link's type value.
   */
  set type(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.typeTypeError);
      return;
    }
    
    if(!Object.values(this.#types).includes(value))
    {
      console.error(this.#errors.invalidTypeError(value));
      return;
    }
    
    this.#type = value;
  }
  
  /** 
   * Get property to return the link's types.
   * @return {Object} The link's types.
   */
  get types()
  {
    return this.#types;
  }
  
  /** 
   * Get property to return the link's url.
   * @return {string} The link's url.
   */
  get url()
  {
    this.#url;
  }
  
  /** 
   * Set property to set the link's url value.
   * @param {string} value - The link's url value.
   */
  set url(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.urlTypeError);
      return;
    }
    
    if(this.type === this.types.email)
    {
      if(!validator.isValidEmail({ email: value }))
      {
        console.error(this.#errors.invalidEmailError);
        return;
      }
      this.setAttribute({ key: 'href', value: 'mailto:' + value });
      this.#url = value;
    }
    else if(this.type === this.types.phoneNumber)
    {
      if(!validator.isValidPhoneNumber({ phoneNumber: value }))
      {
        console.error(this.#errors.invalidPhoneNumberError);
        return;
      }
      this.setAttribute({ key: 'href', value: 'tel:' + value });
      this.#url = value;
    }
    else if(this.type === this.types.web)
    {
      if(!validator.isValidURL({ url: value }))
      {
        console.error(this.#errors.invalidUrlError);
        return;
      }
      this.setAttribute({ key: 'href', value: value });
      this.#url = value;
    }
  }
  
  /** 
   * Get property to return the link's target value.
   * @return {string} The link's target value.
   */
  get target()
  {
    return this.#target;
  }
  
  /** 
   * Set property to set the link's target value.
   * @param {string} value - The link's url value.
   */
  set target(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) 
    {
      console.error(this.#errors.targetTypeError);
      return;
    }
    
    if(!Object.values(this.#targets).includes(value))
    {
      console.error(this.#errors.invalidTargetError(value));
      return;
    }
    
    if(this.type === this.types.web)
    {
      if(value === this.targets.self)
      {
        this.setAttribute({ key: 'target', value: value });
        this.#target = value;
      }
      else if(value === this.targets.blank)
      {
        this.setAttribute({ key: 'target', value: value });
        this.#target = value;
      }
      else if(value === this.targets.none)
      {
        this.removeAttribute({ key: 'target' });
        this.#target = value;
      }
      else
      {
        this.removeAttribute({ key: 'target' });
        this.#target = value;
      } 
    }
  }
  
  /** 
   * Get property to return the link's targets value.
   * @return {Object} The link's targets value.
   */
  get targets()
  {
    return this.#targets;
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'link', constructor: _Link_ });

///////////////////////////////////////////////////////////