///////////////////////////////////////////////////////////

/** Class representing the list component. */
class _List_ extends Component 
{
  #errors;
  #inset;

  /**
   * Creates the list object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'ons-list', options: options });

    this.#errors = 
    {
      indexOutOfBoundsError: 'List Error: Index provided was out of bounds of the list.',
      indexTypeError: 'List Error: Expected type number for index.',
      insetTypeError: 'List Error: Expected type boolean for inset.',
      itemTypeError: 'List Error: Expected one of the following types for an item in the list: ListItem, ListTitle or ListHeader.',
      itemsTypeError: 'List Error: Expected type array for items.'
    }

    if(options.items) this.items = options.items;
    this.inset = options.inset || false;
  }

  /** 
   * Get property to return if the list is currently being rendered as an inset list.
   * @return {boolean} The list's current inset list value.
   */
  get inset() 
  { 
    return this.#inset; 
  }

  /** 
   * Set property to change the way the list is being rendered as inset.
   * @param {boolean} value - The list's inset list value.
   */
  set inset(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value })) 
    {
      console.error(this.#errors.insetTypeError);
      return;
    }
    if(value == true) this.addModifier({ modifier: 'inset' });
    else this.removeModifier({ modifier: 'inset' });
    this.#inset = value;
  }

  /** 
   * Get property to return the list's current items.
   * @return {array} The list's current items.
   */
  get items() 
  { 
    return this.element.children; 
  }

  /** 
   * Set property to change the current list of items in the list.
   * @param {array} value - List of items to be added to the list. Clears the current list of items before adding the new items.
   */
  set items(value)
  {
    this.removeAllItems();
    this.addItems({ items: value });
  }

  /** 
   * Public method to add a single item to the list.
   * @param {Component} item - Item to be added to the list. Must be of type ListItem, ListTitle or ListHeader.
   */
  addItem({ item } = {}) 
  { 
    if(!typechecker.checkMultiple({ types: [ 'list-item', 'list-title', 'list-header' ], value: item })) 
    {
      console.error(this.#errors.itemTypeError);
      return;
    }
    this.appendChild({ child: item });
  }

  /** 
   * Public method to add multiple items to the list at a time.
   * @param {array} items - Array of items to be added to the list. Items must be of type ListItem, ListTitle or ListHeader.
   */
  addItems({ items } = {}) 
  {
    if(!typechecker.check({ type: 'array', value: items })) 
    {
      console.error(this.#errors.itemsTypeError);
      return;
    }
    items.forEach(item => { this.addItem({ item: item }) });
  }
  
  /**
   * Public method to add a single item into the list at a specific index.
   * @param {number} index - Index at which to insert the item.
   * @param {Component} item - Item to be inserted. Must be ListItem, ListTitle or ListHeader.
   */
  addItemAtIndex({ index, item } = {}) 
  {
    if(!typechecker.check({ type: 'number', value: index })) 
    {
      console.error(this.#errors.indexTypeError);
      return;
    }
    
    if(!typechecker.checkMultiple({ types: [ 'list-item', 'list-title', 'list-header' ], value: item }))
    {
      console.error(this.#errors.itemTypeError);
      return;
    }
  
    let length = this.element.children.length;
    if(index < 0 || index > length) 
    {
      console.error(this.#errors.indexOutOfBoundsError);
      return;
    }
    
    if(index === length) 
    {
      this.appendChild({ child: item });
      return;
    }
  
    let beforeNode = this.element.children[index];
    this.element.insertBefore(item.element, beforeNode);
  }

  /** 
   * Public method to remove an item from the list from a specific index.
   * @param {number} index - Desired index of the item to be removed in the list. List index starts at 0.
   */
  removeItem({ index } = {}) 
  {
    if(!typechecker.check({ type: 'number', value: value })) 
    {
      console.error(this.#errors.indexTypeError);
      return;
    }
    if(index < 0 || index >= this.element.children.length) 
    {
      console.error(this.#errors.indexOutOfBoundsError);
      return;
    }
    this.element.children[index].remove();
  }

  /** Public method to remove all items from the list. */
  removeAllItems()
  {
    this.element.innerHTML = '';
  }

  /** Public method to remove the last or bottom item in the list. */
  removeBottomItem() 
  { 
    if(this.element.children.length > 0) this.element.children[this.element.children.length - 1].remove(); 
  }

  /** Public method to remove the first or top item in the list. */
  removeTopItem()
  { 
    if(this.element.children.length > 0) this.element.children[0].remove(); 
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'list', constructor: _List_ }); 

///////////////////////////////////////////////////////////
