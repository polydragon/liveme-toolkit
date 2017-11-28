import { Component, Input } from '@angular/core';
import { Replay } from '../../models';

@Component({
    selector: 'lmt-hashtag-video',
    templateUrl: './user-hashtag-video.component.html',
    styleUrls: ['./user-hashtag-video.component.scss']
})
export class UserHashtagVideoComponent {
    @Input() replay: Replay;

    constructor() { }
}
