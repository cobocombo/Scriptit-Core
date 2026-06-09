///////////////////////////////////////////////////////////
// SCROLL MODULE
///////////////////////////////////////////////////////////

/** Singleton class representing scroll locking behavior. */
class ScrollManager
{
  #errors;
  #locked = false;
  #preventHandler;

  static #instance = null;

  /** Creates the scroll object. */
  constructor()
  {
    this.#errors =
    {
      singleInstanceError: 'Scroll Manager Error: Only one ScrollManager object can exist at a time.'
    };

    if(ScrollManager.#instance)
    {
      console.error(this.#errors.singleInstanceError);
      return;
    }

    ScrollManager.#instance = this;

    // Bind once so removeEventListener works correctly
    this.#preventHandler = (e) =>
    {
      if(this.#locked) e.preventDefault();
    };
  }

  /** Static method to return a new ScrollManager instance. */
  static getInstance()
  {
    return new ScrollManager();
  }

  /** Lock document scrolling (touch + wheel). */
  lock()
  {
    if(this.#locked) return;

    this.#locked = true;

    document.addEventListener('touchmove', this.#preventHandler, { passive: false });
    document.addEventListener('wheel', this.#preventHandler, { passive: false });
  }

  /** Unlock document scrolling. */
  unlock()
  {
    if(!this.#locked) return;

    this.#locked = false;

    document.removeEventListener('touchmove', this.#preventHandler);
    document.removeEventListener('wheel', this.#preventHandler);
  }
}

//////////////////////////////////////////////////

/** Global scroll module */
globalThis.scroll = ScrollManager.getInstance();

//////////////////////////////////////////////////