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
    // files.getFolder({ subpath: '' })
    // .then(folder => 
    // {
    //   console.log('Folders:');
    //   for(let sub of folder.subfolders)
    //   {
    //     console.log(sub.name);
    //   }
    //   console.log('Files:');
    //   for(let file of folder.files)
    //   {
    //     console.log(file.name);
    //   }
    // });
    
    // files.deleteFile({ subpath: 'project.zip' })
    // .then(() => 
    // {
    //   files.getFolder({ subpath: '' })
    //   .then(folder => 
    //   {
    //     console.log('Folders:');
    //     for(let sub of folder.subfolders)
    //     {
    //       console.log(sub.name);
    //     }
    //     console.log('Files:');
    //     for(let file of folder.files)
    //     {
    //       console.log(file.name);
    //     }
    //   });
    // });
    
    // files.createFolder({ folderName: 'Project' })
    // .then(folder => 
    // {
    //   console.log(folder);
    // });
    
    files.zipFolder({ subpath: 'Project/', zippedFileName: 'project' })
    .then(file => { console.log(file); });
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////