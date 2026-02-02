///////////////////////////////////////////////////////////

let site = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'">
    <link rel="stylesheet" href="onsenui.min.css">
    <link rel="stylesheet" href="onsen-css-components.min.css">
    <link rel="stylesheet" href="ionicons.min.css">
    <link rel="stylesheet" href="material-design-iconic-font.min.css">
    <link rel="stylesheet" href="all.min.css">
    <link rel="stylesheet" href="v4-shims.min.css">
</head>
<body>
    <script src="phaser.min.js"></script>
    <script src="onsenui.min.js"></script>
    <script src="scriptit.js"></script>
    <script src="project.js"></script>
</body>
</html>
`

class HomePage extends ui.Page
{
  onInit()
  {        
    this.navigationBarTitle = 'Home';
    
    files.getAbsoluteRootPath({ root: files.roots.temporary })
    .then(root => 
    {
      console.log(root.absolutePath);
    });
    
    // files.getFolder({ subpath: '' })
    // .then(folder => 
    // {
    //   console.log(folder);
    // });
    
    let web = new ui.Webbrowser();
    web.loadHTML({ html: site });
    
    this.addComponents({ components: [ web ] });
    
    //setTimeout(() => { console.log(web.html); }, 3000);
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////