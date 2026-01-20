///////////////////////////////////////////////////////////

class HomePage extends ui.Page
{
  onInit()
  {    
    this.backgroundColor = 'red';
    setTimeout(() => { this.import(); }, 3000)
  }
  
  import()
  {
    // files.importFile({ subpath: '' })
    // .then(file => 
    // { 
    //   console.log(file);
    //   files.getFolder({ subpath: '' })
    //   .then(folder => 
    //   {      
    //     for(let file of folder.files)
    //     {
    //       console.log(file.name);
    //     }
    //   })
    // })
    // .catch(error => 
    // { 
    //   console.log(error); 
    // })
    
    files.getFolder({ subpath: '' })
      .then(folder => 
      {      
        for(let file of folder.files)
        {
          console.log(file.name);
        }
      })
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////