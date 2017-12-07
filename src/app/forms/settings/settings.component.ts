import { Component, OnInit, OnDestroy } from '@angular/core';
import { ElectronService } from 'app/services/electron.service';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'lmt-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
    downloadPath: string;
    downloadFfmpeg: string;
    downloadHistory: boolean;
    downloadChat: boolean;
    downloadtemplate: string;
    useTemplate: boolean;
    videoChat: boolean;

    event;

    constructor(
        private dialogRef: MatDialogRef<SettingsComponent>,
        public electron: ElectronService
    ) { }

    ngOnInit() {
        this.downloadPath = this.electron.settings.get('download.path');
        this.downloadFfmpeg = this.electron.settings.get('download.ffmpeg');
        this.downloadHistory = this.electron.settings.get('download.history');
        this.useTemplate = this.electron.settings.get('download.useTemplate');
        this.downloadtemplate = this.electron.settings.get('download.template');
        this.downloadChat = this.electron.settings.get('download.chat');
        this.videoChat = this.electron.settings.get('video.chat');

        this.event = this.electron.events.subscribe((e) => {
            if (e.event == 'openDirectoryResult' && e.uid == 'settingsDownloadPath') {
                this.downloadPath = e.result;
            } else if (e.event == 'openFileResult' && e.uid == 'settingsFfmpegPath') {
                this.downloadFfmpeg = e.result;
            }
        });
    }

    ngOnDestroy() {
        this.event.unsubscribe();
    }

    onSave() {
        this.electron.settings.set('download.path', this.downloadPath);
        this.electron.settings.set('download.ffmpeg', this.downloadFfmpeg);
        this.electron.settings.set('download.history', this.downloadHistory);
        this.electron.settings.set('download.chat', this.downloadChat);
        this.electron.settings.set('download.useTemplate', this.useTemplate);
        this.electron.settings.set('download.template', this.downloadtemplate);
        this.electron.settings.set('video.chat', this.videoChat);
        this.electron.settings.save();
        this.dialogRef.close();
    }

    checkFfmpeg() {
        // NYI
    }

    browseDownload() {
        this.electron.openDirectoryWindow('settingsDownloadPath');
    }

    browseFfmpeg() {
        this.electron.openFileWindow('settingsFfmpegPath');
    }
}
