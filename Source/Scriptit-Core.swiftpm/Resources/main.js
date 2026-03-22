class HomePage extends ui.Page
{  
  constructor()
  {
    super();
  }
  
  onInit()
  {
    let sound = new Howl({ src: ['Coin_1.caf'] });
    setTimeout(() => { sound.play(); }, 3000);
  }
}

app.present({ root: new HomePage() });