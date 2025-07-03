///////////////////////////////////////////////////////////

let home = new ui.Page();
home.navigationBarTitle = 'Home';
home.onOrientationChange = (newOrientation) => 
{
  if(newOrientation == 'portrait') home.backgroundColor = 'blue';
  else home.backgroundColor = 'red';
};
app.present({ root: home });

///////////////////////////////////////////////////////////