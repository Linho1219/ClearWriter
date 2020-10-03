const glasstron = require("glasstron");
glasstron.init(); // Call it before requiring electron!

const { app, BrowserWindow } = require("electron");
const electron = require("electron");
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

const ipc = electron.ipcMain;

const Store = require("electron-store");

const store = new Store();

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    // 当运行第二个实例时,将会聚焦到mainWindow这个窗口
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
      path = commandLine[commandLine.length - 1];
      win.webContents.send("openFile", path);
    }
  });

ipc.on("toogle-acrylic", function () {
  // store.set("acrylic", store.get("acrylic") == "1" ? "0" : "1");
  // app.exit();
  // app.relaunch();
  if (store.get("acrylic") == 0)
    glasstron.update(win, {
      windows: { blurType: null },
      macos: { vibrancy: null },
      linux: { requestBlur: false }, // KWin
    });
  else
    glasstron.update(win, {
      windows: { blurType: "acrylic" },
      //                   ^~~~~~~
      // Windows 10 1803+; for older versions you might want to use 'blurbehind'
      macos: { vibrancy: "fullscreen-ui" },
      linux: { requestBlur: true }, // KWin
    });
});

if (!store.get("acrylic")) {
  store.set("acrylic", 0);
}

const Menu = electron.Menu;
function createWindow() {
  Menu.setApplicationMenu(null);
  // Create the browser window.
  win = new BrowserWindow({
    width: 1100,
    height: 740,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    frame: false,
    //transparent: store.get("acrylic") == "1" ? true : false,
    icon: "icon.ico",
    thickFrame: true,
    minHeight: 180,
    minWidth: 250,
    show: false,
  });

  // and load the html of the app.
  win.loadFile("Clear_Writer.html");

  // Open the DevTools.
  // win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  win.once("ready-to-show", () => {
    win.show();
  });

  if (store.get("acrylic") == 1) {
    glasstron.update(win, {
      windows: { blurType: "acrylic" },
      //                   ^~~~~~~
      // Windows 10 1803+; for older versions you might want to use 'blurbehind'
      macos: { vibrancy: "fullscreen-ui" },
      linux: { requestBlur: true }, // KWin
    });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
