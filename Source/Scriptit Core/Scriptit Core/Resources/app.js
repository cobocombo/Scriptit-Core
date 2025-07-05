///////////////////////////////////////////////////////////

// class HomePage extends ui.Page
// {
//   onInit()
//   {
//     this.navigationBarTitle = 'Home';
//     this.button = new ui.Button({ text: 'Push', onTap: () => { _navigator_.push({ page: new SettingsPage(), animated: false })}});
//     this.addComponentToCenter({ component: this.button });
//   }
// }

class SettingsPage extends ui.Page
{
  onInit()
  {
    this.navigationBarTitle = 'Settings';

    let list = new ui.List();
    list.addItem({ item: new ui.ListItem({ center: 'Item 1' }) });
    list.addItem({ item: new ui.ListItem({ center: 'Item 2' }) });
    list.addItem({ item: new ui.ListItem({ center: 'Item 3' }) });
    list.addItem({ item: new ui.ListItem({ center: 'Item 4' }) });
    list.addItem({ item: new ui.ListItem({ center: 'Item 5' }) });
    list.addItem({ item: new ui.ListItem({ center: 'Item 6' }) });
    list.addItem({ item: new ui.ListItem({ center: 'Item 7' }) });
    list.addItem({ item: new ui.ListItem({ center: 'Item 8' }) });
    list.addItem({ item: new ui.ListItem({ center: 'Item 9' }) });
    list.addItem({ item: new ui.ListItem({ center: 'Item 10' }) });
    list.addItem({ item: new ui.ListItem({ center: 'Item 11' }) });
    list.addItem({ item: new ui.ListItem({ center: 'Item 12' }) });
    list.addItem({ item: new ui.ListItem({ center: 'Item 13' }) });
    list.addItem({ item: new ui.ListItem({ center: 'Item 14' }) });
    list.addItem({ item: new ui.ListItem({ center: 'Item 15' }) });
    list.addItem({ item: new ui.ListItem({ center: 'Item 16' }) });
    this.addComponents({ components: [ list ]});

    setTimeout(() => 
    {
      let alert = new ui.AlertDialog({ title: 'Alert Dialog Test' })
      alert.buttons = [ new ui.AlertDialogButton({ text: 'Ok' }) ];
      alert.present();
    }, 3000)
    
  }
}

app.present({ root: new SettingsPage() });

///////////////////////////////////////////////////////////