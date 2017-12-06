import { Component } from '@angular/core';
import { DownloadService } from 'app/services/download.service';

@Component({
  selector: 'lmt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(
        private download: DownloadService
    ) {
        //this.download.addToQueue({ userid: "lol", username: "lols", videotitle: "title", videotime: 0, videoid: '15121727573928468745', m3u8: 'http://1253467418.vod2.myqcloud.com/9d1f19cbvodcq1253467418/60dd14454564972818522614240/playlist_eof.m3u8' });
    }
}