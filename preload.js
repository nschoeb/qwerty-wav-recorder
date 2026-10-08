const { contextBridge, ipcRenderer } = require('electron');

// Expose a clean, safe function to the frontend webpage
contextBridge.exposeInMainWorld('recorderAPI', {
  saveFile: (buffer) => ipcRenderer.invoke('save-audio', buffer)
});
