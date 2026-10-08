const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Native Save System: Now re-configured to output lossless .wav files
ipcMain.handle('save-audio', async (event, arrayBuffer) => {
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Save My Recording',
    defaultPath: path.join(app.getPath('downloads'), 'my-keyboard-jam.wav'), // Updated default extension
    filters: [{ name: 'Audio Files', extensions: ['wav'] }]                  // Updated filter type
  });

  if (filePath) {
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
    return { success: true, path: filePath };
  }
  return { success: false };
});
