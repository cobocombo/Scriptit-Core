class HomePage extends ui.Page
{  
  constructor()
  {
    super();
  }
  
  onInit()
  {
    files.importFile({ subpath: '' })
    .then(file => 
    {
      console.log(file.name);
    })
  }
}

app.present({ root: new HomePage() });