import { Routes } from '@angular/router';
import { TrackListComponent } from './track-list/track-list.component';
import { AlbumsComponent } from './albums/albums.component';
import { HomeComponent } from './home/home.component';

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
        component: HomeComponent
    }
];
