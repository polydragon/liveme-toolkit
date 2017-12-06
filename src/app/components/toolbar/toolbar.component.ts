import { Component } from '@angular/core';
import { ElectronService } from '../../services/electron.service';
import { SettingsComponent } from 'app/forms/settings/settings.component';
import { MatDialog } from '@angular/material';
import { DownloadService } from 'app/services/download.service';

@Component({
    selector: 'lmt-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
    constructor(
        public electron: ElectronService,
        private dialog: MatDialog,
        public download: DownloadService
    ) { }

    openSettings() {
        this.dialog.open(SettingsComponent);
    }
}
