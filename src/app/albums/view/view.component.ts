import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendar, faFilter, faSearch, faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { AlbumTrackComponent } from './album-track/album-track.component';
import { ApiService } from '../../shared/services/api.service';
import { Album } from '../../shared/services/album/Album';
import { ConfigService } from '../../shared/services/config/config.service';

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

  public bg: string = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.wikia.nocookie.net%2Fgensin-impact%2Fimages%2F3%2F39%2FThe_Wind_and_The_Star_Traveler.png%2Frevision%2Flatest%3Fcb%3D20220126025606&f=1&nofb=1&ipt=5f807cbb82b211c04cfc30e7da2888613a53c4e98e0bbc1372c303e007a0df49&ipo=images";
  search = faSearch;
  filter = faFilter;
  
  constructor(private apiService: ApiService, private configService: ConfigService) {}

}
