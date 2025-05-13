const electron = require('electron');

if (!electron) {
  console.error('Failed to load electron module');
  process.exit(1);
}

console.log('Electron module:', electron);
console.log('Electron app:', electron.app);
console.log('Electron BrowserWindow:', electron.BrowserWindow);

const { app, BrowserWindow } = electron;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
});
