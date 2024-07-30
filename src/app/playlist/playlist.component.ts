import { Component, OnInit } from '@angular/core';
import { Playlist } from '../shared/services/playlist/Playlist';
import { ConfigService } from '../shared/services/config/config.service';
import { OssePlaylist } from '../shared/services/playlist/osse-playlist';
import { RouterLink } from '@angular/router';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './playlist.component.html',
  styles: ``
})
export class PlaylistComponent implements OnInit {
  public playlists: Playlist[] = [];

  constructor(private configService: ConfigService, private apiService: ApiService) {}
  
  async ngOnInit(): Promise<void> {
    let request = await fetch(this.configService.get('apiURL') + 'playlists');
    let result = await request.json();
    this.playlists = result.map((p: OssePlaylist) => new Playlist(p, this.apiService));
  }
}
