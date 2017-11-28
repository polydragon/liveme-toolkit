import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../services/electron.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'lmt-likes',
    templateUrl: './likes.component.html',
    styleUrls: ['./likes.component.scss']
})
export class LikesComponent implements OnInit {
    filter: string;
    
    constructor(
        public electron: ElectronService,
        private title: Title
    ) { }

    ngOnInit() {
        this.title.setTitle('Likes - Live.me Toolkit');
    }
}
