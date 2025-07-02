///////////////////////////////////////////////////////////

class SplashScene extends Phaser.Scene 
{
  constructor() 
  {
    super({ key: 'SplashScene' });
  }

  create() 
  {
    this.cameras.main.setBackgroundColor('#00ff00');
    setTimeout(() => { this.scene.start('MainMenuScene'); }, 2000);
  }
}

class MainMenuScene extends Phaser.Scene 
{
  constructor() 
  {
    super({ key: 'MainMenuScene' });
  }

  create() 
  {
    this.cameras.main.setBackgroundColor('#0000ff');
     setTimeout(() => { this.scene.start('GameScene'); }, 2000);
  }
}

class GameScene extends Phaser.Scene 
{
  constructor() 
  {
    super({ key: 'GameScene' });
  }

  create() 
  {
    this.cameras.main.setBackgroundColor('#ff0000');
  }
}

class PhaserPage extends ui.Page
{
  onInit()
  {
    let game = new PhaserGame({ config: { scene: [ SplashScene, MainMenuScene, GameScene ]} });
    this.addComponents({ components: [ game ] });
  }
}

app.present({ root: new PhaserPage() });

///////////////////////////////////////////////////////////