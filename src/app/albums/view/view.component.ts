import { Component, Input } from '@angular/core';
import { AlbumTrackComponent } from './album-track/album-track.component';
import { ApiService } from '../../shared/services/api.service';
import { Album } from '../../shared/services/album/Album';
import { ConfigService } from '../../shared/services/config/config.service';
import { TrackService } from '../../shared/services/track/track.service';
import { Track } from '../../shared/services/track/track';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { ToastService } from '../../toast-container/toast.service';
import { BackgroundImageService } from '../../shared/ui/background-image.service';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { mdiFilter, mdiSearchWeb } from '@mdi/js';
import { AlbumFilter } from './album-filter';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [HeaderComponent, IconComponent, AlbumTrackComponent, FormsModule],
  templateUrl: './view.component.html',
  styles: ``
})
export class ViewComponent {
  @Input()
  set id(id: number) {
    this.apiService.getAlbumWithTracks(id).then(val => {
      this.album = val as Album;
      this.loaded = true;
      this.filteredTracks = this.album.tracks;

      this.bg = this.configService.get('apiURL', 'localhost:3000') + "tracks/cover?id=" + this.album.tracks[0].id;
      this.backgroundImageService.setBG(this.bg)
    });
  }
  public album!: Album;
  public loaded: boolean = false;
  public filteredTracks: Track[] = [];
  public filterType = AlbumFilter;
  public chosenFilter: AlbumFilter = AlbumFilter.TrackNumber;

  public bg: string = "";
  search = mdiSearchWeb;
  filter = mdiFilter;

  constructor(
    private apiService: ApiService, private configService: ConfigService,
    private trackService: TrackService,
    private notificationService: ToastService,
    private backgroundImageService: BackgroundImageService
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
    if (event.target.value.trim().length == 0) {
      this.filteredTracks = this.album.tracks;
    } else {
      const regex = new RegExp(event.target.value, 'i');
      this.filteredTracks = this.album.tracks.filter((t) => regex.test(t.title))
    }
  }

  public sortTracks() {
    if (this.chosenFilter == AlbumFilter.Alphabetical) {
      this.filteredTracks.sort((a, b) => {
        if (a.title.toLowerCase() < b.title.toLowerCase()) {
          return -1;
        }
        if (a.title.toLowerCase() > b.title.toLowerCase()) {
          return 1;
        }
        return 0;
      });
    } else if (this.chosenFilter = AlbumFilter.Random) {
      this.filteredTracks = this.filteredTracks
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    } else {
      // Sort by track number
      this.filteredTracks.sort((a, b) => (a.trackNumber ?? 0) - (b.trackNumber ?? 0));
    }
  }
}

