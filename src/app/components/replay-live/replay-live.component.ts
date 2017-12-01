import { Component, Input } from '@angular/core';
import { Live } from 'app/models';
import { ElectronService } from 'app/services/electron.service';

@Component({
  selector: 'lmt-replay-live',
  templateUrl: './replay-live.component.html',
  styleUrls: ['./replay-live.component.scss']
})
export class ReplayLiveComponent {
    @Input() stream: Live;

    constructor(
        public electron: ElectronService
    ) { }
}
