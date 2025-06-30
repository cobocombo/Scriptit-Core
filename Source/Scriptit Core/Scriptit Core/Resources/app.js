class GameScene extends Phaser.Scene 
{
  constructor() 
  {
    super('GameScene');
    console.log('GameScene init...')
  }

  preload() 
  {
    console.log('GameScene loading...')
  }

  create() 
  {
    console.log('GameScene creation...')
    this.cameras.main.setBackgroundColor("#d5d5d5");
  }
}

class PhaserPage extends ui.Page
{
  onInit()
  {
    this.navigationBarTitle = 'Phaser Game';
    let scene = new PhaserScene({ phaserConfig: { scene: [ GameScene ]} });
    this.addComponents({ components: [ scene ] });
  }
}

let scene = new PhaserScene({ phaserConfig: { scene: [ GameScene ]} });
app.present({ root: new PhaserPage() });