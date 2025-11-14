class HomePage extends ui.Page
{
  onInit()
  {    
    this.backgroundColor = 'white';
    this.navigationBarTitle = 'Home';
    this.navigationBarFont = font.library.menlo;
    
    let divider = new ui.Divider();
    divider.color = 'red';
    divider.height = '3px';
    divider.marginLeft = '20px';
    divider.marginRight = '20px';
    
    this.addComponents({ components: [ divider ] });
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////