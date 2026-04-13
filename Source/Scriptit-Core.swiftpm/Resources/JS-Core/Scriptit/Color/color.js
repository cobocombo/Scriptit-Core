///////////////////////////////////////////////////////////
// COLOR MODULE
///////////////////////////////////////////////////////////

/** Singleton class representing the main color object. */
class ColorManager
{
  #errors;
  static #instance = null;

  /** Creates the color object. **/
  constructor() 
  {
    this.#errors = 
    {
      singleInstanceError: 'Color Manager Error: Only one ColorUtility object can exist at a time.'
    };

    if(ColorManager.#instance) console.error(this.#errors.singleInstanceError);
    else ColorManager.#instance = this;
  }

  /** Static method to return a new ColorUtility instance. Allows for Singleton+Module pattern. */
  static getInstance() 
  {
    return new ColorManager();
  }
  
  /** 
   * Public method to check if a string is a valid hex color value or not.
   * @param {string} color - The color to verify.
   */
  isHexColor({ color } = {}) 
  {
    if(typeof color !== 'string') return false;
    return /^#[0-9a-fA-F]{6}$/.test(color);
  }
  
  /** 
   * Public method to check if a color value is valid or not. 
   * @param {string} color - The color to verify.
   */
  isValid({ color } = {}) 
  {
    let s = new Option().style;
    s.color = '';
    s.color = color;
    return s.color !== '';
  }
}

///////////////////////////////////////////////////////////

globalThis.color = ColorManager.getInstance();

///////////////////////////////////////////////////////////