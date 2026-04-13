///////////////////////////////////////////////////////////
// DEVICE MODULE
///////////////////////////////////////////////////////////

/** Singleton class representing the main DeviceManager object. */
class DeviceManager
{
  #errors;
  #batteryLevel;
  #batteryState;
  #interfaceStyle;
  #systemName;
  #systemVersion;
  static #instance = null;

  /** Creates the device object. **/
  constructor() 
  {
    this.#errors = 
    {
      singleInstanceError: 'Device Manager Error: Only one DeviceManager object can exist at a time.',
    };

    if(DeviceManager.#instance) console.error(this.#errors.singleInstanceError);
    else DeviceManager.#instance = this;

    this.update();
    setInterval(() => this.update(), 15000); // every 15 seconds.
  }

  /** Static method to return a new DeviceManager instance. Allows for Singleton+Module pattern. */
  static getInstance() 
  {
    return new DeviceManager();
  }

  /** 
   * Get property to return the latest stored battery level.
   * @return {string} The latest stored battery level.
   */
  get batteryLevel()
  {
    return this.#batteryLevel;
  }

  /** 
   * Get property to return the latest stored battery state.
   * @return {string} The latest stored battery state.
   */
  get batteryState()
  {
    return this.#batteryState;
  }

  /** 
   * Get property to return the current orientation.
   * @return {string} The current orientation. Returns either portrait or landscape.
   */
  get currentOrientation()
  {
    if(this.isPortrait === true) return 'portrait';
    else return 'landscape';
  }

  /** 
   * Get property to return the current interface style.
   * @return {string} The current interface style. Returns either light or dark.
   */
  get interfaceStyle()
  {
    return this.#interfaceStyle;
  }

  /** 
   * Get property to return if the current device is an iPad or not.
   * @return {boolean} Value informing the user if current device is an iPad or not.
   */
  get isIpad()
  {
    return ons.platform.isIPad();
  }

  /** 
   * Get property to return if the current device is an iPhone or not.
   * @return {boolean} Value informing the user if current device is an iPhone or not.
   */
  get isIphone()
  {
    return ons.platform.isIPhone();
  }

  /** 
   * Get property to return if the current device is in landscape orientation or not.
   * @return {boolean} Value informing the user if current device is in landscape orientation or not.
   */
  get isLandscape()
  {
    return ons.orientation.isLandscape();
  }

  /** 
   * Get property to return if the current device is in portrait orientation or not.
   * @return {boolean} Value informing the user if current device is in portrait orientation or not.
   */
  get isPortrait()
  {
    return ons.orientation.isPortrait();
  }

  /** 
   * Get property to return the device's screen height.
   * @return {number} The device's screen height.
   */
  get screenHeight()
  {
    if(this.isPortrait === true) return window.innerHeight;
    else return window.innerWidth;
  }

  /** 
   * Get property to return the device's screen width.
   * @return {number} The device's screen width.
   */
  get screenWidth()
  {
    if(this.isPortrait === true) return window.innerWidth;
    else return window.innerHeight;
  }

  /** 
   * Get property to return the device's system name.
   * @return {string} The device's system name.
   */
  get systemName()
  {
    return this.#systemName;
  }

  /** 
   * Get property to return the device's system version.
   * @return {string} The device's system version.
   */
  get systemVersion()
  {
    return this.#systemVersion;
  }

  /** 
  * Public method called by iOS to populate device info. 
  * @param {object} data - The populated device info within a json object.
  */
  receive(data) 
  {
    this.#batteryLevel = data.batteryLevel;
    this.#batteryState = data.batteryState;
    this.#interfaceStyle = data.interfaceStyle;
    this.#systemName = data.systemName;
    this.#systemVersion = data.systemVersion;
  }

  /** Public method called by every 30 seconds to retrieve the latest device information in the background. */
  update() 
  { 
    window.webkit?.messageHandlers?.deviceMessageManager?.postMessage(null);
  }
}

///////////////////////////////////////////////////////////

globalThis.device = DeviceManager.getInstance();

///////////////////////////////////////////////////////////