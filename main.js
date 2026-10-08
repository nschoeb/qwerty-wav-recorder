const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 620,        // Increased to 620 to provide plenty of vertical room
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Hides the standard Windows top menu bar for a clean dashboard look
  mainWindow.setMenu(null); 

  mainWindow.loadFile('index.html');
  return mainWindow;
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
