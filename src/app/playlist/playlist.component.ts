import { Component, OnInit } from '@angular/core';
import { Playlist } from '../shared/services/playlist/Playlist';
import { ConfigService } from '../shared/services/config/config.service';
import { OssePlaylist } from '../shared/services/playlist/osse-playlist';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../shared/services/api.service';
import { HeaderComponent } from '../shared/ui/header/header.component';
import { IconComponent } from '../shared/ui/icon/icon.component';
import { mdiPlus, mdiRefresh } from '@mdi/js';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [RouterLink, HeaderComponent, IconComponent],
  templateUrl: './playlist.component.html',
  styles: ``
})
export class PlaylistComponent implements OnInit {
  public playlists: Playlist[] = [];
  plus = mdiPlus;
  refresh = mdiRefresh;

  constructor(
    private configService: ConfigService, private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refreshPlaylistList();
  }

  public async createPlaylist() {
    let request = await fetch(this.configService.get('apiURL') + 'playlists', {
      method: 'POST',
      body: JSON.stringify({
        'name': "Default"
      }),
      headers: [
        ['Content-Type', 'application/json']
      ]
    });

    if (request.ok) {
      let res = await request.json();
      this.router.navigateByUrl("playlists/view/" + res.id);
    }
  }

  public async refreshPlaylistList() {
    let request = await fetch(this.configService.get('apiURL') + 'playlists');
    let result = await request.json();
    this.playlists = result.map((p: OssePlaylist) => new Playlist(p, this.apiService));
  }
}
