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
    // files.createFolder({ folderName: 'Nope' })
    // .then(folder => 
    // {
    //   files.copyFolder({ oldSubpath: 'Nope/', copiedFolderName: 'Maybe' })
    //   .then(folder => 
    //   {
    //     console.log(folder.name);
    //   });
    // });
    
    files.getFolder({ subpath: '' })
    .then(folder => 
    {
      for(let fol of folder.subfolders) { console.log(fol.name); }
    });
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////