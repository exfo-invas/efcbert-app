const {app, BrowserWindow} = require("electron");
const path = require("path");
const {exec} = require("child_process");
const http = require('http');

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 1200, height: 800, icon: path.join(__dirname, "favicon.ico"), webPreferences: {
      nodeIntegration: true, // turn it on to use node features
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
