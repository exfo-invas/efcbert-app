const {app, BrowserWindow, ipcMain, shell} = require("electron");
const path = require("path");
const fs = require('fs');
const {exec} = require("child_process");
const http = require('http');

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 1000, height: 800, icon: path.join(__dirname, "favicon.ico"), webPreferences: {
      nodeIntegration: false, // keep disabled; use preload to expose IPC
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  win.loadFile('index.html').then(r => console.log(r));

  win.on("closed", () => {
    stopServer();
    win = null;
  });
};

app.on("ready", () => {
  startServer();

  createWindow();

  console.log("App is ready.");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});

/// Server management functions
const startServer = () => {
  stopServer();

  const startCommand = 'java -jar ./resources/app/FCBert-0.0.1-SNAPSHOT.jar';
  console.log(startCommand);

  let status = false;
  try {
    exec(startCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting server: ${error.message}`);
      } else {
        console.log(`Server started: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        status = true;
      }
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
  }

  return status;
}

const stopServer = () => {

  const options = {
    hostname: 'localhost', port: 8080, path: '/actuator/shutdown', method: 'POST',
  };

  try {
    const req = http.request(options, (res) => {
      console.log(`statusCode: ${res.statusCode}`);

      res.on('data', (d) => {
        process.stdout.write(d);
      });
    });

    req.on('error', (error) => {
      console.error(`Error sending shutdown request: ${error.message}`);
    });

    req.end();
  } catch (error) {
    console.error(`Error sending shutdown request: ${error.message}`);
  }
}


/// Server management functions
const restartServer = () => {
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

const restopServer = () => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost', port: 8080, path: '/actuator/shutdown', method: 'POST',
    };

    try {
      const req = http.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);

        let bodyChunks = [];
        res.on('data', (d) => {
          process.stdout.write(d);
          bodyChunks.push(d);
        });
        res.on('end', () => {
          resolve(Buffer.concat(bodyChunks).toString());
        });
      });
      req.on('error', (error) => {
        console.error(`Error sending shutdown request: ${error.message}`);
        resolve(null);
      });

      req.end();
    } catch (error) {
      console.error(`Error sending shutdown request: ${error.message}`);
      resolve(null);
    }
  })
}

// Expose an IPC handler so the renderer can request the main process to start/stop the embedded server.
ipcMain.handle('start-server', async () => {
  try {
    const result = await restartServer();
    return {success: true, result};
  } catch (err) {
    console.error('Failed to start server via IPC:', err);
    return {success: false, error: err && err.message ? err.message : String(err)};
  }
});

ipcMain.handle('stop-server', async () => {
  try {
    const result = await restopServer();
    return {success: true, result};
  } catch (err) {
    console.error('Failed to stop server via IPC:', err);
    return {success: false, error: err && err.message ? err.message : String(err)};
  }
});

// Save PDF: write base64 data to a Desktop/EnhancedFcbert/<date> folder
ipcMain.handle('save-pdf', async (event, { filename, dataBase64 }) => {
  try {
    const desktop = app.getPath('desktop');
    // Auto-generate date folder
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yy = String(now.getFullYear()).slice(-2);

    const dateFolder = `${dd}-${mm}-${yy}`;
    const dir = path.join(desktop, 'EnhancedFcbert', dateFolder);
    // Create folder only if missing
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, filename);
    console.log(`save-pdf invoked: filename=${filename}, dateFolder=${dateFolder}, base64Size=${dataBase64 ? dataBase64.length : 0}`);
    fs.writeFileSync(filePath, Buffer.from(dataBase64, 'base64'));
    console.log(`Saved PDF at ${filePath} (prod)`);
    return { success: true, path: filePath };
  } catch (err) {
    console.error('Failed to save PDF via IPC (prod):', err);
    return { success: false, error: err && err.message ? err.message : String(err) };
  }
});

ipcMain.handle('open-pdf', async (event, { path: filePath }) => {
  try {
    if (!filePath) return { success: false, error: 'Invalid file path' };
    try {
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
    console.error('Failed to open PDF via IPC (prod):', err);
    return { success: false, error: err && err.message ? err.message : String(err) };
  }
});

ipcMain.handle('reveal-pdf', async (event, { path: filePath }) => {
  try {
    if (!filePath) return { success: false, error: 'Invalid file path' };
    shell.showItemInFolder(path.resolve(filePath));
    return { success: true };
  } catch (err) {
    console.error('Failed to reveal PDF via IPC (prod):', err);
    return { success: false, error: err && err.message ? err.message : String(err) };
  }
});
