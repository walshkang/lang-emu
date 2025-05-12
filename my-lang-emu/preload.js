const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // File system operations
  loadROM: (path) => ipcRenderer.invoke('load-rom', path),
  loadBIOS: (path) => ipcRenderer.invoke('load-bios', path),
  selectROM: () => ipcRenderer.invoke('select-rom'),
  selectBIOS: () => ipcRenderer.invoke('select-bios'),
  
  // Game state operations
  saveState: (slot) => ipcRenderer.invoke('save-state', slot),
  loadState: (slot) => ipcRenderer.invoke('load-state', slot),
  
  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
});

// Expose a minimal gamepad API for input handling
contextBridge.exposeInMainWorld('gamepad', {
  getGamepads: () => navigator.getGamepads?.() || [],
  requestGamepadAccess: () => {
    return new Promise((resolve) => {
      const handleGamepadConnected = () => {
        window.removeEventListener('gamepadconnected', handleGamepadConnected);
        resolve(true);
      };
      window.addEventListener('gamepadconnected', handleGamepadConnected);
    });
  }
});
