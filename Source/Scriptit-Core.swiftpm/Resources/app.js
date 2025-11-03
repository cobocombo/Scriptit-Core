class HomePage extends ui.Page
{
  onInit()
  {    
    this.backgroundColor = 'white';
    
    let helloText = new ui.Text({ type: 'paragraph' });
    helloText.text = 'Hello [b:World!]';
    
    this.addComponentToCenter({ component: helloText });
  }
}

app.present({ root: new HomePage() });



///////////////////////////////////////////////////////////