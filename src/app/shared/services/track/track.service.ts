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
  private index = 0;

  constructor(private playerService: PlayerService) {
    this.playerService.playbackEnded.subscribe(_v => {
      this.moveToNextTrack();
    });
  }

  get activeTrack() {
    return this.tracks[this.index];
  }

  get trackListProgress() {
    return `Track ${this.index + 1} of ${this.tracks.length} tracks`;
  }

  public addTrack(track: Track) {
    this.tracks.push(track);
    // If this is the first track added, start playback
    if (this.tracks.length - 1 == 0) {
      this.moveToTrack(0);
    }
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

  public moveToLastTrack() {
    this.index -= 1;
    if (this.index < 0) {
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

  public removeTrack(index: number) {
    // If 1 track is present, remove them and end playback
    if (this.tracks.length == 0) {
      this.playerService.pause();
      this.playerService.clearTrack();
      this.tracks = [];
      this.index = 0;
      return;
    }

    // If the track is after the current track remove it
    if (index > this.index) {
      this.tracks.splice(index, 1);
    } else if (index == this.index) {
      // If its the current track, stop playback, remove it, and play next
      this.playerService.pause();
      this.playerService.clearTrack();

      this.tracks.splice(index, 1);
      // Reduce the index by one to play the "next" track
      this.moveToLastTrack();
    } else {
      // Track is before current, remove it and move index back 1
      this.tracks.splice(index, 1);
      this.index -= 1;
    }
  }
}
