import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TrackService } from '../shared/services/track/track.service';
import { HomeComponent } from '../home/home.component';
import { HeaderComponent } from '../shared/ui/header/header.component';
import { ConfigService } from '../shared/services/config/config.service';
import { Track } from '../shared/services/track/track';
import { ToastService } from '../toast-container/toast.service';

@Component({
  selector: 'app-track-list',
  standalone: true,
  templateUrl: './track-list.component.html',
  styles: ``,
  imports: [HomeComponent, HeaderComponent]
})
export class TrackListComponent implements AfterViewInit, OnInit {
  @ViewChild('search') searchBar!: ElementRef;
  public tracks: Track[] = [];
  public allTracks: Track[] = [];
  private timeout: number = 0;
  private scrollTimeout: number = 0;

  constructor(
    private trackService: TrackService,
    private configService: ConfigService,
    private notificationService: ToastService
  ) { }

  ngAfterViewInit(): void {
    this.searchBar.nativeElement.focus();
    window.addEventListener('scroll', () => {
      const endOfPage = window.innerHeight + window.pageYOffset >= (document.body.offsetHeight * 0.8);
      if (endOfPage) {
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
          this.requestTracks(this.searchBar.nativeElement.value);
        }, 500);
      }
    })
  }

  async ngOnInit(): Promise<void> {
    // On load, get the first 25 tracks
    let req = await fetch(this.configService.get('apiURL') + 'tracks/search');
    if (!req.ok) return;
    let tracks = await req.json();
    tracks.tracks.forEach((track: any) => {
      this.tracks.push(new Track(track));
      this.allTracks.push(new Track(track));
    });
  }

  public onSubmit() {
    for (let track of this.tracks) {
      this.trackService.addTrack(track);
    }
  }

  public addTrack(track: Track) {
    this.trackService.addTrack(track);
    this.notificationService.info('Added ' + track.title);
  }

  public async onInput(ev: any) {
    // Search for tracks. We made a debounce which waits 500ms before sending.
    // Makes it a little easier on the server.

    // If the search input is empty, reset the filter
    if (ev.target.value.length == 0) {
      this.tracks = this.allTracks;
    }

    clearTimeout(this.timeout);
    this.timeout = setTimeout(async () => {
      // Don't search for empty string
      if (ev.target.value.trim() == '') return;
      this.requestTracks(ev.target.value.trim());
    }, 500);
  }

  public async requestTracks(search: string) {
    // Find the amount of track that we have that match the regex.
    let offset = 0;

    if (search.length == 0) {
      offset = this.tracks.length;
    } else {
      const regex = new RegExp('%' + search + "%");
      this.tracks.forEach(val => {
        if (regex.test(val.title)) {
          offset += 1;
        }
      });
      if (offset < 25) {
        offset = 0;
      }
    }

    // Search for tracks
    let req = await fetch(this.configService.get('apiURL')
      + 'tracks/search?'
      + new URLSearchParams({
        track: search,
        track_offset: offset.toString()
      }).toString());
    if (!req.ok) return;

    let json = await req.json();
    for (let track of json.tracks) {
      if (this.allTracks.some(v => v.id == track.id)) continue;
      this.allTracks.push(new Track(track));
    }
    this.tracks = this.getMatchingTracks(search);
  }

  public getMatchingTracks(search: string): Track[] {
    let regex = new RegExp(search, 'i');
    return this.allTracks.filter((v) => regex.test(v.track.title));
  }
}
