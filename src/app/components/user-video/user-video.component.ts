import { Component, Input } from '@angular/core';
import { ElectronService } from '../../services/electron.service';
import { Replay } from '../../models';

@Component({
    selector: 'lmt-user-video',
    templateUrl: './user-video.component.html',
    styleUrls: ['./user-video.component.scss']
})
export class UserVideoComponent {
    @Input() replay: Replay;
    @Input() isNew: number;

    constructor(
        public electron: ElectronService
    ) { }

    get videoURL() {
        return this.replay.hlsvideosource;
    }
}
