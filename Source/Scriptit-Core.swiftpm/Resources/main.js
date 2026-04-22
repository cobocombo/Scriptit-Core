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
    
    console.font = console.fonts.courier;
    console.fontSize = 15;
    
    let consoleButton = new ui.BarButton({ icon: 'ion-ios-hammer' });
    consoleButton.onTap = () => 
    { 
      console.fullscreen();
      setTimeout(() => { console.log("Hello World"); }, 3000);
    }
    this.toolbarButtonsRight = [ consoleButton ];
  }
}

app.present({ root: new HomePage() });