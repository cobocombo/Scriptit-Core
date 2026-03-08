class HomePage extends ui.Page
{
  textFiles;
  
  constructor()
  {
    super();
    this.textFiles = [];
  }
  
  onInit()
  {
    files.getFolder({ subpath: '' })
    .then(folder =>
    {
      console.log(folder);
      //this.textFiles = folder.files;
    });
    
    // setTimeout(() => 
    // {
    //   for(let file of this.textFiles)
    //   {
    //     files.readFile({ subpath: file.relativePath })
    //     .then(content => 
    //     {
    //       console.log(content);
    //     })
    //     .catch(() => { console.log('Error'); })
    //   }
    // }, 3000);
  }
}

app.present({ root: new HomePage() });