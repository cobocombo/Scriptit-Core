///////////////////////////////////////////////////////////
// VERSIONS MODULE
///////////////////////////////////////////////////////////

/** Singleton class representing the main versions object. */
class Versions
{
  #errors;
  
  /** Creates the versions object. **/
  constructor() 
  {
    this.#errors = 
    {
      singleInstanceError: 'Versions Error: Only one Versions object can exist at a time.'
    }

    if(Versions._instance) console.error(this.#errors.singleInstanceError);
    else
    {
      Versions._instance = this;
    }
  }
  
  /** Static method to return a new Versions instance. Allows for Singleton+Module pattern. */
  static getInstance() 
  {
    return new Versions();
  }
  
  /** Public method to return the Axios version. */
  get axios()
  {
    return '1.13.2';
  }
  
  /** Public method to return the CodeMirror version. */
  get codeMirror()
  {
    return '5.65.20';
  }
  
  /** Public method to return the EasyTimer version. */
  get easyTimer()
  {
    return '4.6.0';
  }
  
  /** Public method to return the Howler version. */
  get howler()
  {
    return '2.2.4';
  }
  
  /** Public method to return the Highlight version. */
  get highlight()
  {
    return '11.9.0';
  }
 
  /** Public method to return the Highlight version. */
  get onsen()
  {
    return '2.12.8';
  }
  
  /** Public method to return the PapaParse version. */
  get papaParse()
  {
    return '5.0.2';
  }
  
  /** Public method to return the Phaser version. */
  get phaser()
  {
    return '3.9.0';
  }
    
  /** Public method to return the Scriptit-Core version. */
  get scriptitCore()
  {
    return '2.2';
  }
}

///////////////////////////////////////////////////////////

globalThis.versions = Versions.getInstance();

///////////////////////////////////////////////////////////