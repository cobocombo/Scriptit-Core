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
    
    // files.createFolder({ subpath: '', folderName: 'Apps' }).then(folder => 
    // {      
    //   console.log(folder.name);
    // });
    
    // files.getFolder({ subpath: 'Apps/' }).then(folder => 
    // {      
    //   for(let sub of folder.subfolders)
    //   {
    //     console.log(sub.name);
    //   }
    // });
    
    // files.moveFolder({ oldSubpath: 'Scriptit/', newSubpath: 'Apps/' }).then(folder => 
    // {      
    //   console.log(folder);
    // });
    
    // files.renameFolder({ oldSubpath: 'Videos/', folderName: 'Pictures' }).then(folder => 
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