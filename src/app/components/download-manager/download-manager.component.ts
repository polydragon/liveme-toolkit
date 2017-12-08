import { Component, OnInit } from '@angular/core';
import { DownloadService } from 'app/services/download.service';
import { downloaderAnim, downloaderItemAnim } from 'app/animations';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'lmt-download-manager',
    templateUrl: './download-manager.component.html',
    styleUrls: ['./download-manager.component.scss'],
    animations: [ downloaderAnim, downloaderItemAnim ]
})
export class DownloadManagerComponent implements OnInit {
    constructor(
        public download: DownloadService,
        private changeDetector: ChangeDetectorRef
    ) { }

    ngOnInit() {
        setInterval(() => {
            if (this.download.ACTIVE) {
                this.changeDetector.detectChanges();
            }
        }, 1000);
    }
}
