import { ChangeDetectionStrategy, Component, OnInit, WritableSignal, signal } from '@angular/core';
import { Playlist } from '../shared/services/playlist/Playlist';
import { ConfigService } from '../shared/services/config/config.service';
import { OssePlaylist } from '../shared/services/playlist/osse-playlist';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../shared/ui/header/header.component';
import { IconComponent } from '../shared/ui/icon/icon.component';
import { mdiPlus, mdiRefresh } from '@mdi/js';

@Component({
    selector: 'app-playlist',
    imports: [RouterLink, HeaderComponent, IconComponent],
    templateUrl: './playlist.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: ``
})
export class PlaylistComponent implements OnInit {
  public playlists: WritableSignal<Playlist[]> = signal([]);
  plus = mdiPlus;
  refresh = mdiRefresh;

  constructor(
    private configService: ConfigService,
    private router: Router
  ) { }

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
    this.playlists.set(result.map((p: OssePlaylist) => new Playlist(p)));
  }
}
