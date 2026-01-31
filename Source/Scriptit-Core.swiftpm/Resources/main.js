///////////////////////////////////////////////////////////

class HomePage extends ui.Page
{
  onInit()
  {        
    this.navigationBarTitle = 'Home';
    this.backgroundColor = 'red';
    
    setTimeout(() => { this.hudRequest(); }, 2000);
  }
  
  hudRequest()
  {    
    hud.loading({ message: 'Please Wait...' }); 
    setTimeout(() => { hud.dismiss(); }, 5000);
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////