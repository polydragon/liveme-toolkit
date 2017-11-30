import { Component, OnInit } from '@angular/core';
import { Live } from 'app/models';
import { LiveMeService } from 'app/services/live-me.service';

@Component({
    selector: 'lmt-live',
    templateUrl: './live.component.html',
    styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit {
    type: string = 'live';
    newType: string = 'live';
    loading: boolean = false;
    error: string;
    streams: Live[] = [];

    constructor(
        private liveme: LiveMeService
    ) { }

    ngOnInit() {
        this.loadStreams();
    }

    private getData() {
        switch (this.type) {
            default:
            case 'live':
                return this.liveme.getLiveNew();

            case 'male':
                return this.liveme.getLiveMale();

            case 'female':
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
                console.log(err);
            });
    }

    onChanged() {
        this.type = this.newType;
        this.loadStreams();
    }
}
