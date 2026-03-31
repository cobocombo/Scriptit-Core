class HomePage extends ui.Page
{  
  constructor()
  {
    super();
    this.id = 'home';
  }
  
  onInit()
  { 
    let exampleLink = new ui.Link({ text: 'Documentation', url: 'https://www.example.com', fontSize: '15px' });
    exampleLink.target = exampleLink.targets.self;
  
    let linkList = new ui.UnorderedList();
    linkList.type = linkList.types.disc;
    linkList.addItem({ item: 'Non-link' });
    
    this.addComponents({ components: [ linkList ] });
  }
}

app.present({ root: new HomePage() });
