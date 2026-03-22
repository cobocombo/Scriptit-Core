class HomePage extends ui.Page
{  
  constructor()
  {
    super();
  }
  
  onInit()
  {
    console.log('New Log');
    console.error('New Error');
    console.debug('New Debug');
    console.warn('New Warning');
    
    setTimeout(() => { console.log(consoleManager.history) }, 3000);
  }
}

app.present({ root: new HomePage() });