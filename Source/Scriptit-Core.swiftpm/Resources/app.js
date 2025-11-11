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
    
    // files.deleteFile({ subpath: 'log.txt' }).then(() => 
    // {      
    //   files.getFolder({ subpath: '' }).then(folder => 
    //   {      
    //     for(let file of folder.files)
    //     {
    //       console.log(file.name);
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
    //   for(let sub of folder.subfolders)
    //   {
    //     console.log(sub.name);
    //   }
    //   for(let file of folder.files)
    //   {
    //     console.log(file.name);
    //   }
    // });
    
    files.writeToFile({ subpath: 'settings.txt', content: 'Replaced text', replace: true }).then(() => 
    {      
      console.log('File written to...');
    });
    
    // files.getFile({ subpath: 'input.txt' }).then(file => 
    // {      
    //   console.log(file);
    // });
    
    // files.moveFile({ oldSubpath: 'input.txt', newSubpath: 'Apps/' }).then(file => 
    // {      
    //   console.log(file);
    // });
    
    // files.renameFolder({ subpath: 'Photos/', folderName: 'Videos' }).then(folder => 
    // {
    //   console.log(folder);
    // })
    // .catch(error => {
    //   console.error(error);
    // });
    
    // files.renameFile({ subpath: 'user.trz.txt', fileName: 'log.txt' }).then(file => 
    // {
    //   console.log(file);
    // })
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////