///////////////////////////////////////////////////////////

class HomePage extends ui.Page
{
  onInit()
  {        
    let search = new ui.Textfield();
    search.autocapitalize = false;
    
    this.addComponents({ components: [ search ] });
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////