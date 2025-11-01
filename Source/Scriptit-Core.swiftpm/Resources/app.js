class HomePage extends ui.Page
{
  onInit()
  {    
    this.backgroundColor = 'white';
    setTimeout(() => 
    {
      this.addComponentToCenter({ component: new ui.Text({ text: 'System', font: font.librarysystem , fontSize: '24px' }) });
    }, 2000);
  }
}

console.log(font.library);
font.load({ name: 'Bulgaria', source: 'Bulgaria Dreams Regular.ttf' });
setTimeout(() => { console.log(font.loaded); }, 1000);
setTimeout(() => { console.log(font.isLoaded({ name: 'Bulgaria' })); }, 1000);

app.present({ root: new HomePage() });



///////////////////////////////////////////////////////////