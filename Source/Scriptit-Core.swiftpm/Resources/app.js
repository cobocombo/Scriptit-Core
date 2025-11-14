class HomePage extends ui.Page
{
  onInit()
  {    
    this.backgroundColor = 'white';
    this.navigationBarTitle = 'Home';
    this.navigationBarFont = font.library.menlo;
    
    let divider = new ui.Divider({ height: '1px' });
    divider.style.marginLeft = '10px';
    divider.style.marginRight = '10px';
    
    this.addComponents({ components: [ divider ] });
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////