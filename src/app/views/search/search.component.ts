import { Component, OnInit } from '@angular/core';
import { LiveMeService } from '../../services/live-me.service';
import { User, Replay } from '../../models';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    type: string;

    users: User[];
    replays: Replay[];
    replay: Replay;
    hashtags: Replay[];

    error: string;

    constructor(
        private liveme: LiveMeService,
        private router: Router,
        private title: Title
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

    }

    loadUser(id: string) {
        this.router.navigateByUrl(`u/${id}`);
    }

    loadVideo(id: string) {
        this.liveme.getReplay(id)
            .then((replay) => {
                if (this.replay.vid) {
                    this.replay = replay;
                } else {
                    this.error = 'Replay not found';
                }
            })
            .catch(err => {
                this.error = 'Unable to search at this time';
            });
    }

    loadHashtaggedVideos(tag: string) {

    }
}
