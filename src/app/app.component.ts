import { Component, OnInit } from '@angular/core';
import { DownloadService } from 'app/services/download.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'lmt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(
        private download: DownloadService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params.downloader == 1) {
                this.download.onInit();
            }
        });
    }
}