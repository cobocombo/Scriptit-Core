class HomePage extends ui.Page
{
  onInit()
  {    
    this.backgroundColor = 'red';
  }
}

class SettingsPage extends ui.Page
{
  onInit()
  {    
    this.backgroundColor = 'blue';
  }
}

class MorePage extends ui.Page
{
  onInit()
  {    
    this.backgroundColor = 'green';
  }
}

let homeTab = new ui.Tab();
homeTab.root = new HomePage();
homeTab.icon = 'ion-ios-home';
homeTab.text = 'Home';
homeTab.color = 'red';
homeTab.badge = '4';

let settingsTab = new ui.Tab();
settingsTab.root = new SettingsPage();
settingsTab.icon = 'ion-ios-cog';
settingsTab.text = 'Settings';
settingsTab.color = 'blue';

let moreTab = new ui.Tab();
moreTab.root = new MorePage();
moreTab.icon = 'ion-ios-more';
moreTab.text = 'More';
moreTab.color = 'orange';

let tabbar = new ui.Tabbar();
tabbar.tabs = [ homeTab, settingsTab, moreTab ]

// let sideMenu = new ui.SplitterMenu({ root: new SidePage() });
// sideMenu.width = '100px';

// let splitter = new ui.Splitter();
// splitter.detail = new HomePage();
// splitter.leftMenu = sideMenu;

let NAVIGATOR = new ui.Navigator({ root: tabbar });
app.present({ root: NAVIGATOR });

setTimeout(() => { NAVIGATOR.push({ root: new MorePage(), animated: false }) }, 3000);
setTimeout(() => { NAVIGATOR.pop({ animated: false }) }, 5000);

///////////////////////////////////////////////////////////