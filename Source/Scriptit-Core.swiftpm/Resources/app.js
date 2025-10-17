///////////////////////////////////////////////////////////

class HomePage extends ui.Page
{
  onInit()
  {
    this.navigationBarTitle = 'Home';
    
    let dialog = new ui.Dialog({ width: '300px', height: '200px' });    
    let dismissButton = new ui.Button({ text: 'Dismiss', onTap: () => { dialog.dismiss(); } });  
    let row = new ui.Row({ width: '100%', height: '200px' });
    let column = new ui.Column({ width: '100%' });
    
    row.addColumn({ column: column });
    column.addComponents({ components: [ dismissButton ] });
    dialog.addComponents({ components: [ row ] });
    dialog.present();
    
    
    // let column1 = new ui.Column();
    // column1.width = '60px';
    // column1.addComponents({ components: [ new ui.Icon({ icon: 'md-volume-down', size: '24px' }) ] });
    
    // let column2 = new ui.Column();
    // column2.addComponents({ components: [ new ui.Slider({ width: '100%' }) ] });
    
    // let column3 = new ui.Column();
    // column3.width = '60px';
    // column3.addComponents({ components: [ new ui.Icon({ icon: 'md-volume-up', size: '24px' }) ] });
    
    // let row = new ui.Row();
    // row.width = '50%';
    // row.height = '100px';
    
    // row.addColumn({ column: column1 });
    // row.addColumn({ column: column2 });
    // row.addColumn({ column: column3 });
  }
}

app.present({ root: new HomePage() });

///////////////////////////////////////////////////////////