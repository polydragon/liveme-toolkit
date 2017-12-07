import { Component, OnInit } from '@angular/core';
import { Live } from 'app/models';
import { LiveMeService } from 'app/services/live-me.service';
import { Title } from '@angular/platform-browser';
import { ElectronService } from 'app/services/electron.service';

@Component({
    selector: 'lmt-live',
    templateUrl: './live.component.html',
    styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit {
    loading: boolean = false;
    error: string;
    streams: Live[] = [];
    tabIndex: number = 0;

    constructor(
        private liveme: LiveMeService,
        private title: Title,
        public electron: ElectronService
    ) { }

    ngOnInit() {
        this.loadStreams();
        this.title.setTitle('Live Streams - Live.me Toolkit');
    }

    set(index: number) {
        this.tabIndex = index;
        this.loadStreams();
    }

    private getData() {
        switch (this.tabIndex) {
            default:
            case 0:
                return this.liveme.getLiveNew();

            case 1:
                return this.liveme.getLiveMale();

            case 2:
                return this.liveme.getLiveFemale();
        }
    }

    loadStreams() {
        this.loading = true;
        this.streams = null;
        this.error = null;

        this.getData()
            .then((streams) => {
                this.streams = streams;
                this.loading = false;
            })
            .catch(err => {
                this.loading = false;
                this.error = 'Unable to get the live streams at this time';
            });
    }
}
