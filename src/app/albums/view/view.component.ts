import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendar, faFilter, faSearch, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { AlbumTrackComponent } from './album-track/album-track.component';
import { ApiService } from '../../shared/services/api.service';
import { Album } from '../../shared/services/album/Album';
import { ConfigService } from '../../shared/services/config/config.service';
import { TrackService } from '../../shared/services/track/track.service';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [FontAwesomeModule, AlbumTrackComponent],
  templateUrl: './view.component.html',
  styles: ``
})
export class ViewComponent {
  @Input()
  set id(id: number) {
    this.apiService.getAlbumWithTracks(id).then(val => {
      this.album = val as Album;
      this.loaded = true;

      this.bg = this.configService.get('apiURL', 'localhost:3000') + "tracks/cover?id=" + this.album.tracks[0].id;
    });
  }
  public album!: Album;
  public loaded: boolean = false;

  public bg: string = "";
  search = faSearch;
  filter = faFilter;
  
  constructor(
    private apiService: ApiService, private configService: ConfigService,
    private trackService: TrackService
  ) {}

  public addAll() {
    this.album.tracks.forEach((t) => this.trackService.addTrack(t));
  }
}
