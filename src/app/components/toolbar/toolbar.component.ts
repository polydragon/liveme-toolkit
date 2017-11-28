import { Component } from '@angular/core';
import { ElectronService } from '../../services/electron.service';

@Component({
    selector: 'lmt-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
    constructor(
        public electron: ElectronService
    ) { }
}
