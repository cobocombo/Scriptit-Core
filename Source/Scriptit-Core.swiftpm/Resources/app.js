///////////////////////////////////////////////////////////

class HomePage extends ui.Page
{
  onInit()
  {    
    this.backgroundColor = 'red';
    setTimeout(() => { this.import(); }, 3000)
    console.log('Debug...')
  }
  
  import()
  {
    // files.importFile({ subpath: '', fileExtensions: ['.js'] })
    // .then(file => 
    // { 
    //   console.log(file);
    //   files.getFolder({ subpath: '' })
    //   .then(folder => 
    //   {      
    //     for(let file of folder.files) { console.log(file.name); }
    //   })
    // })
    // .catch(error => 
    // { 
    //   console.log(error); 
    // })
    
    // files.moveFolder({ oldSubpath: 'Games/', newSubpath: 'Apps/' })
    // .then(folder => 
    // { 
    //   console.log(folder);
    // });
    
    files.getFolder({ subpath: '' })
      .then(folder => 
      {      
        for(let sub of folder.subfolders) { console.log(sub.name); }
      })
    
    // files.createFolder({ folderName: 'Bugs' })
    // .then(folder => 
    // { 
    //   console.log(folder);
    //   files.getFolder({ subpath: '' })
    //   .then(folder => 
    //   {      
    //     for(let sub of folder.subfolders) { console.log(sub.name); }
    //   })
    // });
    
    // files.deleteFolder({ subpath: 'Bugs' })
    // .then(() => 
    // { 
    //   console.log('Folder deleted!');
    //   files.getFolder({ subpath: '' })
    //   .then(folder => 
    //   {      
    //     for(let sub of folder.subfolders) { console.log(sub.name); }
    //   })
    // });
    
    
    // files.writeToFile({ subpath: 'new.txt', content: 'New line...', replace: false, newline: true })
    // .then(() => 
    // {      
    //   files.readFile({ subpath: 'new.txt' }).then(content => { console.log(content); });
    // });
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////