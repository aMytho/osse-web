import { Component, OnInit } from '@angular/core';
import { TrackComponent } from './track/track.component';
import { TrackService } from '../shared/services/track/track.service';
import { Track } from '../shared/services/track/track';
import { PlayerService } from '../shared/player/player.service';
import { PlaybackState } from '../shared/player/state-change';
import { ConfigService } from '../shared/services/config/config.service';
import { IconComponent } from '../shared/ui/icon/icon.component';
import { mdiFastForward, mdiInformation, mdiPause, mdiPlay, mdiRepeat, mdiRewind, mdiSilverwareForkKnife } from '@mdi/js';
import { ModalService } from '../shared/ui/modal/modal.service';
import { AddToPlaylistComponent } from '../shared/ui/modals/add-to-playlist/add-to-playlist.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IconComponent, TrackComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  public bg: string = "#";
  public tracks: Track[] = [];
  public playing: boolean = false;
  public title: string = '';
  public artist: string = '';

  forward = mdiFastForward;
  back = mdiRewind;
  repeat = mdiRepeat;
  consume = mdiSilverwareForkKnife;
  info = mdiInformation;

  get playerIcon() {
    if (this.playing) {
      return mdiPause;
    } else {
      return mdiPlay;
    }
  }

  constructor(
    private trackService: TrackService,
    private playerService: PlayerService,
    private configService: ConfigService,
    private modalService: ModalService
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

  public onPreviousTrack() {
    this.trackService.moveToLastTrack();
  }

  public playTrack(index: number) {
    this.trackService.moveToTrack(index);
  }

  public removeTrack(index: number) {
    this.trackService.removeTrack(index);
  }

  public addToPlaylist(track: Track) {
    this.modalService.setDynamicModal(AddToPlaylistComponent, [{
      name: 'track',
      val: track
    }], 'Add to Playlist');
    this.modalService.show();
  }

  public get trackProgress() {
    if (this.trackService.activeTrack) {
      return this.trackService.trackListProgress;
    }
    return '';
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
