class HomePage extends ui.Page
{
  onInit()
  {    
    this.backgroundColor = 'white';
    this.navigationBarTitle = 'Home';
    this.navigationBarFont = font.library.menlo;
    
    
    //let button = ui.ListTitle();

    
    let ex = new ui.Popover();
    
    //this.addComponents({ components: [ ex ] });
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////