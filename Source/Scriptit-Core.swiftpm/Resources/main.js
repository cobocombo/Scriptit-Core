class HomePage extends ui.Page
{  
  constructor()
  {
    super();
  }
  
  onInit()
  { 
    let code = new ui.Codeblock({ code: js });
    code.font = code.fonts.systemMono;
    code.fontSize = '15px';
    code.theme = code.themes.xcodeLight;
    code.marginLeft = '12px';
    
    this.addComponents({ components: [ code ] });
  }
}

let js = `console.log('Hello World!');\nlet text = 'Hi!'\nconsole.log('Hello World!');`;
app.present({ root: new HomePage() });
