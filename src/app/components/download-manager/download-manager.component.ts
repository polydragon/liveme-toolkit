import { Component } from '@angular/core';
import { DownloadService } from 'app/services/download.service';
import { downloaderAnim, downloaderItemAnim } from 'app/animations';

@Component({
    selector: 'lmt-download-manager',
    templateUrl: './download-manager.component.html',
    styleUrls: ['./download-manager.component.scss'],
    animations: [ downloaderAnim, downloaderItemAnim ]
})
export class DownloadManagerComponent {
    constructor(
        public download: DownloadService
    ) { }
}
