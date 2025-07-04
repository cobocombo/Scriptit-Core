///////////////////////////////////////////////////////////

class HomePage extends ui.Page
{
  onInit()
  {
    this.navigationBarTitle = 'Home';

    let textSizeSelctor = new ui.Selector();
    textSizeSelctor.options = ['Small','Medium','Large'];
    textSizeSelctor.underbar = false;

    this.addComponentToCenter({ component: textSizeSelctor });
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////