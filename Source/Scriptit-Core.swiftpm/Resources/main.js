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
    
    console.log(versions.axios);
    console.log(versions.scriptitCore);
    
    console.toggle();
  }
}

app.present({ root: new HomePage() });