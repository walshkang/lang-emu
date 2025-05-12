const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL('http://localhost:3000');

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle ROM and BIOS file operations
ipcMain.handle('select-rom', async () => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'GBA ROMs', extensions: ['gba'] }]
  });
  return filePaths[0];
});

ipcMain.handle('select-bios', async () => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'GBA BIOS', extensions: ['bin'] }]
  });
  return filePaths[0];
});

ipcMain.handle('load-rom', async (event, path) => {
  return await fs.readFile(path);
});

ipcMain.handle('load-bios', async (event, path) => {
  return await fs.readFile(path);
});

// Settings operations
ipcMain.handle('get-settings', async () => {
  try {
    const data = await fs.readFile(path.join(app.getPath('userData'), 'settings.json'), 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
});

ipcMain.handle('save-settings', async (event, settings) => {
  await fs.writeFile(
    path.join(app.getPath('userData'), 'settings.json'),
    JSON.stringify(settings, null, 2)
  );
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
