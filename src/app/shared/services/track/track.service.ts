import { Injectable } from '@angular/core';
import { Track } from './track';

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
  
  constructor() { }


  get activeTrack() {
    return this.tracks[this.index];
  }
}
