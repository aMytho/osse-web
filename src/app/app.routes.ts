import { Routes } from '@angular/router';
import { PlayerComponent } from './player/player.component';
import { TrackListComponent } from './track-list/track-list.component';
import { AlbumsComponent } from './albums/albums.component';

export const routes: Routes = [
    {
        path: 'tracks',
        component: TrackListComponent
    },
    {
        path: 'albums',
        component: AlbumsComponent
    },
    {
        path: '**',
        component: PlayerComponent
    }
];
