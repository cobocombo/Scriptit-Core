class HomePage extends ui.Page
{
  onInit()
  {    
    this.backgroundColor = 'white';
    this.navigationBarTitle = 'Home';
    this.navigationBarFont = font.library.menlo;
       
    
    let notification = new ui.Toast();
    notification.animation = 'fall';
    notification.message = 'This is a toast!';
    notification.dismissIcon = 'ion-ios-close';
    notification.font = font.library.americanTypewriter;
    notification.present();
  }
}

app.present({ root: new HomePage() });



///////////////////////////////////////////////////////////