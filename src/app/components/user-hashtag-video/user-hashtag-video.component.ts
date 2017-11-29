import { Component, Input } from '@angular/core';
import { ElectronService } from '../../services/electron.service';
import { Replay } from '../../models';

@Component({
    selector: 'lmt-hashtag-video',
    templateUrl: './user-hashtag-video.component.html',
    styleUrls: ['./user-hashtag-video.component.scss']
})
export class UserHashtagVideoComponent {
    @Input() replay: Replay;

    constructor(
        public electron: ElectronService
    ) { }

    get videoURL() {
        return this.replay.videosource;
    }
}
