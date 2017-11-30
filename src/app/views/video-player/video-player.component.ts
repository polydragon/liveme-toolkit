import { Component, OnInit, ViewChild, Input } from '@angular/core';
import * as Hls from 'hls.js';
import { ActivatedRoute } from '@angular/router';
import { LiveMeService } from '../../services/live-me.service';
import { Title } from '@angular/platform-browser';
import { ElectronService } from 'app/services/electron.service';

@Component({
    selector: 'lmt-video-player-view',
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {
    chatMessages;
    startTime;

    chatEnabled: boolean = false;
    chatError: string;
    hlsError: string;

    @ViewChild('video') video: HTMLVideoElement;

    private hls: Hls;

    constructor(
        private route: ActivatedRoute,
        private liveme: LiveMeService,
        private title: Title,
        private electron: ElectronService
    ) { }

    ngOnInit() {
        this.title.setTitle('Replay - Live.me Toolkit');
        this.video = this.video['nativeElement'];
        this.hls = new Hls({ autoStartLoad: true });
        this.hls.attachMedia(this.video);

        this.route.queryParams.subscribe((params) => {
            this.loadVideo(decodeURIComponent(params.url));
            this.startTime = +params.start;

            this.chatEnabled = this.electron.settings.get('video.chat');

            if (this.chatEnabled) {
                this.liveme
                    .getChatMessages(decodeURIComponent(params.chat))
                    .then((messages) => {
                        if (messages.length == 0) {
                            this.chatError = 'There were no messages sent';
                        }

                        this.chatMessages = messages;
                    })
                    .catch(err => {
                        this.chatError = 'Unable to retrieve the messages at this time';
                    });
            }
        });
    }

    loadVideo(source) {
        this.hls.loadSource(source);
    }

    getMessageTimeOffset(time) {
        return 0; // TODO
    }
}
