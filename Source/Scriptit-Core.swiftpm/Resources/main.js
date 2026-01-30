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
    files.createFile({ fileName: 'up.txt' })
    .then(file => 
    {
      files.copyFile({ oldSubpath: 'up.txt', copiedFileName: 'up.js' })
      .then(file => 
      {
        console.log(file.name);
      });
    });
    // files.getFolder({ subpath: '' })
    // .then(folder => 
    // {
    //   for(let file of folder.files) { console.log(file.name); }
    // });
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////