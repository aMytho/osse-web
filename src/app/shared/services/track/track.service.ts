import { Injectable } from '@angular/core';
import { Track } from './track';
import { PlayerService } from '../../player/player.service';

/**
 * This service stores all queued tracks
 */
@Injectable({
  providedIn: 'root'
})
export class TrackService {

  /**
   * List of tracks in the queue
   */
  public tracks: Track[] = [];
  private index = 1;
  
  constructor(private playerService: PlayerService) { }


  get activeTrack() {
    return this.tracks[this.index];
  }

  public addTrack(track: Track) {
    this.tracks.push(track);
  }

  public clearTracks() {
    this.tracks = [];
    this.index = 0;
  }

  public moveToNextTrack() {
    this.index += 1;
    if (this.index == this.tracks.length) {
      this.index = 0;
    }

    if (this.tracks[this.index]) {
      this.playerService.setTrack(this.activeTrack);
    }
  }

  public moveToTrack(index: number) {
    this.index = index;

    this.playerService.setTrack(this.activeTrack);
  }
}
