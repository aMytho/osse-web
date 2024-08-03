import { Component, Input } from '@angular/core';
import { ConfigService } from '../../shared/services/config/config.service';
import { Playlist } from '../../shared/services/playlist/Playlist';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-playlist-view',
  standalone: true,
  imports: [HeaderComponent, FontAwesomeModule],
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

  pencil = faPencil;

  public playlist!: Playlist;
  public showEditMenu = false;

  constructor(private configService: ConfigService) {}
}
