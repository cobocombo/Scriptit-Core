async function initApp() 
{
  Neutralino.init();
  Neutralino.events.on("windowClose", () => {
    Neutralino.app.exit();
  });

  await Neutralino.window.setSize({
      width: 800,
      height: 600,
      resizable: true
  });
}

initApp();
