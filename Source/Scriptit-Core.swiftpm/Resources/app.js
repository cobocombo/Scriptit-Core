class HomePage extends ui.Page
{
  onInit()
  {    
    this.backgroundColor = 'white';
    
    let helloText = new ui.Text({ type: 'paragraph' });
    helloText.text = 'Hello [b:World!]';
    
    console.log(color.isValid({ color: 'red' }));
    console.log(color.isValid({ color: 'ref' }));
    
    console.log(color.isHexColor({ color: '#ff0000' }));
    console.log(color.isHexColor({ color: '#1234' }));
    
    this.addComponentToCenter({ component: helloText });
  }
}

app.present({ root: new HomePage() });



///////////////////////////////////////////////////////////