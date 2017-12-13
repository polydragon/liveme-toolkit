import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { LiveMeService } from '../../services/live-me.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models';
import { ElectronService } from '../../services/electron.service';

@Component({
    selector: 'lmt-user-following',
    templateUrl: './user-following.component.html',
    styleUrls: ['./user-following.component.scss']
})
export class UserFollowingComponent implements OnInit {
    following: User[];
    filter: string;
    error: string;

    constructor(
        private title: Title,
        private route: ActivatedRoute,
        private liveme: LiveMeService,
        public electron: ElectronService
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            let id = params['id'];

            this.liveme.getFollowing(id).then((f) => {
                this.following = f;

                if (this.following.length == 0) {
                    this.error = 'This user is not following anyone';
                }
            })
            .catch(err => {
                this.error = 'Unable to retrieve who the user is following at this time';
            })
        });

        this.route.queryParams.subscribe(params => {
            this.title.setTitle(`${params['name']} is following - Live.me Toolkit`);
        });
    }
}
