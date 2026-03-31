class HomePage extends ui.Page
{  
  constructor()
  {
    super();
    this.id = 'home';
  }
  
  onInit()
  { 
    let newLink = new ui.Link();
    newLink.type = newLink.types.web;
    newLink.icon = 'fa-beer';
    newLink.color = 'gold';
    newLink.fontSize = '25px';
    
    this.addComponentToCenter({ component: newLink });
  }
}

app.present({ root: new HomePage() });
