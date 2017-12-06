import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressBarModule, MatButtonToggleModule, MatSlideToggleModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule, MatProgressSpinnerModule, MatTooltipModule } from '@angular/material';

import { AppComponent } from './app.component';
import { ElectronService } from './services/electron.service';
import { UserComponent } from './views/user/user.component';
import { UserVideoComponent } from './components/user-video/user-video.component';
import { VideoPlayerComponent } from './views/video-player/video-player.component';
import { UserHashtagVideoComponent } from './components/user-hashtag-video/user-hashtag-video.component';
import { UserFollowersComponent } from './views/user-followers/user-followers.component';
import { UserFansComponent } from './views/user-fans/user-fans.component';
import { AppRoutingModule } from './app-routing.module';
import { LiveMeService } from './services/live-me.service';
import { HttpClientModule } from '@angular/common/http';
import { MomentModule } from 'angular2-moment';
import { DurationPipe } from './pipes/duration.pipe';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { DownloadManagerComponent } from './overlays/download-manager/download-manager.component';
import { SearchComponent } from './views/search/search.component';
import { SearchFormComponent } from './forms/search-form/search-form.component';
import { FavouritesComponent } from './views/favourites/favourites.component';
import { LikesComponent } from './views/likes/likes.component';
import { SettingsComponent } from './forms/settings/settings.component';
import { LiveComponent } from './views/live/live.component';
import { ReplayLiveComponent } from './components/replay-live/replay-live.component';
import { DownloadService } from './services/download.service';

@NgModule({
    declarations: [
        AppComponent,
        UserComponent,
        UserVideoComponent,
        VideoPlayerComponent,
        UserHashtagVideoComponent,
        UserFollowersComponent,
        UserFansComponent,
        DurationPipe,
        ToolbarComponent,
        DownloadManagerComponent,
        SearchComponent,
        SearchFormComponent,
        FavouritesComponent,
        LikesComponent,
        SettingsComponent,
        LiveComponent,
        ReplayLiveComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        MomentModule,

        BrowserAnimationsModule,
        MatProgressBarModule, MatButtonToggleModule, MatSlideToggleModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatToolbarModule, MatIconModule, MatCardModule, MatProgressSpinnerModule, MatTooltipModule
    ],
    providers: [
        ElectronService,
        LiveMeService,
        DownloadService
    ],
    bootstrap: [
        AppComponent
    ],
    entryComponents: [
        DownloadManagerComponent,
        SettingsComponent
    ]
})
export class AppModule { }
