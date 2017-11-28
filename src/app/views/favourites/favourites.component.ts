import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../services/electron.service';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'lmt-favourites',
    templateUrl: './favourites.component.html',
    styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {
    filter: string;
    
    constructor(
        public electron: ElectronService,
        private title: Title
    ) { }

    ngOnInit() {
        this.title.setTitle('Favourites - Live.me Toolkit');
    }
}
