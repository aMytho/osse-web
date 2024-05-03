import { Routes } from '@angular/router';
import { PlayerComponent } from './player/player.component';
import { TrackListComponent } from './track-list/track-list.component';

export const routes: Routes = [
    {
        path: 'tracks',
        component: TrackListComponent
    },
    {
        path: '**',
        component: PlayerComponent
    }
];
