class HomePage extends ui.Page
{  
  constructor()
  {
    super();
  }
  
  onInit()
  { 
    let groceryList = new ui.UnorderedList();
    
    groceryList.addItem({ item: 'Bread' });
    groceryList.addItem({ item: 'Milk' });
    groceryList.addItem({ item: 'Eggs' });
    
    this.addComponents({ components: [ groceryList ] });
  }
}

app.present({ root: new HomePage() });
