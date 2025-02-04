import { Routes } from '@angular/router';
import { TrackListComponent } from './track-list/track-list.component';
import { AlbumsComponent } from './albums/albums.component';
import { HomeComponent } from './home/home.component';
import { ViewComponent as AlbumView } from './albums/view/view.component';
import { albumViewResolver } from './albums/view/album-view.resolver';
import { LoginComponent } from './login/login.component';
import { isLoggedIn } from './shared/services/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'tracks',
    component: TrackListComponent,
    canActivate: [isLoggedIn]
  },
  {
    path: 'albums',
    component: AlbumsComponent,
    canActivate: [isLoggedIn]
  },
  {
    path: 'albums/view/:id',
    component: AlbumView,
    resolve: {
      album: albumViewResolver
    },
    canActivate: [isLoggedIn]
  },
  {
    path: 'playlists',
    loadComponent: () => import('./playlist/playlist.component').then(c => c.PlaylistComponent),
    canActivate: [isLoggedIn]
  },
  {
    path: 'playlists/view/:id',
    loadComponent: () => import('./playlist/playlist-view/playlist-view.component').then(c => c.PlaylistViewComponent),
    canActivate: [isLoggedIn]
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.component').then(c => c.SettingsComponent),
    canActivate: [isLoggedIn]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [isLoggedIn]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: "**",
    redirectTo: "home",
  }
];
