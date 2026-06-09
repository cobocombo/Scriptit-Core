let cssFiles = [
  "onsenui-min.css",
  "onsen-css-components-min.css",
  "ionicons-min.css",
  "material-design-icons-min.css",
  "fa-all-min.css"
];

let jsFiles = [
]

app.backgroundColor = "red";
app.loadStyles({ root: "CSS/" , filePaths: cssFiles });
app.loadScripts({ root: "JS/" , filePaths: jsFiles });

Neutralino.init();
Neutralino.events.on("windowClose", () => {
  Neutralino.app.exit();
});

