class HomePage extends ui.Page
{
  onInit()
  {    
    this.backgroundColor = 'red';
    
    let list = new ui.List();
    list.addItemAtIndex({ index: 1, item: new ui.ListHeader({ text: 'Head'}) });
    
    this.addComponents({ components: [ list ] });
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////