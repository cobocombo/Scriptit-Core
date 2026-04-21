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
    
    let consoleButton = new ui.BarButton({ icon: 'ion-ios-hammer' });
    consoleButton.onTap = () => 
    { 
      console.fullscreen();
      setTimeout(() => { this.stress(); }, 3000);
    }
    this.toolbarButtonsRight = [ consoleButton ];
  }
  
  stress()
  {
    for (let i = 1; i <= 105; i++) 
    {
      console.log(i);
    }
  }
}

app.present({ root: new HomePage() });