///////////////////////////////////////////////////////////

class PhaserScene extends Component 
{
  constructor({ config = {}, ...options } = {}) 
  {
    super({ tagName: 'div', options });

    this.width = '100%';
    this.height = '100%';
    this.style.position = 'relative';

    if(!config.width) config.width = 100;
    if(!config.height) config.height = 100;
    this.game = new Phaser.Game({ type: Phaser.CANVAS, parent: this.element, ...config });
  }
}

class PhaserGame extends Component
{

}

///////////////////////////////////////////////////////////

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
    let scene = new PhaserScene({ config: { width: 100, scene: [ GameScene ]} });
    this.addComponents({ components: [ scene ] });

    this.button = new ui.Button({ text: 'Hello World'});
    this.button.onTap = () => 
    {
      console.log(`Screen Height: ${device.screenHeight}`);
      console.log(`Screen Width: ${device.screenWidth}`);
    }

    this.addComponentToCenter({ component: this.button });
  }
}

app.statusBarColor = 'red';
app.present({ root: new PhaserPage() });

///////////////////////////////////////////////////////////