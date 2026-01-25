///////////////////////////////////////////////////////////

class HomePage extends ui.Page
{
  onInit()
  {        
    this.navigationBarTitle = 'Home';
    this.onNavigationBarTitleTap = () => { console.log(this.navigationBarTitle); }
    
    let search = new ui.Textfield();
    search.spellcheck = false;
    
    this.addComponents({ components: [ search ] });
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////