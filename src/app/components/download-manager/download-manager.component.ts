import { Component } from '@angular/core';
import { DownloadService } from 'app/services/download.service';

@Component({
    selector: 'lmt-download-manager',
    templateUrl: './download-manager.component.html',
    styleUrls: ['./download-manager.component.scss']
})
export class DownloadManagerComponent {
    constructor(
        public download: DownloadService
    ) { }
}
