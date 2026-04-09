///////////////////////////////////////////////////////////

/** Class representing a Row component. */
class _Row_ extends Component 
{
  #errors;

  /**
   * Creates the row object.
   * @param {object} options - Custom options object to init properties from the constructor.
   */
  constructor(options = {}) 
  {
    super({ tagName: 'ons-row', options });

    this.#errors = 
    {
      columnTypeError: 'Row Error: Expected type column for column when adding to the current row.',
    };
  }

  /**
   * Adds a column to the row.
   * @param {Column} column - An instance of Column.
   */
  addColumn({ column } = {}) 
  {
    if(!typechecker.check({ type: 'column', value: column })) console.error(this.#errors.columnTypeError);
    this.appendChild({ child: column.element });
  }
}

///////////////////////////////////////////////////////////

typechecker.register({ name: 'row', constructor: _Row_ });

///////////////////////////////////////////////////////////
