///////////////////////////////////////////////////////////

class HomePage extends ui.Page
{
  onInit()
  {        
    this.navigationBarTitle = 'Home';
    this.onNavigationBarTitleTap = () => { console.log(this.navigationBarTitle); }
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////