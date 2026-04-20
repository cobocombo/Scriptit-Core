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
    
    setTimeout(() => { console.toggle(); }, 3000);
    setTimeout(() => { console.log("This is a log"); }, 5000);
    setTimeout(() => { console.error("This is an error"); }, 6000);
    setTimeout(() => { console.debug("This is a debug statement"); }, 8000);
    setTimeout(() => { console.warn("This is a warning"); }, 10000);
    setTimeout(() => { console.clear(); }, 12000);
  }
}

app.present({ root: new HomePage() });