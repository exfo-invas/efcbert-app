const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require('path');
const fs = require('fs');
const {exec, spawn } = require("child_process");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let serverProcess;

const createWindow = () => {
  // set timeout to render the window not until the Angular
  // compiler is ready to show the project
  setTimeout(() => {
    // Create the browser window.
    win = new BrowserWindow({
      width: 800,
      height: 600,
      icon: "./src/favicon.ico",
      webPreferences: {
        nodeIntegration: false, // keep disabled for security; use preload to expose IPC
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      },
    });

    // and load the app.
    const url = new URL("http://localhost:4200");
    win.loadURL(url.toString());

    win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on("closed", () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      stopServer();
      win = null;
    });
  }, 10000);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  startServer();
  createWindow();
  console.log("App is ready for dev.");
});

ipcMain.handle('start-server', async () => {
  try {
    const result = startServer();
    return { success: true, result };
  } catch (err) {
    console.error('Failed to start server via IPC (dev):', err);
    return { success: false, error: err && err.message ? err.message : String(err) };
  }
});

// Save PDF to Desktop/EnhancedFcbert/DD-MM-YYYY/<filename>.pdf
ipcMain.handle('save-pdf', async (event, { filename, dateFolder, dataBase64 }) => {
  try {
    const desktop = app.getPath('desktop');
    const dir = path.join(desktop, 'EnhancedFcbert', dateFolder || '');
    fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, filename);
    console.log(`save-pdf invoked: filename=${filename}, dateFolder=${dateFolder || 'none'}, base64Size=${dataBase64 ? dataBase64.length : 0}`);
    fs.writeFileSync(filePath, Buffer.from(dataBase64, 'base64'));
    console.log(`Saved PDF at ${filePath} (dev)`);
    return { success: true, path: filePath };
  } catch (err) {
    console.error('Failed to save PDF via IPC (dev):', err);
    return { success: false, error: err && err.message ? err.message : String(err) };
  }
});

ipcMain.handle('open-pdf', async (event, { path: filePath }) => {
  try {
    if (!filePath) return { success: false, error: 'Invalid file path' };
    try {
      // Launch default PDF application to open the file (safer than creating a window)
      const openResp = await shell.openPath(filePath);
      if (openResp) {
        console.warn('shell.openPath returned an error:', openResp);
      }
      return { success: true };
    } catch (err) {
      console.error('shell.openPath failed:', err);
      return { success: false, error: err && err.message ? err.message : String(err) };
    }
    previewWin.on('closed', () => {});
    return { success: true };
  } catch (err) {
    console.error('Failed to open PDF via IPC (dev):', err);
    return { success: false, error: err && err.message ? err.message : String(err) };
  }
});

ipcMain.handle('reveal-pdf', async (event, { path: filePath }) => {
  try {
    if (!filePath) return { success: false, error: 'Invalid file path' };
    shell.showItemInFolder(path.resolve(filePath));
    return { success: true };
  } catch (err) {
    console.error('Failed to reveal PDF via IPC (dev):', err);
    return { success: false, error: err && err.message ? err.message : String(err) };
  }
});

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

app.on("before-quit", () => {
  stopServer();
  console.log("App is quitting.");

});


/// Server management functions
const startServer = () => {
  return new Promise((resolve, reject) => {
    stopServer();

    const startCommand = 'java -jar ./resources/app/FCBert-0.0.1-SNAPSHOT.jar';
    console.log(startCommand);

    try {
      exec(startCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error starting server: ${error.message}`);
          reject(error);
        } else {
          console.log(`Server started: ${stdout}`);
          if (stderr) console.error(`stderr: ${stderr}`);
          resolve({stdout, stderr});
        }
      });
    } catch (error) {
      console.error(`Error starting server: ${error.message}`);
      reject(error);
    }
  });
}

const stopServer = () => {

  const testCommmand = spawn('taskkill', ['/F', '/IM', 'java.exe']);
  testCommmand.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  const ls = spawn('ls', ['-lh', '/usr']);
  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });


  const stopBatchPath = './src/stop-server.bat';
  let status = false;
  exec(`"${stopBatchPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error stopping server: ${error.message}`);
    } else {
      console.log(`Server stopped: ${stderr}`);

      console.log(`Server stopped: ${stdout}`);
      if (serverProcess) {
        serverProcess.kill('SIGINT'); // Gracefully stop the process
        console.log('Spring Boot server stopped.');
      } else {
        console.log('No server process to terminate.');
      }
      status = true;
    }
  });
  return status;
}
