class HomePage extends ui.Page
{  
  constructor()
  {
    super();
    this.id = 'home';
  }
  
  onInit()
  {     
    console.log('This is a log.');
    console.warn('This is a warning.');
    console.error('This is an error.');
    console.debug('This is a debug statement.');
    
    consoleManager.writeToTempFile = false;
    
    setTimeout(() => { this.printConsoleFile(); }, 3000);
  }
  
  printConsoleFile()
  {
    files.readFile({ root: files.roots.temporary, subpath: 'console.txt' })
    .then(content => 
    {
      console.log(content);
    })
  }
}

consoleManager.writeToTempFile = true;

files.getFile({ root: files.roots.temporary, subpath: 'console.txt' })
.then(file => 
{
  app.present({ root: new HomePage() });
})
.catch(error => 
{
  files.createFile({ root: files.roots.temporary, fileName: 'console.txt' });
  app.present({ root: new HomePage() });
});


