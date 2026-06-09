///////////////////////////////////////////////////////////

/** Class representing the PhaserGame component. */
class _PhaserGame_ extends Component 
{
  #game;

  /**
   * Creates the PhaserGame object.
   * @param {object} gameConfig - Custom phaser game options to init properties for the internal Phaser.Game object.
   * @param {object} options - Custom options object to init properties from the constructor for the component itself.
   */
  constructor({ config = {}, ...options } = {}) 
  {
    super({ tagName: 'div', options: options });

    this.width = '100%';
    this.height = '100%';
    this.style.position = 'relative';
    if(!config.width) config.width = '100%';
    if(!config.height) config.height = '100%';

    this.#game = new Phaser.Game({ type: Phaser.CANVAS, parent: this.element, ...config });
  }

  /** 
   * Get property to return the game object created internally.
   * @return {Phaser.Game} The game object created internally.
   */
  get game()
  {
    return this.#game;
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'phaser-game', constructor: _PhaserGame_ });

///////////////////////////////////////////////////////////