///////////////////////////////////////////////////////////

class HomePage extends ui.Page
{
  onInit()
  {        
    this.navigationBarTitle = 'Home';
    this.backgroundColor = 'red';
    
    setTimeout(() => { this.filesRequest(); }, 2000);
  }
  
  filesRequest()
  {
    files.importFile({ subpath: '' })
    .then(() => 
    {
      files.getFolder({ subpath: '' })
      .then(folder => 
      {
        console.log(folder.files);
      });
    });
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////