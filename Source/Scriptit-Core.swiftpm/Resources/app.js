class HomePage extends ui.Page
{
  onInit()
  {    
    this.backgroundColor = 'white';
    this.navigationBarTitle = 'Home';
    this.navigationBarFont = font.library.menlo;
    
    // files.deleteFolder({ root: files.roots.documents, subpath: 'Music/' }).then(() => 
    // {      
    //   files.getFolder({ root: files.roots.documents, subpath: '' }).then(folder => 
    //   {      
    //     for(let sub of folder.subfolders)
    //     {
    //       console.log(sub.name);
    //     }
    //   });
    // });
    
    // files.renameFolder({ root: files.roots.documents, subpath: 'Videos/', folderName: 'Pictures' }).then(folder => 
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