import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs-extra';

import { UserManager } from './user-manager';

let serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

let windows: any = {
    main: null,
    video: null
}

if (serve) {
    require('electron-reload')(__dirname, {
    });
}

function initMainListener() {
    ipcMain.on('ELECTRON_BRIDGE_HOST', (event: any, msg: any) => {
        console.log('msg received', msg);

        if (msg === 'ping') {
            event.sender.send('ELECTRON_BRIDGE_CLIENT', 'pong');
        }

        if (msg.event) {
            switch (msg.event) {
                case 'openProfile':
                    return openProfile(msg.uid);

                case 'openFollowingWindow':
                    return openFollowingWindow(msg.uid, msg.uname);

                case 'openFansWindow':
                    return openFansWindow(msg.uid, msg.uname);

                case 'openVideoPlayer':
                    return openVideoPlayer(msg.url, msg.chat, msg.start);
            }
        }
    });
}

function createWindow() {
    windows.main = new BrowserWindow({
        width: 800,
        minWidth: 800,
        height: 600,
        minHeight: 600,
        frame: true
    });

    windows.main.loadURL(`file://${__dirname}/index.html`);

    if (serve) {
        windows.main.webContents.openDevTools();
    }

    windows.main.on('closed', () => {
        windows.main = null;
        app.quit();
    });

    initMainListener();
}

try {
    app.on('ready', () => {
        initFs();
        createWindow();
    });

    app.on('window-all-closed', () => {
        app.quit();
    });

    app.on('activate', () => {
        if (windows.main === null) {
            createWindow();
        }
    });

} catch (e) {

}

function openProfile(uid: string) {
    windows.main.webContents.send('ELECTRON_BRIDGE_CLIENT', { event: 'openProfile', uid: uid });
}

function openFollowingWindow(uid: string, username: string) {
    let window = new BrowserWindow({
        width: 320,
        minWidth: 320,
        height: 720,
        frame: true,
        show: false,
        webPreferences: {
            webSecurity: false
        }
    });

    window.setMenu(null);
    window.loadURL(`file://${__dirname}/index.html#/u/${uid}/following?name=${username}`);

    window.once('ready-to-show', () => {
        window.show();
    });
}

function openFansWindow(uid: string, username: string) {
    let window = new BrowserWindow({
        width: 320,
        minWidth: 320,
        height: 720,
        frame: true,
        show: false,
        webPreferences: {
            webSecurity: false
        }
    });

    window.setMenu(null);
    window.loadURL(`file://${__dirname}/index.html#/u/${uid}/fans?name=${username}`);

    window.once('ready-to-show', () => {
        window.show();
    });
}

function openVideoPlayer(video: string, chat: string, startTime: string) {
    video = encodeURIComponent(video);
    chat = encodeURIComponent(chat);

    if (windows.video) {
        windows.video.loadURL(`file://${__dirname}/index.html#/video?url=${video}&chat=${chat}&start=${startTime}`);
        windows.video.focus();
    } else {
        windows.video = new BrowserWindow({
            width: 709,
            height: 720,
            frame: true,
            show: false,
            webPreferences: {
                webSecurity: false
            }
        });

        windows.video.setMenu(null);
        windows.video.loadURL(`file://${__dirname}/index.html#/video?url=${video}&chat=${chat}&start=${startTime}`);

        windows.video.once('ready-to-show', () => {
            windows.video.show();
        });

        windows.video.on('closed', () => {
            windows.video = null;
        });
    }
}

/* ============
    Filesystem
   ============ */

function initFs() {
    if (process.env.DEV) {
        app.setPath('userData', path.join(app.getPath('appData'), 'LiveMe Toolkit (dev)'))
    }

    fs.ensureDirSync(app.getPath('userData'));

    fs.ensureFileSync(path.join(app.getPath('userData'), 'favourites.json'));
    fs.ensureFileSync(path.join(app.getPath('userData'), 'likes.json'));
    fs.ensureFileSync(path.join(app.getPath('userData'), 'viewed.json'));

    let usermanager = new UserManager();
    usermanager.load();
    (<any>global).UserManager = usermanager;
}