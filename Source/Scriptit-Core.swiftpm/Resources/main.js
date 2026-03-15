class HomePage extends ui.Page
{  
  constructor()
  {
    super();
  }
  
  onInit()
  {
    // files.getFolder({ subpath: '' })
    // .then(folder =>
    // {
    //   console.log(folder.subfolders);
    // });
    
    files.zipFolder({ subpath: 'New/', zippedFileName: 'new' })
    .then(file =>
    {
      console.log(file.name);
    });
    
    // files.writeToFile({ subpath: 'next.txt', content: 'New code...', replace: false, newline: true })
    // .then(() =>
    // {
    //   console.log('Successfully wrote to next.txt');
    //   files.readFile({ subpath: 'next.txt' })
    //   .then(content =>
    //   {
    //     console.log(content);
    //   });
    // });
  }
}

app.present({ root: new HomePage() });