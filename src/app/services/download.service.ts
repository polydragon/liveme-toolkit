import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ElectronService } from 'app/services/electron.service';

import * as pProgress from 'p-progress';
import * as pMap from 'p-map';
import * as sanitizeFilename from 'sanitize-filename';

export interface Playlist {
    userid: string;
    username: string;
    videoid: string;
    videotitle: string;
    videotime: number;
    m3u8: string;

    progress?: number;
    downloadedChunks?: number;
    totalChunks?: number;
    status?: string;

    chunkProgress?: Map<string, number>;
}

@Injectable()
export class DownloadService {
    QUEUE: Playlist[] = [];
    ACTIVE: Playlist;

    downloadHistory: string[] = [];

    isPaused: boolean = false;
    isVisible: boolean = false;
    isReady: boolean = false;

    private FFMPEG_COMMAND: string = '{FFMPEG} -y -f concat -safe 0 -i "{CONCAT}" -c copy -bsf:a aac_adtstoasc -vsync 2 -movflags +faststart "{DEST}"';
    private FFMPEG_CHECK: string = '{FFMPEG} -codecs';

    constructor(
        private http: HttpClient,
        private electron: ElectronService
    ) { }

    onInit() {
        this.loadHistory();
        this.loadQueue();

        this.checkFfmpeg().catch(err => {}); // stop the bitching it's already logged
    }

    wasDownloaded(id: string) {
        return this.downloadHistory.indexOf(id) != -1;
    }

    setDownloaded(id: string) {
        this.downloadHistory.push(id);
    }

    checkFfmpeg() {
        return new Promise((resolve, reject) => {
            let ffmpeg = this.electron.settings.get('download.ffmpeg');

            if (ffmpeg.indexOf(' ') != -1) {
                ffmpeg = `"${ffmpeg}"`;
            }

            this.electron.exec(this.FFMPEG_CHECK.replace("{FFMPEG}", ffmpeg), (error, stdout, stderr) => {
                if (error) {
                    this.electron.logger.error('Ffmpeg error: ', stdout);
                    this.isReady = false;
                    return reject();
                }

                if (stdout.indexOf('h264') != -1) {
                    this.isReady = true;
                    return resolve();
                } else {
                    this.electron.logger.error('Unknown error with ffmpeg: ', stdout);
                    this.isReady = false;
                    return reject();
                }
            });
        });
    }

    addToQueue(p: Playlist) {
        p.status = 'queued';

        this.QUEUE.push(p);
        this.saveQueue();
        this.loop();
    }

    removeFromQueueIndex(index: number) {
        this.QUEUE.splice(index, 1);
    }

    togglePaused() {
        if (this.isPaused) {
            this.isPaused = false;
            this.loop();
        } else {
            this.isPaused = true;
        }
    }

    async loop() {
        if (this.isPaused || this.ACTIVE || !this.isReady) return;

        while (this.QUEUE.length > 0) {
            this.ACTIVE = this.QUEUE.shift();

            this.ACTIVE.downloadedChunks = 0;
            this.ACTIVE.totalChunks = 0;
            this.ACTIVE.progress = 0;
            this.ACTIVE.chunkProgress = new Map<string, number>();

            await this._processActiveItem().then(() => {
                this.ACTIVE = null;

                this.saveHistory();
                this.saveQueue();
            }).catch(err => {
                this.electron.logger.error('Failed to download a replay: ' + JSON.stringify(this.ACTIVE), err);
                this.ACTIVE = null;

                this.saveHistory();
                this.saveQueue();
            });
        }
    }

    private _getUrls(): Promise<string[]> {
        this.ACTIVE.status = 'finding chunks...';

        return this.http.get(this.ACTIVE.m3u8, { responseType: 'text' })
            .toPromise()
            .then(response => {
                let playlist = [], baseURL = this.electron.path.dirname(this.ACTIVE.m3u8);

                for (let line of response.split('\n')) {
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

                this.ACTIVE.totalChunks = playlist.length;
                return playlist;
            });
    }

    private _updateProgress() {
        let total = 0;

        for (let val of this.ACTIVE.chunkProgress.values()) {
            if (val) {
                total += val;
            }
        }

        this.ACTIVE.progress = Math.floor((total / this.ACTIVE.totalChunks) * 100);
    }

    private _downloadChunk(url: string, destination: string) {
        return new Promise((resolve, reject) => {
            this.electron.fs.ensureDirSync(this.electron.path.dirname(destination));
            let download = this.electron.wget.download(url, destination);

            download.on('error', err => reject(err));
            download.on('end', output => resolve(destination));
            download.on('progress', p => {
                this.ACTIVE.chunkProgress.set(url, p);
                this._updateProgress();
            });
        }).then(dest => {
            this.ACTIVE.downloadedChunks++;
            this.ACTIVE.status = `downloading chunks [${this.ACTIVE.downloadedChunks}/${this.ACTIVE.totalChunks}]`;
            return dest;
        }).catch(err => {
            this.electron.logger.error(`Error while downloading chunk: "${url}":`, err);
        });
    }

    private _mergeFiles(files: string[]): Promise<void> {
        return new Promise((resolve, reject) => {
            this.ACTIVE.status = 'merging chunks...';
            let destination = this._getFinalFile();

            if (files.length == 1) {
                if (this.electron.fs.existsSync(destination)) {
                    this.electron.fs.removeSync(destination);
                }

                this.electron.fs.moveSync(files[0], destination);
                return resolve();
            }

            let concatStr = '# Generated by LiveMe Toolkit', concatPath = this._getTempFile('concat.txt');

            for (let file of files) {
                concatStr += `\nfile '${file}'`;
            }

            this.electron.fs.writeFileSync(concatPath, concatStr);
            let fmpeg = this.electron.settings.get('download.ffmpeg');

            if (fmpeg.indexOf(' ') != -1) {
                fmpeg = `"${fmpeg}"`;
            }

            let ffmpeg = this.FFMPEG_COMMAND
                .replace('{FFMPEG}', fmpeg)
                .replace('{CONCAT}', concatPath)
                .replace('{DEST}', destination);

            this.electron.fs.ensureDirSync(this.electron.path.dirname(destination));

            this.electron.exec(ffmpeg, (error, stdout, stderr) => {
                if (error) return reject(error);
                return resolve();
            });
        });
    }

    private _processActiveItem(): Promise<void> {
        this.ACTIVE.status = 'downloading';

        return this
            ._getUrls()
            .then((urls: string[]) => {
                this.ACTIVE.status = `downloading chunks [${this.ACTIVE.downloadedChunks}/${this.ACTIVE.totalChunks}]`;
                let mapper = el => this._downloadChunk(el, this._getTempFile(el));
                return pMap(urls, mapper, { concurrency: 4 });
            })
            .then(localFiles => this._mergeFiles(localFiles))
            .then(() => this._cleanupTempFiles())
            .then((): Promise<void> => {
                return new Promise((resolve, reject) => {
                    this.setDownloaded(this.ACTIVE.videoid);
                    resolve();
                })
            });
    }

    private _cleanupTempFiles(): Promise<void> {
        this.ACTIVE.status = 'cleaning up temporary files';

        return new Promise((resolve, reject) => {
            let dir = this._getTempFile('', false);

            try {
                this.electron.fs.removeSync(dir);
                return resolve();
            } catch (e) {
                this.ACTIVE.status = 'ffmpeg is still using the files, waiting for a few seconds to retry';

                setTimeout(() => {
                    return this._cleanupTempFiles();
                }, 4000);
            }
        });
    }

    private _getFinalFile(): string {
        let defaultPath = this.electron.path.join(this.electron.settings.get('download.path'), sanitizeFilename(this.electron.path.basename(this.ACTIVE.m3u8).replace("m3u8", "mp4")))
        let finalPath;

        if (!this.electron.settings.get('download.useTemplate')) {
            finalPath = defaultPath;
        } else {
            let finalName = this.electron.settings.get('download.template')
                .replace(/%%username%%/ig, this.ACTIVE.username)
                .replace(/%%userid%%/ig, this.ACTIVE.userid)
                .replace(/%%videoid%%/ig, this.ACTIVE.videoid)
                .replace(/%%videotitle%%/ig, this.ACTIVE.videotitle)
                .replace(/%%videotime%%/ig, '' + this.ACTIVE.videotime);

            if (!finalName || finalName.length == 0) {
                finalPath = defaultPath;
            } else {
                finalPath = this.electron.path.join(this.electron.settings.get('download.path'), finalName + '.mp4');

                let base = this.electron.path.basename(finalPath); // So sanitizeFilename doesn't eat any path seperators, allowing for subdirectories
                finalPath = finalPath.replace(base, sanitizeFilename(base));
            }
        }

        let basename = this.electron.path.basename(finalPath);

        if (basename == 'playlist.mp4' || basename == 'playlist_eof.mp4') {
            finalPath = this.electron.path.join(this.electron.path.dirname(finalPath), this.ACTIVE.videoid + '.mp4');
        }

        this.electron.fs.ensureDirSync(this.electron.path.dirname(finalPath));
        return finalPath;
    }

    private _getTempFile(url: string, file: boolean = true): string {
        let filename = file ? this.electron.path.basename(url) : '';
        return this.electron.path.join(this.electron.settings.get('download.path'), 'temp', this.ACTIVE.videoid, filename);
    }

    // Saving & loading

    saveHistory() {
        this.electron.fs.writeFile(
            this.electron.settings.getPathFile('userData', 'download_history.json'),
            JSON.stringify(this.downloadHistory),
            (err) => {
                if (err) {
                    this.electron.logger.error(`Couldn't save download_history.json, error: ${err.message}`);
                }
            });
    }

    loadHistory(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.electron.fs.readFile(
                this.electron.settings.getPathFile('userData', 'download_history.json'),
                'utf8',
                (err, data) => {
                    if (err) {
                        this.electron.logger.error(`Couldn't load download_history.json, error: ${err.message}`);
                        return resolve();
                    } else {
                        try {
                            if (!data || data.length == 0) {
                                this.downloadHistory = [];
                            } else {
                                this.downloadHistory = JSON.parse(data);
                            }

                            return resolve();
                        } catch (er) {
                            this.electron.logger.error(`Malformed json in download_history.json, error: ${err.message}`);
                            return resolve();
                        }
                    }
                });
        });
    }

    saveQueue() {
        this.electron.fs.writeFile(
            this.electron.settings.getPathFile('userData', 'download_queue.json'),
            JSON.stringify(this.QUEUE),
            (err) => {
                if (err) {
                    this.electron.logger.error(`Couldn't save download_queue.json, error: ${err.message}`);
                }
            });
    }

    loadQueue(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.electron.fs.readFile(
                this.electron.settings.getPathFile('userData', 'download_queue.json'),
                'utf8',
                (err, data) => {
                    if (err) {
                        this.electron.logger.error(`Couldn't load download_queue.json, error: ${err.message}`);
                        return resolve();
                    } else {
                        try {
                            if (!data || data.length == 0) {
                                this.QUEUE = [];
                            } else {
                                this.QUEUE = JSON.parse(data);
                                this.loop();
                            }

                            return resolve();
                        } catch (er) {
                            this.electron.logger.error(`Malformed json in download_queue.json, error: ${err.message}`);
                            return resolve();
                        }
                    }
                });
        });
    }
}