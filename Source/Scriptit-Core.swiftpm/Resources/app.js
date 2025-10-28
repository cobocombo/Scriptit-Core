class HomePage extends ui.Page
{
  onInit()
  {    
    this.backgroundColor = 'red';
  }
}

class SettingsPage extends ui.Page
{
  onInit()
  {    
    this.backgroundColor = 'blue';
  }
}

class MorePage extends ui.Page
{
  onInit()
  {    
    this.backgroundColor = 'orange';
  }
}

let leftMenu = new ui.SplitterMenu({ width: '300px' });
leftMenu.mode = 'split';
leftMenu.root = new HomePage();

let splitter = new ui.Splitter();
splitter.leftMenu = leftMenu;

app.present({ root: splitter });

///////////////////////////////////////////////////////////