Neutralino.init();
  Neutralino.events.on("windowClose", () => {
    Neutralino.app.exit();
  });

  Neutralino.window.setSize({
    width: 800,
    height: 600,
    resizable: true
});