import { Routes } from '@angular/router';
import { TrackListComponent } from './track-list/track-list.component';
import { AlbumsComponent } from './albums/albums.component';
import { HomeComponent } from './home/home.component';
import { ViewComponent as AlbumView } from './albums/view/view.component';

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
        path: 'albums/view/:id',
        component: AlbumView
    },
    {
        path: '**',
        component: HomeComponent
    }
];
