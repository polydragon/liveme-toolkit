import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserFollowersComponent } from './views/user-followers/user-followers.component';
import { UserFansComponent } from './views/user-fans/user-fans.component';
import { UserComponent } from './views/user/user.component';
import { VideoPlayerComponent } from './views/video-player/video-player.component';
import { SearchComponent } from './views/search/search.component';
import { FavouritesComponent } from './views/favourites/favourites.component';
import { LikesComponent } from './views/likes/likes.component';
import { LiveComponent } from 'app/views/live/live.component';

const appRoutes: Routes = [
    { path: '', redirectTo: 'search', pathMatch: 'full' },
    { path: 'search', component: SearchComponent },
    { path: 'u/:id', component: UserComponent },
    { path: 'u/:id/following', component: UserFollowersComponent },
    { path: 'u/:id/fans', component: UserFansComponent },
    { path: 'video', component: VideoPlayerComponent },
    { path: 'favourites', component: FavouritesComponent },
    { path: 'likes', component: LikesComponent },
    { path: 'live', component: LiveComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, { useHash: true })
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }