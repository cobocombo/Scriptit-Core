///////////////////////////////////////////////////////////

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
    this.addComponents({ components: [ list ]});
  }
}

app.present({ root: new SettingsPage() });

///////////////////////////////////////////////////////////