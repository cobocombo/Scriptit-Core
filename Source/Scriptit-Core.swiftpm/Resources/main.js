class HomePage extends ui.Page
{  
  constructor()
  {
    super();
  }
  
  onInit()
  {
    files.deleteFolder({ subpath: 'Scriptit/Resources/' });
  }
}

app.present({ root: new HomePage() });