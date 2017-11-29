import { Component, OnInit } from '@angular/core';
import { ElectronService } from 'app/services/electron.service';

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

    constructor(
        public electron: ElectronService
    ) { }

    ngOnInit() {
        this.downloadPath = this.electron.settings.get('download.path');
        this.downloadFfmpeg = this.electron.settings.get('download.ffmpeg');
        this.downloadHistory = this.electron.settings.get('download.history');
        this.useTemplate = this.electron.settings.get('download.useTemplate');
        this.downloadtemplate = this.electron.settings.get('download.templte');
    }

}
