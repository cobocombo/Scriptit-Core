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
    
    let addButton = new ui.BarButton({ icon: 'fa-apple' });
    this.toolbarButtonsLeft = [ addButton ];
  }
}

app.present({ root: new HomePage() });