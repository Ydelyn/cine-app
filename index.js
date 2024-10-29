// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Optionnel, pour charger des scripts de sécurisation
      contextIsolation: false,
      enableRemoteModule: true,
      nodeIntegration: true,
    },
  });

  win.loadURL('http://localhost:3000'); // URL de l'application React en développement

  // Pour la version de production
  // win.loadFile(path.join(__dirname, 'build', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
