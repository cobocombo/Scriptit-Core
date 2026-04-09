///////////////////////////////////////////////////////////
// FONT MODULE
///////////////////////////////////////////////////////////

/** Singleton class representing the main font object. */
class FontManager
{
  #errors;
  static #instance = null;
  #library;
  #loaded;

  /** Creates the font object. **/
  constructor() 
  {
    this.#errors = 
    {
      fontAlreadyLoadedError: (name) => `Font Manager Error: The font "${name}" is already loaded.`,
      fontFailedToLoadError: (name) => `Font Manager Error: The font '${name}' failed to load.`,
      nameTypeError: 'Font Manager Error: Expected type string for name.',
      singleInstanceError: 'Font Manager Error: Only one FontManager object can exist at a time.',
      sourceTypeError: 'Font Manager Error: Expected type string for source.',
    };

    if(FontManager.#instance) console.error(this.#errors.singleInstanceError);
    else FontManager.#instance = this;
    
    this.#library = 
    {
      americanTypewriter: 'American Typewriter',
      arial: 'Arial',
      avenirNext: 'Avenir Next',
      chalkduster: 'Chalkduster',
      courier: 'Courier',
      futura: 'Futura',
      helveticaNeue: 'Helvetica Neue',
      menlo: 'Menlo',
      noteworthy: 'Noteworthy',
      system: '-apple-system',
      systemMono: 'ui-monospace'
    };
    
    this.#loaded = {};
  }

  /** Static method to return a new FontManager instance. Allows for Singleton+Module pattern. */
  static getInstance() 
  {
    return new FontManager();
  }
  
  /** 
   * Get property to return the font library object.
   * @return {object} The supported fonts of Scriptit-Core out of the box.
   */
  get library()
  {
    return this.#library;
  }
  
  /** 
   * Public method to dynamically load a font using the font module.
   * @param {string} name - The name of the font to reference that should be registered in the map.
   * @param {string} source - The source of the font to reference for loading.
   */
  load({ name, source }) 
  {
    if(!typechecker.check({ type: 'string', value: name })) 
    {
      console.error(this.#errors.nameTypeError);
      return;
    }
    if(!typechecker.check({ type: 'string', value: source })) 
    {
      console.error(this.#errors.sourceTypeError);
      return;
    }
    
    if(this.#loaded[name]) console.error(this.#errors.fontAlreadyLoadedError(name));
    let font = new FontFace(name, `url("${source}")`);
    
    font.load()
    .then(loadedFont => 
    {
      document.fonts.add(loadedFont);
      this.#loaded[name] = true;
    })
    .catch(err => 
    {
      this.#loaded[name] = false;
      console.error(this.#errors.fontFailedToLoadError(name));
    });
  }
  
  /** 
   * Public method to verify a font has been previously loaded by the font module.
   * @param {string} name - The name of the font to reference that should be registered in the map.
   * @return {boolean} - Returns if the font has been previously loaded or not.
   */
  isLoaded({ name }) 
  {
    if(!typechecker.check({ type: 'string', value: name })) 
    {
      console.error(this.#errors.nameTypeError);
      return;
    }
    return !!this.#loaded[name];
  }
}

///////////////////////////////////////////////////////////

globalThis.font = FontManager.getInstance();

///////////////////////////////////////////////////////////