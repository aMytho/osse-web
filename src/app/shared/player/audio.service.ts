import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { BufferService } from './buffer.service';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioContext = new AudioContext();

  // Initialize audio buffer sources and gain nodes
  private sourceNode1 = this.audioContext.createBufferSource();
  private sourceNode2 = this.audioContext.createBufferSource();
  private gainNode = this.audioContext.createGain();

  // Create empty buffers to hold audio data
  private currentBuffer!: AudioBuffer;
  private nextBuffer!: AudioBuffer;

  constructor(
    private apiService: ApiService,
    private bufferService: BufferService
  ) {
    this.sourceNode1.connect(this.gainNode);
    this.sourceNode2.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);

    // Event listener to detect end of audio buffer
    this.sourceNode1.onended = () => {
      console.log('1 ended', this.audioContext.currentTime);
      this.switchToNextBuffer();
    };

    this.sourceNode2.onended = () => {
      console.log("2 ended");
      this.loadFirstBuffer();
    };
  }

  public play() {
    this.sourceNode1.buffer = this.currentBuffer;
    this.sourceNode1.start(0);
    this.sourceNode2.start(this.audioContext.currentTime + this.currentBuffer.duration, this.currentBuffer.duration);
  }

  public async loadFirstBuffer() {
    let decoded = await this.audioContext.decodeAudioData(this.bufferService.getEndBuffer().data.slice(0));
    this.currentBuffer = decoded;
  }

  public async loadNextAudioBuffer() {
    // Fetch and decode the next audio buffer asynchronously
    this.bufferService.temp;
    let oldB = this.bufferService.getBufferAtIndex(0).data.slice(0);
    let newB = this.bufferService.getEndBuffer().data.slice(0);

    // Assuming `buffer1` and `buffer2` are the ArrayBuffers you want to combine
    const combinedLength = oldB.byteLength + newB.byteLength;

    // Create a new ArrayBuffer with the combined length
    const combinedBuffer = new ArrayBuffer(combinedLength);

    // Create views for the combined buffer and individual buffers
    const combinedView = new Uint8Array(combinedBuffer);
    const view1 = new Uint8Array(oldB);
    const view2 = new Uint8Array(newB);

    // Copy the contents of buffer1 into the combined buffer
    combinedView.set(view1, 0);

    // Copy the contents of buffer2 into the combined buffer after buffer1
    combinedView.set(view2, oldB.byteLength);

    // Now `combinedBuffer` contains the combined data of buffer1 and buffer2

    let decoded = await this.audioContext.decodeAudioData(combinedBuffer);
    this.nextBuffer = decoded;
    // Swap current and next buffers
      

    // Schedule the next buffer to start playing immediately after the current buffer ends
    this.sourceNode2.buffer = this.nextBuffer;
  }

  public switchToNextBuffer() {
    // Switch to the preloaded audio buffer
    if (this.nextBuffer) {
      
      // this.sourceNode2.start(0, this.currentBuffer.duration);
      // Load the next audio buffer for seamless transition
      // this.loadNextAudioBuffer();
    }
  }
}
