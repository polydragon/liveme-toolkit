import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'app/services/electron.service';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'lmt-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    downloadPath: string;
    downloadFfmpeg: string;
    downloadHistory: boolean;
    downloadtemplate: string;
    useTemplate: boolean;
    videoChat: boolean;

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
        this.videoChat = this.electron.settings.get('video.chat');
    }

    onSave() {
        this.electron.settings.set('download.path', this.downloadPath);
        this.electron.settings.set('download.ffmpeg', this.downloadFfmpeg);
        this.electron.settings.set('download.history', this.downloadHistory);
        this.electron.settings.set('download.useTemplate', this.useTemplate);
        this.electron.settings.set('download.template', this.downloadtemplate);
        this.electron.settings.set('video.chat', this.videoChat);
        this.dialogRef.close();
    }

    checkFfmpeg() {
        // NYI
    }
}
