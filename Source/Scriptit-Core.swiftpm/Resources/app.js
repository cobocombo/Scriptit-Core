class HomePage extends ui.Page
{
  onInit()
  {    
    let hud = new ui.Dialog({ width: '90%', height: '100px' });   
    setTimeout(() => { hud.present(); });
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////