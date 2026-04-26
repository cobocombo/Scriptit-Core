let BASE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'">
    <style>
    body 
    {
      margin: 0;
      background-color: blue;
    }
  </style>
</head>
<body>
  <script>
    console.log("This script runs inside the HTML document.");
  </script>
</body>
</html>
`

class HomePage extends ui.Page
{  
  constructor()
  {
    super();
    this.id = 'home';
  }
  
  onInit()
  {     
    this.navigationBarTitle = 'Home';
    this.backgroundColor = 'red';
    
    //console.fullscreen();
    
    //files.deleteInvalidFolderOverride = true;
    //files.deleteFolder({ subpath: 'Projects/' });
    
    setTimeout(() => { app.previewProject({ project: 'Safari' }) }, 3000);
  }
  
  createFolderStructure()
  {
    files.createFolder({ folderName: 'Projects' })
    .then(projects => 
    {
      console.log('Projects folder created...');
      files.createFolder({ subpath: projects.relativePath, folderName: 'Safari' })
      .then(safari =>
      {
        console.log('Safari folder created...');
        files.createFile({ subpath: safari.relativePath, fileName: 'index.html' })
        .then(file => 
        {
          console.log('File created...');
          files.writeToFile({ subpath: file.relativePath, content: BASE })
        }) 
      })
    })
  }
}

app.present({ root: new HomePage() });