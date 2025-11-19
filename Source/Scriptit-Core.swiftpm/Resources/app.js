class HomePage extends ui.Page
{
  onInit()
  {    
    this.backgroundColor = 'white';
    this.navigationBarTitle = 'Home';
    this.navigationBarFont = font.library.menlo;
    
    let box = new ui.Checkbox({ checked: false });
    box.inputId = 'save-checkbox';
    box.color = 'red';
    
    let label = new ui.Label();
    label.text = 'Apple';
    label.inputId = 'save-checkbox';
    label.color = 'red';
    
    let item = new ui.ListItem();
    item.tappable = true;
    item.left = box;
    item.center = label;
    
    let list = new ui.List();
    list.addItem({ item: item });
    
    this.addComponents({ components: [ list ] });
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////