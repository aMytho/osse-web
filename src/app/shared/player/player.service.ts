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
  private audioCache: any = {};
  private audioPlayer!: HTMLAudioElement;
  private track!: Track;

  constructor(private apiService: ApiService) { }

  public setAudioPlayer(player: HTMLAudioElement) {
    this.audioPlayer = player;
    this.audioPlayer.addEventListener('timeupdate', (ev) => {
      this.trackUpdated.emit(new TrackUpdate(this.track, this.buildTrackInfo()));
    })
  }

  public setTrack(track: Track) {
    this.track = track;
    this.audioCache = {};
    this.playFromStart();
  }

  public playFromStart() {
    this.playAudioFromCacheOrRequest(0, this.track.size - 1);
    this.trackUpdated.emit(new TrackUpdate(this.track, this.buildTrackInfo()));
  }

  cacheAudioData(startByte: string | number, audioData: any) {
    this.audioCache[startByte] = audioData;
  }

  getCachedAudioData(startByte: string | number) {
    return this.audioCache[startByte];
  }

  playAudioFromCacheOrRequest(startByte: number, endByte: number) {
    const cachedData = this.getCachedAudioData(startByte);
    if (cachedData) {
      const blob = new Blob([cachedData], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(blob);
      this.playAudio(audioUrl);
    } else {
      this.apiService.getAudioRange(this.track.id, startByte, endByte)
        .then(audioData => {
          this.cacheAudioData(startByte, audioData);
          const blob = new Blob([audioData], { type: 'audio/mp3' });
          const audioUrl = URL.createObjectURL(blob);
          this.playAudio(audioUrl);
        })
        .catch(error => console.error('Error fetching audio data:', error));
    }
  }

  /**
   * Once the data is loaded, call this to start playback
   */
  private playAudio(urlData: string) {
    this.audioPlayer.src = urlData;
    this.audioPlayer.play().then(() => this.stateChanged.emit(PlaybackState.Playing));
  }

  public playAtCurrentPosition() {
    this.audioPlayer.play().then(() => this.stateChanged.emit(PlaybackState.Playing));
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
