class SplashPage extends Page 
{
  constructor() 
  {
    super();
    this.backgroundColor = '#f0dc51';
    
    const logo = new ImageV2({ src: 'scriptit-logo.png', width: '300px', height: '300px'});
    this.addContentToCenter({ content: logo });
    
    setTimeout(() => { console.log('Go To Next Page...') }, 2000);
  }
}