class HomePage extends ui.Page
{  
  constructor()
  {
    super();
    this.id = 'home';
  }
  
  onInit()
  {     
    let d = new ui.PreviewDevice();
  }
}

app.present({ root: new HomePage() });