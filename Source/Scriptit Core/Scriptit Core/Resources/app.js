///////////////////////////////////////////////////////////

class HomePage extends ui.Page
{
  onInit()
  {
    this.navigationBarTitle = 'Home';
    this.navigationBarColor = 'red';
    this.navigationBarTitleColor = 'white';
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////