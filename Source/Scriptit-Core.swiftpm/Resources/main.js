class HomePage extends ui.Page
{  
  constructor()
  {
    super();
    this.id = 'home';
  }
  
  onInit()
  {     
    
  }
}

console.log(Papa);
app.present({ root: new HomePage() });