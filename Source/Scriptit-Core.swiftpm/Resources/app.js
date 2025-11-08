class HomePage extends ui.Page
{
  onInit()
  {    
    this.backgroundColor = 'white';
    this.navigationBarTitle = 'Home';
    this.navigationBarFont = font.library.menlo;
    
    // files.getFolder({ root: files.roots.documents, subpath: '' }).then(folder => 
    // {      
    //   for(let sub of folder.subfolders)
    //   {
    //     console.log(sub.name);
    //   }
    // })
    // .catch(error => {
    //   console.error(error);
    // });
    
    // files.createFolder({ root: files.roots.documents, subpath: '', folderName: 'New' }).then(folder => 
    // {
    //   console.log(folder);
    // })
    // .catch(error => {
    //   console.error(error);
    // });
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////