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
    loading: boolean = false;

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
        let query = $event.term ? $event.term.trim() : null;

        if (!query || query.length == 0) {
            return;
        }

        this.type = $event.type;
        this.loading = true;

        this.users = null;
        this.replays = null;
        this.hashtags = null;
        this.error = null;

        switch ($event.type) {
            case 'Username':
                this.loadUsers(query);
                break;

            case 'User ID':
                this.loadUser(query);
                break;

            case 'Video ID':
                this.loadVideo(query);
                break;

            case 'Hashtag':
                this.loadHashtaggedVideos(query);
                break;
        }
    }

    loadUsers(username: string) {
        this.liveme.getUsernames(username)
            .then((users) => {
                this.loading = false;
                this.users = users;

                if (this.users.length == 0) {
                    this.error = 'No usernames were found with that search term';
                }
            })
            .catch(err => {
                this.error = 'Unable to search at this time';
                console.log(err);
            });
    }

    loadUser(id: string) {
        this.router.navigateByUrl(`u/${id}`);
    }

    loadVideo(id: string) {
        this.liveme.getReplay(id)
            .then((replay) => {
                this.loading = false;

                if (!replay) {
                    this.error = 'No replays were found with that ID';
                } else {
                    this.replays = [replay];
                }
            })
            .catch(err => {
                this.error = 'Unable to search at this time';
                console.log(err);
            });
    }

    loadHashtaggedVideos(tag: string) {
        this.liveme.getHashtaggedReplays(tag)
            .then((replays) => {
                this.loading = false;
                this.replays = replays;

                if (this.replays.length == 0) {
                    this.error = 'No replays were found with that hashtag';
                }
            })
            .catch(err => {
                this.error = 'Unable to search at this time';
                console.log(err);
            });
    }
}
