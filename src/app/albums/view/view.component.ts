import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';
import { AlbumTrackComponent } from './album-track/album-track.component';
import { ApiService } from '../../shared/services/api.service';
import { Album } from '../../shared/services/album/Album';
import { ConfigService } from '../../shared/services/config/config.service';
import { TrackService } from '../../shared/services/track/track.service';
import { Track } from '../../shared/services/track/track';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { ToastService } from '../../toast-container/toast.service';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [HeaderComponent, FontAwesomeModule, AlbumTrackComponent],
  templateUrl: './view.component.html',
  styles: ``
})
export class ViewComponent {
  @Input()
  set id(id: number) {
    this.apiService.getAlbumWithTracks(id).then(val => {
      this.album = val as Album;
      this.loaded = true;
      this.filterTracks({target: {value: '.'}})

      this.bg = this.configService.get('apiURL', 'localhost:3000') + "tracks/cover?id=" + this.album.tracks[0].id;
    });
  }
  public album!: Album;
  public loaded: boolean = false;
  public filteredTracks: Track[] = [];

  public bg: string = "";
  search = faSearch;
  filter = faFilter;

  constructor(
    private apiService: ApiService, private configService: ConfigService,
    private trackService: TrackService,
    private notificationService: ToastService
  ) {}

  public addAll() {
    this.album.tracks.forEach((t) => this.trackService.addTrack(t));
    this.notificationService.info('Added ' + this.album.tracks.length + ' tracks');
  }

  public addTrack(track: Track) {
    this.trackService.addTrack(track);
    this.notificationService.info('Added ' + track.title);
  }

  public get totalDuration() {
    let total = 0;
    this.album.tracks.forEach(t => {
      total += t.duration;
    });
    return total;
  }

  public filterTracks(event: any) {
    const regex = new RegExp('%' + event.target.value + "%");
    this.filteredTracks = this.album.tracks.filter((t) => regex.test(t.title))
  }
}

