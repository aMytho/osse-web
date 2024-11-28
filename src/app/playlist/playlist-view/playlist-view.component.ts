import { Component, Input, numberAttribute } from '@angular/core';
import { ConfigService } from '../../shared/services/config/config.service';
import { Playlist } from '../../shared/services/playlist/Playlist';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { EditPlaylist } from './editPlaylistModel';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { mdiPencil, mdiPlaylistPlay, mdiTrashCan } from '@mdi/js';
import { PlaylistService } from '../../shared/services/playlist/playlist.service';
import { TrackService } from '../../shared/services/track/track.service';
import { ToastService } from '../../toast-container/toast.service';

@Component({
    selector: 'app-playlist-view',
    imports: [HeaderComponent, ButtonComponent, IconComponent, CommonModule, FormsModule],
    templateUrl: './playlist-view.component.html',
    styles: ``
})
export class PlaylistViewComponent {
  @Input({ transform: numberAttribute })
  set id(id: number) {
    this.getPlaylist(id);
  }

  pencil = mdiPencil;
  trash = mdiTrashCan;
  play = mdiPlaylistPlay;

  public playlist!: Playlist;
  public showEditMenu = false;
  public ready = false;
  public model = new EditPlaylist('');

  constructor(
    private configService: ConfigService, private router: Router,
    private playlistService: PlaylistService,
    private trackService: TrackService,
    private notificationService: ToastService
  ) { }

  public delete() {
    fetch(this.configService.get('apiURL') + 'playlists/' + this.playlist.id, {
      method: 'DELETE',
    }).then((_r) => {
      this.router.navigate(['/playlists']);
    })
  }

  public async edit() {
    let req = await fetch(this.configService.get('apiURL') + 'playlists/' + this.playlist.id, {
      method: 'PATCH',
      body: JSON.stringify({
        name: this.model.name
      }),
      headers: [
        ['Content-Type', 'application/json']
      ]
    });

    if (req.ok) {
      this.getPlaylist(this.playlist.id);
      this.showEditMenu = false;
    }
  }

  public addTracksToQueue() {
    for (let track of this.playlist.tracks) {
      this.trackService.addTrack(track);
    }

    this.notificationService.info('Added ' + this.playlist.tracks.length + ' tracks');
  }

  private async getPlaylist(id: number) {
    this.playlist = await this.playlistService.getPlaylist(id);
    await this.playlist.requestTracks();
    this.model.name = this.playlist.name;
    this.ready = true;
  }
}

