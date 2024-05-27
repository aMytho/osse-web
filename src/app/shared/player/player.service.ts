import { EventEmitter, Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Track } from '../services/track/track';
import { TrackPlayerInfo, TrackUpdate } from './track-update';
import { PlaybackState } from './state-change';
import { BufferService } from './buffer.service';
import { estimatedBytesForBuffer, guessByteSizeForFirstBuffer } from './util';

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
    private bufferService: BufferService
  ) { }

  public setAudioPlayer(player: HTMLAudioElement) {
    this.audioPlayer = player;
    this.audioPlayer.addEventListener('timeupdate', async (ev) => {
      this.trackUpdated.emit(new TrackUpdate(this.track, this.buildTrackInfo()));
      
      // If we are nearing the end of this buffer, check for the next one
      let estimatedPosition = estimatedBytesForBuffer(this.audioPlayer.currentTime, this.track.bufferSize);
      if (!this.bufferService.addingBufferInProgress && estimatedPosition > (this.track.bufferSize / 2)) {
        console.log("Nearing buffer end, checking for next buffer");
        // Check if there the next buffer is loaded
        let bufferIndex = this.bufferService.getBufferIndexByPosition(estimatedPosition);
        
        if (this.bufferService.bufferIndexExists(bufferIndex + 1)) {
          // Buffer exists, time to chill
        } else {
          // Buffer doesn't exist, request one
          // Get the current buffer
          console.log("Requesting next buffer");
          let currentBuffer = this.bufferService.getBufferAtIndex(bufferIndex);
          
          // Prevent requesting a new buffer while we are waiting on the next request
          this.bufferService.addingBufferInProgress = true;
          
          let lastByteInBuffer = this.bufferService.getEndBuffer().endByte;
          // Get the new buffer
          let newBuffer = await this.apiService.getAudioRange(
            this.track.id,
            currentBuffer.endByte + 1,
            lastByteInBuffer + this.track.bufferSize
          );
          
          // Add the new buffer to the list
          this.bufferService.addSegmentToEnd(newBuffer);

          console.log(this.bufferService);

          this.bufferService.addingBufferInProgress = false;
          let time = this.audioPlayer.currentTime;
          this.setSrc();
          this.playAudioAtPosition(time);
        }
      }
    });


    this.audioPlayer.addEventListener('ended', (ev) => {
      console.log(this.bufferService.count);
    })
  }

  public async setTrack(track: Track) {
    // Clear the buffer and request next track
    this.bufferService.clearBuffer();
    this.track = track;

    // Get the next buffer size
    this.track.bufferSize = guessByteSizeForFirstBuffer(this.track.size, this.track.duration);
    // Get the buffer data
    let buffer = await this.apiService.getAudioRange(this.track.id, 0, this.track.bufferSize);
    // Save the buffer data
    this.bufferService.addBeginningSegment(buffer, this.track.bufferSize);
    console.table({
      bufferSize: this.bufferService.size,
      expectedBuffers: this.bufferService.getExpectedBufferCount(this.track.size),
    });

    this.setSrc();

    // Play the file
    this.playFromStart();
  }

  private setSrc() {
    this.audioPlayer.src = this.bufferService.getBlobForBuffers();
  }

  public playFromStart() {
    this.playAudio();
    this.trackUpdated.emit(new TrackUpdate(this.track, this.buildTrackInfo()));
  }

  /**
   * Once the data is loaded, call this to start playback
   */
  private playAudio() {
    this.audioPlayer.play().then(() => this.stateChanged.emit(PlaybackState.Playing));
  }

  private playAudioAtPosition(time: number) {
    this.audioPlayer.currentTime = time;
    this.playAudio();
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
