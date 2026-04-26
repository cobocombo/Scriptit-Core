///////////////////////////////////////////////////////////
// UI MODULE
///////////////////////////////////////////////////////////

/** Singleton class representing the main ui object. */
class UserInterface 
{
  #errors;
  static #instance = null;
  #registry;

  /** Creates the ui object. **/
  constructor() 
  {
    this.#errors = 
    {
      singleInstanceError: 'User Interface Error: Only one UserInterface object can exist at a time.',
      componentNameTypeError: 'User Interface Error: Expected type string for name.',
      componentConstructorTypeError: 'User Interface Error: Expected type function for constructor.'
    };

    if(UserInterface.#instance) console.error(this.#errors.singleInstanceError);
    else
    {
      UserInterface.#instance = this;
      this.#registry = new Map();
    }  
  }

  /** Static method to return a new UserInterface instance. Allows for Singleton+Module pattern. */
  static getInstance() 
  {
    return new UserInterface();
  }
    
  /** Get property to return a new instance of ActionSheet. */
  get ActionSheet() 
  {
    return _ActionSheet_;
  }
  
  /** Get property to return a new instance of ActionSheetButton. */
  get ActionSheetButton() 
  {
    return _ActionSheetButton_;
  }
  
  /** Get property to return a new instance of AlertDialog. */
  get AlertDialog() 
  {
    return _AlertDialog_;
  }
  
  /** Get property to return a new instance of AlertDialogButton. */
  get AlertDialogButton() 
  {
    return _AlertDialogButton_;
  }
  
  /** Get property to return a new instance of BackBarButton. */
  get BackBarButton() 
  {
    return _BackBarButton_;
  }
  
  /** Get property to return a new instance of BarButton. */
  get BarButton() 
  {
    return _BarButton_;
  }
  
  /** Get property to return a new instance of Button. */
  get Button() 
  {
    return _Button_;
  }
  
  /** Get property to return a new instance of Card. */
  get Card() 
  {
    return _Card_;
  }
  
  /** Get property to return a new instance of Checkbox. */
  get Checkbox() 
  {
    return _Checkbox_;
  }
  
  /** Get property to return a new instance of CircularProgress. */
  get CircularProgress() 
  {
    return _CircularProgress_;
  }
  
  /** Get property to return a new instance of Codeblock. */
  get Codeblock() 
  {
    return _Codeblock_;
  }
  
  /** Get property to return a new instance of CodeEditor. */
  get CodeEditor() 
  {
    return _CodeEditor_;
  }
  
  /** Get property to return a new instance of ColorPicker. */
  get ColorPicker() 
  {
    return _ColorPicker_;
  }
  
  /** Get property to return a new instance of Column. */
  get Column() 
  {
    return _Column_;
  }
  
  /** Get property to return a new instance of Dialog. */
  get Dialog() 
  {
    return _Dialog_;
  }
  
  /** Get property to return a new instance of Divider. */
  get Divider() 
  {
    return _Divider_;
  }
  
  /** Get property to return a new instance of FabButton. */
  get FabButton() 
  {
    return _FabButton_;
  }
  
  /** Get property to return a new instance of Icon. */
  get Icon() 
  {
    return _Icon_;
  }
  
  /** Get property to return a new instance of Img. */
  get Img() 
  {
    return _Img_;
  }
  
  /** Get property to return a new instance of Inspector. */
  get Inspector() 
  {
    return _Inspector_;
  }
  
  /** Get property to return a new instance of Label. */
  get Label() 
  {
    return _Label_;
  }
  
  /** Get property to return a new instance of Link. */
  get Link() 
  {
    return _Link_;
  }
  
  /** Get property to return a new instance of List. */
  get List() 
  {
    return _List_;
  }
  
  /** Get property to return a new instance of ListHeader. */
  get ListHeader() 
  {
    return _ListHeader_;
  }
  
  /** Get property to return a new instance of ListItem. */
  get ListItem() 
  {
    return _ListItem_;
  }
  
  /** Get property to return a new instance of ListTitle. */
  get ListTitle() 
  {
    return _ListTitle_;
  }
  
  /** Get property to return a new instance of Modal. */
  get Modal() 
  {
    return _Modal_;
  }
  
  /** Get property to return a new instance of Navigator. */
  get Navigator() 
  {
    return _Navigator_;
  }
  
  /** Get property to return a new instance of OrderedList. */
  get OrderedList() 
  {
    return _OrderedList_;
  }
  
  /** Get property to return a new instance of Page. */
  get Page() 
  {
    return _Page_;
  }
  
  /** Get property to return a new instance of PhaserGame. */
  get PhaserGame() 
  {
    return _PhaserGame_;
  }
  
  /** Get property to return a new instance of Popover. */
  get Popover() 
  {
    return _Popover_;
  }
  
  /** Get property to return a new instance of PreviewDevice. */
  get PreviewDevice() 
  {
    return _PreviewDevice_;
  }
  
  /** Get property to return a new instance of ProgressBar. */
  get ProgressBar() 
  {
    return _ProgressBar_;
  }
  
  /** Get property to return a new instance of Rectangle. */
  get Rectangle() 
  {
    return _Rectangle_;
  }
  
  /** Get property to return a new instance of Row. */
  get Row() 
  {
    return _Row_;
  }
  
  /** Get property to return a new instance of Searchbar. */
  get Searchbar() 
  {
    return _Searchbar_;
  }
  
  /** Get property to return a new instance of SegmentedControl. */
  get SegmentedControl() 
  {
    return _SegmentedControl_;
  }
  
  /** Get property to return a new instance of Selector. */
  get Selector() 
  {
    return _Selector_;
  }
  
  /** Get property to return a new instance of Slider. */
  get Slider() 
  {
    return _Slider_;
  }
  
  /** Get property to return a new instance of Splitter. */
  get Splitter() 
  {
    return _Splitter_;
  }
  
  /** Get property to return a new instance of SplitterMenu. */
  get SplitterMenu() 
  {
    return _SplitterMenu_;
  }
  
  /** Get property to return a new instance of Switch. */
  get Switch() 
  {
    return _Switch_;
  }
  
  /** Get property to return a new instance of Tab. */
  get Tab() 
  {
    return _Tab_;
  }
  
  /** Get property to return a new instance of Tabbar. */
  get Tabbar() 
  {
    return _Tabbar_;
  }
  
  /** Get property to return a new instance of Text. */
  get Text() 
  {
    return _Text_;
  }
  
  /** Get property to return a new instance of Textarea. */
  get Textarea() 
  {
    return _Textarea_;
  }
  
  /** Get property to return a new instance of Textfield. */
  get Textfield() 
  {
    return _Textfield_;
  }
  
  /** Get property to return a new instance of Toast. */
  get Toast() 
  {
    return _Toast_;
  }
  
  /** Get property to return a new instance of UnorderedList. */
  get UnorderedList() 
  {
    return _UnorderedList_;
  }
  
  /** 
   * Public method to register a new ui class. 
   * @param {array} name - The name to reference the class with.
   * @param {Multiple} constructor - The class constructor to reference.
   */
  register({ name, constructor } = {}) 
  {
    if(!typechecker.check({ type: 'string', value: name })) console.error(this.#errors.componentNameTypeError);
    if(!typechecker.check({ type: 'function', value: constructor })) console.error(this.#errors.componentConstructorTypeError);
    this.#registry.set(name, constructor);
    this[name] = constructor;
  }
}

///////////////////////////////////////////////////////////

globalThis.ui = UserInterface.getInstance();
ui.register({ name: 'Component', constructor: Component });

///////////////////////////////////////////////////////////