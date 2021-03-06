import { Component, OnInit, OnDestroy } from '@angular/core';
import { LiveMeService } from '../../services/live-me.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ElectronService } from '../../services/electron.service';
import { UserExtended, Replay } from '../../models';
import { DownloadService } from 'app/services/download.service';

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

    sortType = 'Newest';
    sortTypes = [
        'Newest',
        'Views',
        'Likes',
        'Shares'
    ];

    constructor(
        private title: Title,
        private route: ActivatedRoute,
        private liveme: LiveMeService,
        public electron: ElectronService,
        public download: DownloadService
    ) { }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.user = null;
            this.replays = null;
            this.sortType = 'Newest';
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
                    if (err == 'api error: user not exist') {
                        this.userError = 'A user does not exist with that ID';
                    } else {
                        this.userError = 'Unable to retrieve the user at this time';
                    }

                    this.title.setTitle(`Couldn't get user details - Live.me Toolkit`);
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

    setSort(type: string) {
        this.sortType = type;

        switch (this.sortType) {
            default:
            case 'Newest':
                this.replays.sort((a, b) => {
                    return b.vtime - a.vtime;
                });
                break;

            case 'Views':
                this.replays.sort((a, b) => {
                    return b.playnumber - a.playnumber;
                });
                break;

            case 'Likes':
                this.replays.sort((a, b) => {
                    return b.likenum - a.likenum;
                });
                break;

            case 'Shares':
                this.replays.sort((a, b) => {
                    return b.sharenum - a.sharenum;
                });
                break;
        }
    }

    isCorruptReplay(url) {
        return url.indexOf('myqcloud') != -1;
    }
}