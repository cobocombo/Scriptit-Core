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

console.log(axios.VERSION);
app.present({ root: new HomePage() });