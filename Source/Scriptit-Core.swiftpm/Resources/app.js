class HomePage extends ui.Page
{
  onInit()
  {    
    this.addComponentToCenter({ component: new ui.Text({ text: 'Hello World', font: font.library.system }) })
  }
}

app.present({ root: new HomePage() });

console.log(font.library);

///////////////////////////////////////////////////////////