
///////////////////////////////////////////////////////////

/** Class representing the segment component. */
class _SegmentedControl_ extends Component
{
  #errors;
  #font;
  #onChange;
  #segments;
  #color;

  /**
   * Creates the segmented control object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {})
  {
    super({ tagName: "ons-segment", options: options });

    this.#errors = 
    {
      activeIndexTypeError: 'Segmented Control Error: Expected type number for active index.',
      activeIndexTooHighError: 'Segmented Control Error: Index provided was higher than the length of the segments array.',
      activeIndexNegativeError: 'Segmented Control Error: Index cannot be negative.',
      colorInvalidError: 'Segmented Control Error: Invalid color value provided for color.',
      colorTypeError: 'Segmented Control Error: Expected type string for color.',
      fontTypeError: 'Segmented Control Error: Expected type string for font.',
      onChangeTypeError: 'Segmented Control Error: Expected type function for onChange.',
      segmentTypeError: 'Segmented Control Error: Expected type string for segment.',
      segmentsTypeError: 'Segmented Control Error: Expected type array for segments.'
    };

    this.#segments = [];
    this.font = options.font || font.library.system;
    if(options.segments) this.segments = options.segments;
    if(options.onChange) this.onChange = options.onChange;
    this.color = options.color || '#1f8dd6';
    this.width = options.width || '200px';
  }
  
  /** Private method to re-render the segmented control. */
  #render()
  {
    this.#segments.forEach((segment, index) => 
    {
      let button = document.createElement('button');
      button.classList.add('segment__item');
  
      let input = document.createElement("input");
      input.classList.add("segment__input");
      input.type = "radio";
      input.value = index;
      input.name = 'ons-segment-gen-0';
  
      let div = document.createElement("div");
      div.classList.add("segment__button");
      div.style.fontFamily = this.#font;
      div.textContent = segment;
  
      button.appendChild(input);
      button.appendChild(div);
      this.element.appendChild(button);
    });
  }
  
  /** 
   * Get property to return active index of the segmented control.
   * @return {number} The active index of the segmented control.
   */
  get activeIndex() 
  { 
    return this.element.getActiveButtonIndex(); 
  }
  
  /** 
   * Set property to set the active index of the segmented control.
   * @param {number} value - The active index of the segmented control.
   */
  set activeIndex(value)
  {
    if(!typechecker.check({ type: 'number', value: value })) 
    {
      console.error(this.#errors.activeIndexTypeError);
      return;
    }
    if(value > this.#segments.length) 
    {
      console.error(this.#errors.activeIndexTooHighError);
      return;
    }
    if(value < 0 && this.#segments.length > 0)  
    {
      console.error(this.#errors.activeIndexNegativeError);
      return;
    }
    this.element.setActiveButton(value);
  }

  /** 
   * Get property to return the main color of the segmented control.
   * @return {string} The main color of the segmented control.
   */
  get color() 
  { 
    return this.#color; 
  }
  
  /** 
   * Set property to set the main color of the segmented control.
   * @param {string} value - The main color of the segmented control.
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

    this.style.setProperty('--segment-color', value );
    this.style.setProperty('--segment-border-top', `1px solid ${value}`);
    this.style.setProperty('--segment-border-bottom', `1px solid ${value}`);
    this.#color = value;
  }
  
  /** 
   * Get property to return the font value of the segmented control object.
   * @return {string} The font value of the segmented control object. 
   */
  get font() 
  { 
    return this.#font; 
  }
  
  /** 
   * Set property to set the font value of the segmented control object.
   * @param {string} value - The font value of the segmented control object.
   */
  set font(value)
  {
    if(!typechecker.check({ type: 'string', value: value })) c
    {
      onsole.error(this.#errors.fontTypeError);
      return;
    }
    this.#font = value;
    this.element.innerHTML = '';
    this.#render();
  }
  
  /** 
   * Get property to return the function being called during on change events.
   * @return {function} The function being called during on change events.
   */
  get onChange() 
  { 
    return this.#onChange; 
  }
  
  /** 
   * Set property to set the function being called during on change events.
   * @param {function} value - The function being called during on change events. Returns index of selected segment.
   */
  set onChange(value) 
  {
    if(!typechecker.check({ type: 'function', value: value })) 
    {
      console.error(this.#errors.onChangeTypeError);
      return;
    }
    if(this.#onChange) this.removeEventListener({ event: 'postchange', handler: this.#onChange });
  
    let handler = (event) => 
    {
      let selectedIndex = event.detail.index;
      value(selectedIndex);
    };
  
    this.#onChange = handler;
    this.addEventListener({ event: 'postchange', handler: handler });
  }
  
  /** 
   * Get property to return segments of the segmented control.
   * @return {array} The segments of the segmented control.
   */
  get segments() 
  { 
    return this.#segments; 
  }

  /** 
   * Set property to set the segments of the segmented control.
   * @param {array} value - The sequence of strings with the titles of the control’s segments.
   */
  set segments(value)
  {
    this.element.innerHTML = '';
    this.#segments = [];
    if(!typechecker.check({ type: 'array', value: value })) 
    {
      console.error(this.#errors.segmentsTypeError);
      return;
    }
    value.forEach(segment => 
    { 
      if(!typechecker.check({ type: 'string', value: segment })) 
      {
        console.error(this.#errors.segmentTypeError);
        return;
      }
      this.#segments.push(segment); 
    });
    this.#render();
    this.activeIndex = 0;
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'segmented-control', constructor: _SegmentedControl_ });

///////////////////////////////////////////////////////////
