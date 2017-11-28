import { Component, OnInit, OnDestroy } from '@angular/core';
import { LiveMeService } from '../../services/live-me.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ElectronService } from '../../services/electron.service';
import { UserExtended, Replay } from '../../models';
import { Router } from '@angular/router';
import 'rxjs/Rx';
import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';

@Component({
    selector: 'lmt-user-view',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
    private sub: any;

    user: UserExtended;
    replays: Replay[];

    userError: string;
    replayError: string;

    constructor(
        private title: Title,
        private route: ActivatedRoute,
        private router: Router,
        private liveme: LiveMeService,
        public electron: ElectronService,
        private changeDetector: ChangeDetectorRef,
        private zone: NgZone
    ) { }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.user = null;
            this.replays = null;
            this.title.setTitle(`Looking up user info - Live.me Toolkit`);

            this.liveme
                .getUser(params['id'])
                .then((user) => {
                    this.user = user;
                    (<any>this.user).lastViewed = this.electron.lastViewed(this.user.uid);
                    this.electron.updateViewed(this.user.uid);
                    this.title.setTitle(`${this.user.uname} - Live.me Toolkit`);
                })
                .catch(err => {
                    this.userError = 'Unable to retrieve the user at this time';
                });

            this.liveme
                .getUserReplays(params['id'])
                .then((replays) => {
                    this.replays = replays;
                })
                .catch(err => {
                    this.replayError = 'Unable to retrieve the user\'s replays at this time';
                });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    handleFavourite() {
        if (this.electron.isFavourite(this.user.uid)) {
            this.electron.removeFavourite(this.user.uid);
        } else {
            this.electron.addFavourite(this.user.uid, this.user.face, this.user.sex, this.user.uname);
        }
    }

    handleLike() {
        if (this.electron.isLiked(this.user.uid)) {
            this.electron.removeLike(this.user.uid);
        } else {
            this.electron.addLike(this.user.uid, this.user.face, this.user.sex, this.user.uname);
        }
    }
}