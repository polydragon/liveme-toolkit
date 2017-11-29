import { Component, OnInit } from '@angular/core';
import { LiveMeService } from '../../services/live-me.service';
import { User, Replay, UserSearch, ReplaySearch } from '../../models';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ElectronService } from 'app/services/electron.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    type: string;

    users: UserSearch[];
    replays: ReplaySearch[];
    hashtags: Replay[];

    error: string;

    constructor(
        private liveme: LiveMeService,
        private router: Router,
        private title: Title,
        public electron: ElectronService
    ) { }

    ngOnInit() {
        this.title.setTitle('Search - Live.me Toolkit');
    }

    searchSubmitted($event) {
        this.type = $event.type;

        switch ($event.type) {
            case 'Username':
                this.loadUsers($event.term);
                break;

            case 'User ID':
                this.loadUser($event.term);
                break;

            case 'Video ID':
                this.loadVideo($event.term);
                break;

            case 'Hashtag':
                this.loadHashtaggedVideos($event.term);
                break;
        }
    }

    loadUsers(username: string) {
        this.liveme.getUsernames(username)
            .then((users) => this.users = users);
    }

    loadUser(id: string) {
        this.router.navigateByUrl(`u/${id}`);
    }

    loadVideo(id: string) {
        this.liveme.getReplay(id)
            .then((replay) => {
                this.replays = [replay];
            })
            .catch(err => {
                this.error = 'Unable to search at this time';
            });
    }

    loadHashtaggedVideos(tag: string) {
        this.liveme.getHashtaggedReplays(tag)
            .then((replays) => {
                this.replays = replays;
            })
            .catch(err => {
                this.error = 'Unable to search at this time';
            });
    }
}
