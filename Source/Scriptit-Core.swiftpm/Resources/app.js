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
    
    // files.createFile({ subpath: '', fileName: 'user.trz' }).then(file => 
    // {      
    //   console.log(file);
    // });
    
    // files.getFolder({ subpath: '' }).then(folder => 
    // {      
    //   for(let file of folder.files)
    //   {
    //     console.log(file.name);
    //   }
    // });
    
    // files.getFile({ subpath: 'input.txt' }).then(file => 
    // {      
    //   console.log(file);
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