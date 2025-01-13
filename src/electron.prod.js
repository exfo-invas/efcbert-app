const {app, BrowserWindow} = require("electron");
const path = require("path");
const {exec} = require("child_process");
const http = require('http');

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 1000, height: 800, icon: path.join(__dirname, "favicon.ico"), webPreferences: {
      nodeIntegration: true, // turn it on to use node features
    },
  });

  win.loadFile('index.html').then(r => console.log(r));

  win.on("closed", () => {
    win = null;
  });
};

app.on("ready", () => {
  if (startServer()) {
    console.log("Server started.");
  }
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

app.on("before-quit", () => {
  stopServer();
  console.log("Test if app is quitting.");
});

/// Server management functions
const startServer = () => {
  stopServer();

  const startCommand = 'java -jar ./resources/app/FCBert-0.0.1-SNAPSHOT.jar';
  console.log(startCommand);

  let status = false;
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

  const options = {
    hostname: 'localhost', port: 8080, path: '/actuator/shutdown', method: 'POST',
  };

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


  /*let stopBatchPath = './resources/app/stop-server.bat';

  exec(`"${stopBatchPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error stopping server: ${error.message}`);
    } else {
      console.log(`Server stopped: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  });*/
}
