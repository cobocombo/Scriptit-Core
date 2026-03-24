class HomePage extends ui.Page
{  
  constructor()
  {
    super();
  }
  
  onInit()
  {
    // files.deleteFile({ subpath: 'trash.js' });
    // files.deleteFile({ subpath: 'trash(copy).js' });
    files.copyFile({ oldRoot: files.roots.bundle, oldSubpath: 'trash.js', copiedFileName: 'trash.js' })
    .then(file => 
    {
      console.log(file);
      files.readFile({ subpath: file.relativePath })
      .then(content => 
      {
        console.log(content);
      });
    });
  }
}

app.present({ root: new HomePage() });