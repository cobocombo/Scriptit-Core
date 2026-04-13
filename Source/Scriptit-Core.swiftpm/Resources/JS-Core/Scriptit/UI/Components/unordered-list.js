
///////////////////////////////////////////////////////////

/** Class representing the unordered list component. */
class _UnorderedList_ extends Component
{
  #errors;
  #indent;
  #type;
  #types;
  
  constructor(options = {})
  {
    super({ tagName: 'ul', options: options });
    
    this.#errors = 
    {
      invalidTypeError: (type) => `Unordered List Error: Invalid type for ordered list: ${type}.`,
      itemTypeError: 'Unordered List Error: Expected type for item. Use String, Link, OrderedList or Unorderedlist for item.',
      itemsTypeError: 'Unordered List Error: Expected type array for items.',
      indentTypeError: 'Unordered List Error: Expected type number for indent.',
      indexOutOfBoundsError: 'Unordered List Error: Index provided was out of bounds of the list.',
      indexTypeError: 'Unordered List Error: Expected type number for index.',
      typeTypeError: 'Unordered List Error: Expected type string for type. See types for all available types.'
    };
    
    this.#types = 
    {
      disc: 'disc',
      circle: 'circle',
      square: 'square',
      none: 'none'
    };
    
    this.type = options.type ?? this.types.disc;
    this.indent = options.indent ?? 16;
  }
  
  /** 
   * Get property to return the list's indent value.
   * @return {Number} The list's indent value.
   */
  get indent()
  {
    return this.#indent;
  }
  
  /** 
   * Set property to set the list's indent value for nested lists.
   * @param {Number} The list's indent value.
   */
  set indent(value)
  {
    if(!typechecker.check({ type: 'number', value: value })) 
    {
      console.error(this.#errors.indentTypeError);
      return;
    }
    
    this.#indent = value;
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
   * Get property to return the list type.
   * @return {String} The list type.
   */
  get type()
  {
    return this.#type;
  }
  
  /** 
   * Set property to set the list type.
   * @param {String} The list type. See types for all available types.
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
    
    this.style.listStyleType = value;
    this.#type = value;
  }
  
  /** 
   * Get property to return the list types.
   * @return {Object} The list types.
   */
  get types()
  {
    return this.#types;
  }
  
  /** 
   * Public method to add an item to the ordered list.
   * @param {Multiple} item - Item to be added to the bottom of the ordered list. Items must be of type String, OrderedList, or UnorderedList.
   */
  addItem({ item })
  {
    if(!typechecker.checkMultiple({ types: ['string', 'link', 'ordered-list', 'unordered-list'], value: item }))
    {
      console.error(this.#errors.itemTypeError);
      return;
    }
    
    if(typechecker.check({ type: 'string', value: item }))
    {
      let listItem = document.createElement('li');
      listItem.textContent = item;
      this.element.appendChild(listItem);
    }
    else if(typechecker.check({ type: 'link', value: item }))
    {
      let listItem = document.createElement('li');
      listItem.appendChild(item.element);
      this.element.appendChild(listItem);
    }
    else 
    { 
      item.style.paddingLeft = this.#indent.toString() + 'px';
      this.appendChild({ child: item }); 
    }
  }
  
  /** 
   * Public method to add multiple items to the ordered list at a time.
   * @param {array} items - Array of items to be added to the list. Items must be of type String, Link, OrderedList, or UnorderedList.
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
   * @param {Component} item - Item to be inserted. Must be String, link OrderedList, or UnorderedList.
   */
  addItemAtIndex({ item, index })
  {
    if(!typechecker.check({ type: 'number', value: index })) 
    {
      console.error(this.#errors.indexTypeError);
      return;
    }
    
    if(!typechecker.checkMultiple({ types: ['string', 'link', 'ordered-list', 'unordered-list'], value: item })) 
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
      this.addItem({ child: item });
      return;
    }
    
    if(typechecker.check({ type: 'string', value: item }))
    {
      let listItem = document.createElement('li');
      listItem.textContent = item;
      let beforeNode = this.element.children[index];
      this.element.insertBefore(listItem, beforeNode);
    }
    else if(typechecker.check({ type: 'link', value: item }))
    {
      let listItem = document.createElement('li');
      listItem.appendChild(item.element);
      let beforeNode = this.element.children[index];
      this.element.insertBefore(item, beforeNode);
    }
    else 
    { 
      item.style.paddingLeft = this.#indent.toString() + 'px';
      let beforeNode = this.element.children[index];
      this.element.insertBefore(item.element, beforeNode); 
    }
  }
  
  /** Public method to remove all the items in the list. */
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

typechecker.register({ name: 'unordered-list', constructor: _UnorderedList_ });

///////////////////////////////////////////////////////////