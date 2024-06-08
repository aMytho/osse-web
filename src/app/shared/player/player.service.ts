import { EventEmitter, Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Track } from '../services/track/track';
import { TrackPlayerInfo, TrackUpdate } from './track-update';
import { PlaybackState } from './state-change';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  /**
   * Runs whenever a track is changed.
   * This could be a new track, or just loading more buffer data
   */
  public trackUpdated = new EventEmitter<TrackUpdate>();
  public stateChanged = new EventEmitter<PlaybackState>();
  private audioPlayer!: HTMLAudioElement;
  private track!: Track;

  constructor(
    private apiService: ApiService,
  ) { }

  public setAudioPlayer(player: HTMLAudioElement) {
    this.audioPlayer = player;
    this.audioPlayer.addEventListener('timeupdate', async (ev) => {
      this.trackUpdated.emit(new TrackUpdate(this.track, this.buildTrackInfo()));
    });



    this.audioPlayer.addEventListener('ended', (ev) => {
    })
  }

  public async setTrack(track: Track) {
    // Clear the buffer and request next track
    this.track = track;
    this.audioPlayer.preload = "metadata";
    this.audioPlayer.src = "http://localhost:3000/stream?id=" + track.id;
    await this.audioPlayer.play();

    this.trackUpdated.emit(new TrackUpdate(this.track, this.buildTrackInfo()));
  }

  public async playFromStart() {
   
  }



  private playAudioAtPosition(time: number) {
    // this.audioPlayer.currentTime = time;
    // this.playAudio();
  }

  public pause() {
    this.audioPlayer.pause();
    this.stateChanged.emit(PlaybackState.Paused);
  }

  private buildTrackInfo(): TrackPlayerInfo {
    return {
      time: this.audioPlayer.currentTime
    }
  }

  /**
   * Causes the service to emit all track info to all subscribed listeners
   */
  public requestTrackState() {
    if (this.track) {
      this.trackUpdated.emit(new TrackUpdate(this.track, this.buildTrackInfo()));
    }

    if (this.audioPlayer.duration > 0 && !this.audioPlayer.paused) {
      this.stateChanged.emit(PlaybackState.Playing);
    } else {
      this.stateChanged.emit(PlaybackState.Paused);
    }
  }
}
