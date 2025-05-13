import electron from 'electron';
import path from 'path';

console.log('Electron module loaded');
console.log('electron:', electron);

const { app, BrowserWindow } = electron;
console.log('app:', app);
console.log('BrowserWindow:', BrowserWindow);

// Keep a global reference of the window object
let mainWindow: Electron.BrowserWindow | null = null;

async function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load a URL
  await mainWindow.loadFile('index.html');
  
  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow).catch(console.error);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
