import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import * as Electron from 'electron';

@Injectable()
export class ElectronService {
    private _electron: Electron.AllElectron = null;
    events: EventEmitter<any> = new EventEmitter();

    constructor(
        private router: Router,
        private zone: NgZone
    ) {
        if (this.electron) {
            this.electron.ipcRenderer.on('ELECTRON_BRIDGE_CLIENT', (event, msg) => {
                this.zone.run(() => {
                    if (msg.event && msg.event == 'openProfile') {
                        return this.router.navigateByUrl(`/u/${msg.uid}`);
                    }

                    this.events.emit(msg);
                });
            });
        }
    }

    get userManager() {
        return this.zone.run(() => {
            return this.electron.remote.getGlobal('UserManager');
        });
    }

    get settings() {
        return this.zone.run(() => {
            return this.electron.remote.getGlobal('Settings');
        });
    }

    /* Likes */

    isLiked(uid: string): boolean {
        return this.userManager.likes.has(uid);
    }

    addLike(uid: string, face: string, sex: number, uname: string) {
        this.userManager.addLike(uid, face, uname, sex);
    }

    removeLike(uid: string) {
        this.userManager.removeLike(uid);
    }

    /* Favourites */

    isFavourite(uid: string): boolean {
        return this.userManager.favourites.has(uid);
    }

    addFavourite(uid: string, face: string, sex: number, uname: string) {
        this.userManager.addFavourite(uid, face, uname, sex);
    }

    removeFavourite(uid: string) {
        this.userManager.removeFavourite(uid);
    }

    /* Viewed */

    lastViewed(uid: string): number {
        return this.userManager.viewed.get(uid) || -1;
    }

    updateViewed(uid: string) {
        this.userManager.updateViewed(uid, +new Date());
    }

    clearViewed() {
        this.userManager.clearViewed();
    }

    /* Windows */

    openProfile(uid: string) {
        this.send({ event: 'openProfile', uid: uid });;
    }

    openFollowingWindow(uid: string, username: string) {
        this.send({ event: 'openFollowingWindow', uid: uid, uname: username });
    }

    openFansWindow(uid: string, username: string) {
        this.send({ event: 'openFansWindow', uid: uid, uname: username });
    }

    openVideoPlayer(url: string, chat: string, start: string) {
        this.send({ event: 'openVideoPlayer', url: url, chat: chat, start: start });
    }

    openFavouritesWindow() {
        this.send({ event: 'openFavouritesWindow' });
    }

    openLikesWindow() {
        this.send({ event: 'openLikesWindow' });
    }

    copyToClipboard(text: string) {
        this.clipboard.writeText(text);
    }

    // Generic Stuff

    send(data: any): void {
        if (this.ipcRenderer) {
            this.ipcRenderer.send('ELECTRON_BRIDGE_HOST', data);
        }
    }

    get ipcRenderer(): Electron.IpcRenderer {
        return this.electron.ipcRenderer || null;
    }

    get desktopCapturer(): Electron.DesktopCapturer {
        return this.electron.desktopCapturer || null;
    }

    get webFrame(): Electron.WebFrame {
        return this.electron.webFrame || null;
    }

    get remote(): Electron.Remote {
        return this.electron.remote || null;
    }

    get clipboard(): Electron.Clipboard {
        return this.electron.clipboard || null;
    }

    get crashReporter(): Electron.CrashReporter {
        return this.electron.crashReporter || null;
    }

    get nativeImage(): Electron.NativeImage {
        return <any>this.electron.nativeImage || null;
    }

    get screen(): Electron.Screen {
        return this.electron.screen || null;
    }

    get shell(): Electron.Shell {
        return this.electron.shell || null;
    }

    get electron() {
        if (!this._electron) {
            this._electron = (<any>window).require('electron');
        }

        return this._electron;
    }
}