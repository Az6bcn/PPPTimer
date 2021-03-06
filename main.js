// root of my  app
const path = require('path');
const url = require('url');
const {
  app,
  BrowserWindow
} = require("electron");

let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 900,
    height: 850,
    backgroundColor: "#ffffff",
    // icon: `file://${__dirname}/dist/assets/logo.png`,
    fullscreen: false,
    fullscreenWindowTitle: "PPP Timer",
    title: "PPP Timer",
    webPreferences: {
      nodeIntegration: true // turn it on to use node features
    },

  });

  win.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist/angular-electron/index.html'),
        protocol: "file:",
        slashes: true
      })),


    //// uncomment below to open the DevTools.
    // win.webContents.openDevTools()

  // Event when the window is closed.
  win.on("closed", function () {
    win = null;
  });
}

// Create window on electron intialization
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS specific close process
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // macOS specific close process
  if (win === null) {
    createWindow();
  }
});
