import {app, protocol, BrowserWindow, session} from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import path from 'path';
import {PassThrough} from 'stream';
import fs from 'fs';
import mime from 'mime-types';

const isDevelopment = process.env.NODE_ENV !== 'production';
declare const __static: string;

function createStream (text: any) {
  const rv = new PassThrough(); // PassThrough is also a Readable stream
  rv.push(text);
  rv.push(null);
  return rv;
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1080,
    height: 1920,
    webPreferences: {
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  });
  win.setKiosk(true);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  const appSession = session.defaultSession;
  appSession.protocol.registerFileProtocol('video', (request, callback) => {
    const url = request.url.replace(/^video:\/\//, '');
    // Decode URL to prevent errors when loading filenames with UTF-8 chars or chars like "#"
    const decodedUrl = decodeURI(url); // Needed in case URL contains spaces
    try {
      // eslint-disable-next-line no-undef
      return callback(path.join(__static, decodedUrl));
    } catch (error) {
      console.error(
        'ERROR: registerLocalVideoProtocol: Could not get file path:',
        error
      );
    }
  });
  appSession.protocol.registerStreamProtocol(
  'stream',
  async (request, callback): Promise<void> => {
    const url = request.url.replace(/^stream:\/\//, '');
    const decodedUrl = decodeURI(url);
    const filePath = path.join(__static, decodedUrl);
    //
    // console.log({
    //   url: request.url,
    //   newUrl: url,
    //   decodedUrl,
    //   filePath
    // });

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = request.headers.Range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize-1;

      if(start >= fileSize) {
        callback({
          statusCode: 416,
          data: createStream('Requested range not satisfiable\n'+start+' >= '+fileSize)
        });
        return;
      }

      const chunksize = (end-start)+1;
      const file = fs.createReadStream(filePath, {start, end});
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize.toString(),
        'Content-Type': mime.lookup(filePath)
      };
      const pass = new PassThrough();
      file.pipe(pass);

      callback({
        statusCode: 206,
        headers,
        data: pass
      });
    } else {
      const headers = {
        'Content-Length': fileSize.toString(),
        'Content-Type': mime.lookup(filePath)
      };
      const file = fs.createReadStream(filePath);
      const pass = new PassThrough();
      file.pipe(pass);
      callback({
        statusCode: 200,
        headers,
        data: pass
      });
    }
  });


  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
