import { Component, Input } from '@angular/core';
import { ConfigService } from '../../shared/services/config/config.service';
import { Playlist } from '../../shared/services/playlist/Playlist';

@Component({
  selector: 'app-playlist-view',
  standalone: true,
  imports: [],
  templateUrl: './playlist-view.component.html',
  styles: ``
})
export class PlaylistViewComponent {
  @Input()
  set id(id: number) {
    fetch(this.configService.get('apiURL') + 'playlists/' + id).then(d => {
      d.json().then(d => this.playlist = d);
    })
  }

  public playlist!: Playlist;

  constructor(private configService: ConfigService) {}
}
