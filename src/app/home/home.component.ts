import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlay, faPause, faForward, faBackward, faRepeat, faInfo, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { TrackComponent } from './track/track.component';
import { TrackService } from '../shared/services/track/track.service';
import { Track } from '../shared/services/track/track';
import { PlayerService } from '../shared/player/player.service';
import { PlaybackState } from '../shared/player/state-change';
import { ConfigService } from '../shared/services/config/config.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FontAwesomeModule, TrackComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  public bg: string = "#";
  public waveform: string = "#";
  public tracks: Track[] = [];
  public playing: boolean = false;
  public title: string = '';
  public artist: string = '';

  forward = faForward;
  back = faBackward;
  repeat = faRepeat;
  consume = faUtensils;
  info = faInfo;
  get playerIcon() {
    if (this.playing) {
      return faPause;
    } else {
      return faPlay;
    }
  }

  constructor(
    private trackService: TrackService,
    private playerService: PlayerService,
    private configService: ConfigService
  ) {}

  public onPlayerToggle() {
    // If no track, don't respond to button click
    if (!this.trackService.activeTrack) return;
    this.playing = !this.playing;

    if (!this.playing) {
      this.playerService.pause();
      return;
    } else {
      this.playerService.play();
    }
  }

  public onNextTrack() {
    this.trackService.moveToNextTrack();
  }

  public playTrack(index: number) {
    this.trackService.moveToTrack(index);
  }

  ngOnInit(): void {
    this.tracks = this.trackService.tracks;
    this.playerService.trackUpdated.subscribe((val) => {
      this.title = val.title;
      this.artist = val.artist?.name || '';
      this.bg = this.configService.get('apiURL', 'localhost:3000') + "tracks/cover?id=" + val.id;
    });
    this.playerService.stateChanged.subscribe((val) => {
      if (val == PlaybackState.Paused) {
        this.playing = false;
      } else {
        this.playing = true;
      }
    });

    this.playerService.requestTrackState();
  }
}
