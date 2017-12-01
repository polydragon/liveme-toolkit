// because this project is set up in a weird way this is the easiest way to get some es6 features
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const wget = require('wget-improved');
const pMap = require('p-map');
const pProgress = require('p-progress');
const axios = require('axios');
const path = require("path");
const fs = require("fs-extra");
const events = require("events");
const { app, ipcMain, dialog } = require('electron');
const { exec } = require('child_process');
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
class DownloadManager {
    constructor() {
        this._queue = new Map();
        this._history = [];
        this._paused = false;
        this._running = false;
        this.events = new (events.EventEmitter)();
    }
    _emit(channel, obj) {
        if (this._eventCache && (this._eventCache.channel === channel && JSON.stringify(this._eventCache.obj) === JSON.stringify(obj))) {
            return;
        }
        else {
            this._eventCache = {
                channel: channel,
                obj: obj
            };
        }
        this.events.emit(channel, obj);
    }
    _processChunk(url, dest) {
        return new pProgress((resolve, reject, progress) => {
            fs.ensureDirSync(path.dirname(dest));
            let download = wget.download(url, dest);
            download.on('error', (err) => {
                return resolve({ success: false, error: err, local: dest });
            });
            download.on('start', (filesize) => {
            });
            download.on('end', (output) => {
                return resolve({ success: true, local: dest });
            });
            download.on('progress', (p) => {
                progress({ chunk: path.basename(url, '.ts'), progress: p });
            });
        });
    }
    _getTempFilename(url, uuid) {
        return path.join(this._appSettings.get('downloads.directory'), 'temp', uuid, path.basename(url));
    }
    _getLocalFilename(playlist) {
        let defaultPath = path.join(this._appSettings.get('downloads.directory'), path.basename(playlist.video.url).replace("m3u8", "mp4"));
        let finalPath;
        if (this._appSettings.get('downloads.filemode') == 0) {
            finalPath = defaultPath;
        }
        else {
            let finalName = this._appSettings.get('downloads.filetemplate')
                .replace(/%%username%%/g, playlist.user.name)
                .replace(/%%userid%%/g, playlist.user.id)
                .replace(/%%videoid%%/g, playlist.video.id)
                .replace(/%%videotitle%%/g, playlist.video.title)
                .replace(/%%videotime%%/g, '' + playlist.video.time);
            if (!finalName || finalName == '') {
                finalPath = defaultPath;
            }
            else {
                finalPath = path.join(this._appSettings.get('downloads.directory'), finalName.replace(/[:*?""<>|]/g, '_') + ".mp4");
            }
        }
        let basename = path.basename(finalPath);
        if (basename == 'playlist.mp4' || basename == 'playlist_eof.mp4') {
            let parentName = path.basename(path.dirname(playlist.video.url));
            finalPath = finalPath.replace(basename, parentName + '.mp4');
        }
        fs.ensureDirSync(path.dirname(finalPath));
        return finalPath;
    }
    _getUrlsFromPlaylist(m3u8) {
        return new Promise((resolve, reject) => {
            return axios
                .get(m3u8)
                .then(response => {
                let playlist = [], baseURL = path.dirname(m3u8);
                for (let line of (response.data.split('\n'))) {
                    line = line.trim();
                    if (line.length == 0 || line[0] == '#') {
                        continue;
                    }
                    line = line.split('?').shift();
                    line = `${baseURL}/${line}`;
                    if (playlist.indexOf(line) != -1) {
                        continue;
                    }
                    playlist.push(line);
                }
                return resolve(playlist);
            })
                .catch(err => {
                return reject(err);
            });
        });
    }
    _processItem(uuid, playlist) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            this._emit('download-started', { uuid: uuid });
            let chunkProgress = new Map();
            let downloadedChunks = 0;
            this._emit('download-status', { uuid: uuid, status: 'Getting chunks to download...' });
            let urls = yield this._getUrlsFromPlaylist(playlist.video.url).catch(err => {
                return reject(`Couldn't get chunks to download: ${err}`);
            });
            let mapper = el => this._processChunk(el, this._getTempFilename(el, uuid)).onProgress(p => {
                chunkProgress.set(p.chunk, p.progress);
                let total = 0;
                for (let val of chunkProgress.values()) {
                    if (val)
                        total += val;
                }
                total = Math.floor((total / urls.length) * 100);
                this._emit('download-progress', { uuid: uuid, percent: total });
            }).then((result) => {
                downloadedChunks++;
                this._emit('download-status', { uuid: uuid, status: `Downloading chunks [${downloadedChunks}/${urls.length}]` });
                return result;
            });
            this._emit('download-status', { uuid: uuid, status: `Downloading chunks [0/${urls.length}]` });
            pMap(urls, mapper, { concurrency: (this._appSettings.get('downloads.concurrency') || 4) }).then(result => {
                this._emit('download-status', { uuid: uuid, status: 'Merging chunks' });
                if (result.length == 1) {
                    let newPath = this._getLocalFilename(playlist);
                    if (fs.existsSync(newPath)) {
                        fs.removeSync(newPath);
                    }
                    fs.moveSync(result[0].local, newPath);
                    return resolve();
                }
                let concatStr = '# Generated by LiveMeTools';
                let concatPath = this._getTempFilename('concat.txt', uuid);
                for (let res of result) {
                    if (res.success) {
                        concatStr += `\nfile '${res.local}'`;
                    }
                    else {
                        return reject(`Failed to download at least one file`);
                    }
                }
                fs.writeFileSync(concatPath, concatStr);
                exec(`${this._ffmpegPath} -f concat -safe 0 -i "${concatPath}" -c copy "${this._getLocalFilename(playlist)}"`, (error, stdout, stderr) => {
                    if (error) {
                        let log = path.join(this._appSettings.get('downloads.directory'), 'ffmpeg-error.log');
                        fs.writeFileSync(log, `${error}\n\n${stderr}\n\n${stdout}`);
                        this._cleanupTempFiles(uuid);
                        return reject(`FFMPEG Error, saved in: ${log}`);
                    }
                    this._cleanupTempFiles(uuid);
                    return resolve();
                });
            });
        }));
    }
    _cleanupTempFiles(uuid) {
        this._emit('download-status', { uuid: uuid, status: 'Cleaning temporary files' });
        fs.removeSync(path.join(this._appSettings.get('downloads.directory'), 'temp', uuid));
    }
    init(appSettings) {
        this._appSettings = appSettings;
        let mpeg = appSettings.get('downloads.ffmpeg'), probe = appSettings.get('downloads.ffprobe');
        if (mpeg && mpeg != 'ffmpeg') {
            this._ffmpegPath = mpeg;
        }
        if (probe && probe != 'ffprobe') {
        }
    }
    add(playlist) {
        let uuid = uuidv4();
        this._queue.set(uuid, playlist);
        this._emit('download-queued', { uuid: uuid, display: `${playlist.user.name}: ${playlist.video.id}` });
        this.loop();
        return uuid;
    }
    delete(uuid) {
        this._queue.delete(uuid);
        this._emit('download-deleted', { uuid: uuid });
    }
    start(uuid) {
        let item = this._queue.get(uuid);
        this._queue.delete(uuid);
        return this._processItem(uuid, item)
            .then(result => {
            this._emit('download-completed', { uuid: uuid });
            if (this._appSettings.get('downloads.history')) {
                this._history.push(item.video.id);
            }
        })
            .catch(err => {
            this._emit('download-errored', { uuid: uuid, error: err });
        });
    }
    loop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._running || this._paused) {
                return;
            }
            this._running = true;
            while (this._queue.size > 0 && !this._paused) {
                yield this.start(this._queue.keys().next().value);
                this.saveQueue();
            }
            this._running = false;
        });
    }
    isPaused() {
        return this._paused;
    }
    isRunning() {
        return this._running;
    }
    pause() {
        this._paused = true;
        this._emit('download-global-pause', null);
    }
    resume() {
        this._paused = false;
        this._emit('download-global-resume', null);
        this.loop();
    }
    load() {
        console.log(global.Settings.get('download.path'));
        //this.loadQueue();
        //this.loadHistory();
    }
    save() {
        this.saveQueue();
        this.saveHistory();
    }
    hasBeenDownloaded(videoid) {
        return this._history.indexOf(videoid) != -1;
    }
    purgeHistory() {
        fs.removeSync(path.join(app.getPath('appData'), app.getName(), 'downloadHistory.json'));
        this._history = [];
    }
    purgeQueue() {
        this._queue = new Map();
        this.saveQueue();
        this._emit('download-queue-clear', null);
    }
    setFfmpegPath(path) {
        this._ffmpegPath = path;
    }
    setFfprobePath(path) {
    }
    detectFFMPEG() {
        return new Promise((resolve, reject) => {
            exec(`${this._ffmpegPath} --help`, (error, stdout, stderr) => {
                if (error) {
                    console.log(error);
                    return resolve(false);
                }
                return resolve(true);
            });
        });
    }
    saveQueue() {
        let spread = JSON.stringify([...this._queue]);
        fs.writeFile(path.join(app.getPath('appData'), app.getName(), 'download-queue-v2.json'), spread, 'utf8', (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
    saveHistory() {
        if (!this._appSettings.get('downloads.history')) {
            return;
        }
        fs.writeFile(path.join(app.getPath('appData'), app.getName(), 'downloadHistory.json'), JSON.stringify(this._history), 'utf8', (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
    loadQueue() {
        fs.readFile(path.join(app.getPath('appData'), app.getName(), 'download-queue-v2.json'), 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            }
            else {
                try {
                    this._queue = new Map(JSON.parse(data));
                }
                catch (err) {
                    console.error(err);
                }
            }
            if (this._queue.size > 0) {
                for (let [key, playlist] of this._queue) {
                    this._emit('download-queued', { uuid: key, display: `${playlist.user.name}: ${playlist.video.id}` });
                }
                this.loop();
            }
        });
    }
    loadHistory() {
        if (!this._appSettings.get('downloads.history')) {
            return;
        }
        fs.readFile(path.join(app.getPath('appData'), app.getName(), 'downloadHistory.json'), 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                this._history = [];
            }
            else {
                try {
                    this._history = JSON.parse(data);
                }
                catch (err) {
                    console.log(err);
                    this._history = [];
                }
            }
        });
    }
}
exports.DownloadManager = DownloadManager;