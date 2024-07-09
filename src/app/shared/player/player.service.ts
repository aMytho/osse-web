import { EventEmitter, Injectable } from '@angular/core';
import { Track } from '../services/track/track';
import { TrackPlayerInfo, TrackUpdate } from './track-update';
import { PlaybackState } from './state-change';
import { ConfigService } from '../services/config/config.service';

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
  public bufferReset = new EventEmitter();
  private audioPlayer!: HTMLAudioElement;
  private track!: Track;

  constructor(private configService: ConfigService) {}

  public setAudioPlayer(player: HTMLAudioElement) {
    this.audioPlayer = player;
    this.audioPlayer.addEventListener('timeupdate', async (ev) => {
      this.trackUpdated.emit(new TrackUpdate(this.track, this.buildTrackInfo()));
    });
  }

  public async setTrack(track: Track) {
    // Clear the buffer and request next track
    this.track = track;
    // Set the real duration. Used for calculating buffer percentages later.
    // Not all formats list the end duration at the start of the track
    this.audioPlayer.setAttribute("data-duration", track.duration.toString());
    this.audioPlayer.preload = "metadata";
    this.audioPlayer.src = this.configService.get("apiURL") + "stream?id=" + track.id;
    await this.play();

    this.trackUpdated.emit(new TrackUpdate(this.track, this.buildTrackInfo()));
    this.bufferReset.emit();
  }

  public play(time: number = this.audioPlayer.currentTime) {
    this.audioPlayer.currentTime = time;
    return new Promise<void>(async (resolve) => {
      await this.audioPlayer.play();
      this.stateChanged.emit(PlaybackState.Playing);
      resolve();
    });
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

    if (!this.audioPlayer.paused) {
      this.stateChanged.emit(PlaybackState.Playing);
    } else {
      this.stateChanged.emit(PlaybackState.Paused);
    }
  }
}
