class HomePage extends ui.Page
{
  onInit()
  {    
    this.backgroundColor = 'white';
    this.navigationBarTitle = 'Home';
    this.navigationBarFont = font.library.menlo;
    
    setTimeout(() => { hud.loading({ message: 'Please wait...' }); }, 1000);
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////