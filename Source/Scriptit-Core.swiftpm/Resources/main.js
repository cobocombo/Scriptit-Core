class HomePage extends ui.Page
{  
  constructor()
  {
    super();
    this.id = 'home';
  }
  
  onInit()
  {     
    this.navigationBarTitle = 'Home';
    this.backgroundColor = 'red';
    
    setTimeout(() => { consoleManager.toggle(); }, 5000)
  }
}

app.present({ root: new HomePage() });