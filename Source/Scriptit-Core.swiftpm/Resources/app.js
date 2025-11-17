class HomePage extends ui.Page
{
  onInit()
  {    
    this.backgroundColor = 'white';
    this.navigationBarTitle = 'Home';
    this.navigationBarFont = font.library.menlo;
    
    
    //let button = ui.ListTitle();

    
    let box = new ui.Checkbox({ checked: false });
    box.inputId = 'save-checkbox';
    box.color = 'red';
    
    let item = new ui.ListItem();
    item.left = box;
    
    let list = new ui.List();
    list.addItem({ item: item });
    
    this.addComponents({ components: [ list ] });
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////