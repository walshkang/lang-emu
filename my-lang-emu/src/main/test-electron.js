const electron = require('electron');
console.log('Electron module:', electron);
console.log('Electron app:', electron.app);
console.log('Electron BrowserWindow:', electron.BrowserWindow);
console.log('Module paths:', module.paths);
console.log('Require resolution:', require.resolve('electron'));
