import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LiveMeService } from '../../services/live-me.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models';
import { ElectronService } from '../../services/electron.service';

@Component({
    selector: 'lmt-user-fans',
    templateUrl: './user-fans.component.html',
    styleUrls: ['./user-fans.component.scss']
})
export class UserFansComponent implements OnInit {
    fans: User[];
    filter: string;

    constructor(
        private title: Title,
        private route: ActivatedRoute,
        private liveme: LiveMeService,
        public electron: ElectronService
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            let id = params['id'];

            this.liveme.getFans(id).then((fans) => {
                this.fans = fans;
            });
        });

        this.route.queryParams.subscribe(params => {
            this.title.setTitle(`${params['name']}'s fans - Live.me Toolkit`);
        });
    }
}
