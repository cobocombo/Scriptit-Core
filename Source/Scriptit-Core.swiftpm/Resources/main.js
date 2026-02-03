let HTML = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  </head>
  <body>
  </body>
</html>
`;

let CODE = `
let page = new ui.Page();
page.navigationBarTitle = 'Project';
page.backgroundColor = 'red';
app.present({ root: page });
`

class HomePage extends ui.Page
{
  onInit()
  {
    //files.writeToFile({ subpath: 'test.js', content: CODE, replace: true });
    
    hud.loading();
    
    //browser.open({ url: 'https://www.google.com/', inApp: true, animated: true });
    
    let modal = new ui.Modal();
    let webframe = new ui.Webframe({ html: HTML });
    modal.addComponents({ components: [ webframe ] });

    files.getAbsoluteRootPath({ root: files.roots.bundle })
    .then(bundle =>
    { 
      let bundlePath = bundle.absolutePath.endsWith('/') ? bundle.absolutePath : bundle.absolutePath + '/';
      
      webframe.addNewHeadElement({ tag: 'base' , options: { attributes: { href: bundlePath } } });
      webframe.addNewHeadElement({ tag: 'link' , options: { attributes: { rel: 'stylesheet', href: 'onsenui.min.css' } } });
      webframe.addNewHeadElement({ tag: 'link' , options: { attributes: { rel: 'stylesheet', href: 'onsen-css-components.min.css' } } });
      webframe.addNewHeadElement({ tag: 'link' , options: { attributes: { rel: 'stylesheet', href: 'ionicons.min.css' } } });
      webframe.addNewHeadElement({ tag: 'link' , options: { attributes: { rel: 'stylesheet', href: 'material-design-iconic-font.min.css' } } });
      webframe.addNewHeadElement({ tag: 'link' , options: { attributes: { rel: 'stylesheet', href: 'all.min.css' } } });
      webframe.addNewHeadElement({ tag: 'link' , options: { attributes: { rel: 'stylesheet', href: 'v4-shims.min.css' } } });
      
      webframe.addNewBodyElement({ tag: 'script' , options: { attributes: { src: 'phaser.min.js' }} });
      webframe.addNewBodyElement({ tag: 'script' , options: { attributes: { src: 'onsenui.min.js' }} });
      webframe.addNewBodyElement({ tag: 'script' , options: { attributes: { src: 'scriptit.js' }} });
      
      files.readFile({ subpath: 'test.js' })
      .then(content => { webframe.addNewBodyElement({ tag: 'script' , options: { html: content } }); });
      
      setTimeout(() => 
      {
        modal.present({ animated: false });
        hud.dismiss();
        webframe.load();
      }, 3000);
    });
  }
}

app.present({ root: new HomePage() });