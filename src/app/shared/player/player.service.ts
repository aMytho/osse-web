import { EventEmitter, Injectable, signal, WritableSignal } from '@angular/core';
import { Track } from '../services/track/track';
import { TrackPlayerInfo, TrackUpdate } from './track-update';
import { PlaybackState } from './state-change';
import { ConfigService } from '../services/config/config.service';
import { BackgroundImageService } from '../ui/background-image.service';
import { BufferUpdate } from './buffer-update.interface';

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
  public playbackEnded = new EventEmitter();
  public bufferReset = new EventEmitter();
  public bufferUpdated = new EventEmitter<BufferUpdate>();
  private audioPlayer = new Audio();
  private track!: Track | null;

  private durationSignal: WritableSignal<number> = signal(0);
  private isPlayingSignal: WritableSignal<boolean> = signal(false);

  constructor(
    private configService: ConfigService,
    private backgroundImageService: BackgroundImageService
  ) {
    this.audioPlayer.addEventListener('timeupdate', (_ev) => {
      if (this.track) {
        this.trackUpdated.emit(new TrackUpdate(this.track as Track, this.buildTrackInfo()));
      }
    });

    this.audioPlayer.addEventListener('play', (_ev) => {
      this.isPlayingSignal.set(true)
      this.stateChanged.emit(PlaybackState.Playing);
    });
    this.audioPlayer.addEventListener('pause', (_ev) => {
      this.isPlayingSignal.set(false);
      this.stateChanged.emit(PlaybackState.Paused);
    });
    this.audioPlayer.addEventListener('ended', (_ev) => {
      this.isPlayingSignal.set(false);
      this.playbackEnded.emit();
    });
    this.audioPlayer.addEventListener('progress', (_ev) => this.bufferUpdated.emit({ duration: this.duration(), durationEstimate: this.audioPlayer.duration, buffered: this.audioPlayer.buffered }));

    this.audioPlayer.preload = "metadata";
  }

  public async setTrack(track: Track) {
    // Clear the buffer and request next track
    this.track = track;

    // Set the real duration. Used for calculating buffer percentages later.
    // Not all formats list the end duration at the start of the track
    this.durationSignal.set(track.duration);
    this.audioPlayer.src = this.configService.get("apiURL") + "api/tracks/" + track.id + '/stream';
    await this.play();
    this.backgroundImageService.setBG(this.configService.get('apiURL') + 'api/tracks/' + track.id + '/cover');

    this.trackUpdated.emit(new TrackUpdate(this.track, this.buildTrackInfo()));
    this.bufferReset.emit();
  }

  public play(time: number = this.audioPlayer.currentTime) {
    this.audioPlayer.currentTime = time;
    return new Promise<void>(async (resolve) => {
      await this.audioPlayer.play();
      resolve();
    });
  }

  public pause() {
    this.audioPlayer.pause();
  }

  public toggle() {
    if (this.isPlayingSignal()) {
      this.pause();
    } else {
      this.play();
    }
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

  public clearTrack() {
    this.audioPlayer.src = "#";
    this.track = null;
    this.bufferReset.emit();
    this.playbackEnded.emit();
  }

  public setVolume(vol: number) {
    this.audioPlayer.volume = vol;
  }

  public getVolume(): number {
    return this.audioPlayer.volume;
  }

  get duration() {
    return this.durationSignal.asReadonly();
  }

  get isPlaying() {
    return this.isPlayingSignal.asReadonly();
  }
}
