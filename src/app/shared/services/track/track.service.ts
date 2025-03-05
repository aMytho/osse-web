import { Injectable, signal, WritableSignal } from '@angular/core';
import { Track } from './track';
import { PlayerService } from '../../player/player.service';
import { Repeat } from './repeat.enum';

/**
 * This service stores all queued tracks
 */
@Injectable({
  providedIn: 'root'
})
export class TrackService {
  /**
   * List of tracks in the queue. We can only call methods on it. DO NOT reset the value or the UI loses reference.
   */
  public tracks: Track[] = [];
  private index = 0;
  private hasRepeatedCurrentTrack: boolean = false;
  /**
   * If true, track is removed on end playback
  */
  public consume: WritableSignal<boolean> = signal(false);
  public repeat: WritableSignal<Repeat> = signal(Repeat.None);

  constructor(private playerService: PlayerService) {
    // When playback ends, wait 250 ms.
    // We need the player to clear the UI first. It subscribes to the same event.
    // Then, progress to the next track (if any)
    this.playerService.playbackEnded.subscribe(_ => {
      setTimeout(() => {
        if (this.tracks.length <= 0) return;

        // Handle repeats.
        let trackPlayedFromRepeat = this.playTrackBasedOnRepeatValue();
        if (trackPlayedFromRepeat) {
          return;
        }

        if (this.consume()) {
          this.tracks.splice(this.index, 1);
          if (this.tracks.length == 0) {
            this.playerService.clearTrack();
          } else {
            this.moveToLastTrack();
          }
        } else {
          this.moveToNextTrack();
        }
      }, 250);
    })
  }

  get activeTrack() {
    return this.tracks[this.index];
  }

  public addTrack(track: Track) {
    // If the UUID is already in use, make a new uuid.
    if (this.tracks.some((a) => a.uuid == track.uuid)) {
      track = track.regenerateTrack();
    }

    this.tracks.push(track);
    // If this is the first track added, start playback
    if (this.tracks.length - 1 == 0) {
      this.moveToTrack(0);
    }
  }

  // Removes all tracks and stops playback
  public clearTracks() {
    while (this.tracks.length != 0) {
      this.tracks.pop();
    }

    this.index = 0;
    this.playerService.pause();
    this.playerService.clearTrack();
  }

  public moveToNextTrack() {
    this.index += 1;
    if (this.index == this.tracks.length) {
      this.index = 0;
    }

    if (this.tracks[this.index]) {
      this.playerService.setTrack(this.activeTrack);
      // If user goes to next track, clear repeat tracker.
      this.hasRepeatedCurrentTrack = false;
    }
  }

  public moveToLastTrack() {
    this.index -= 1;
    if (this.index < 0) {
      this.index = 0;
    }

    if (this.tracks[this.index]) {
      this.playerService.setTrack(this.activeTrack);
      // If user goes to last track, clear repeat tracker.
      this.hasRepeatedCurrentTrack = false;
    }
  }

  public moveToTrack(index: number) {
    this.index = index;

    this.playerService.setTrack(this.activeTrack);
  }

  public removeTrack(index: number) {
    // If 1 track is present, remove them and end playback
    if (this.tracks.length == 1) {
      this.tracks.pop();
      this.index = 0;

      this.playerService.pause();
      this.playerService.clearTrack();
      return;
    }

    // If the track is after the current track remove it
    if (index > this.index) {
      this.tracks.splice(index, 1);
    } else if (index == this.index) {
      // If its the current track, stop playback, remove it, and play next
      this.tracks.splice(index, 1);

      this.playerService.pause();
      this.playerService.clearTrack();

      // Reduce the index by one to play the "next" track
      this.moveToLastTrack();
    } else {
      // Track is before current, remove it and move index back 1
      this.tracks.splice(index, 1);
      this.index -= 1;
    }
  }

  /**
   * Shuffles the tracks and moves the index to the new location of the active track (if any)
   */
  public shuffle() {
    let currentTrack = this.activeTrack;

    this.tracks = this.tracks
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    if (currentTrack) {
      this.index = this.tracks.findIndex((t) => t.id == currentTrack.id);
    }
  }

  private playTrackBasedOnRepeatValue(): boolean {
    switch (this.repeat()) {
      case Repeat.None:
        return false;
      case Repeat.Once:
        if (this.hasRepeatedCurrentTrack) {
          // Move to the next track.
          this.moveToNextTrack();
        } else {
          this.playerService.setTrack(this.activeTrack);
          this.hasRepeatedCurrentTrack = true;
        }
        return true;
      case Repeat.Loop:
        this.playerService.setTrack(this.activeTrack);
        return true;
    }
  }
}
