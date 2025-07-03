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
    //this.addComponents({ components: [ game ] });

    // let button = new ui.Button({ text: 'Confetti Check' });
    // button.onTap = () => 
    // { 
    //   confetti.start({ timeout: 3000 }); 
    // }
    // this.addComponentToCenter({ component: button });

    setTimeout(() => { confetti.start() }, 1000);
    setTimeout(() => { console.log(confetti.isRunning) }, 2000);
    setTimeout(() => { confetti.pause() }, 3000);
    setTimeout(() => { console.log(confetti.isPaused) }, 4000);
    setTimeout(() => { confetti.resume() }, 5000);
    setTimeout(() => { confetti.togglePause() }, 6000);
    setTimeout(() => { confetti.resume() }, 7000);
    setTimeout(() => { confetti.stop() }, 7000);
  }
}

app.present({ root: new PhaserPage() });

///////////////////////////////////////////////////////////