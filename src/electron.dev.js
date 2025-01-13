const { app, BrowserWindow } = require("electron");
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
        nodeIntegration: false, // turn it on to use node features
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


//
/// Server management functions
const startServer = () => {

  const startCommand = 'java -jar ./src/FCBert-0.0.1-SNAPSHOT.jar';

  let status= false;
  exec(startCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting server: ${error.message}`);
    } else {
      console.log(`Server started: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      status = true;
    }
  });
  return status;
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
