import { EventEmitter, Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { BufferService } from './buffer.service';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  public buferRequest = new EventEmitter<1 | 2>();

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
      console.log('Buffer 1 finished.', this.audioContext.currentTime);
      // Get buffer 3
      this.buferRequest.emit(1);
    };

    this.sourceNode2.onended = () => {
      console.log("2 ended");
      // this.loadFirstBuffer();
    };
  }

  public play() {
    const time = this.audioContext.currentTime;
    const duration = this.currentBuffer.duration;
    this.sourceNode1.start(0);
    this.sourceNode2.start(time + duration, duration);
  }

  public async loadFirstBuffer() {
    let decoded = await this.audioContext.decodeAudioData(this.bufferService.getEndBuffer().data.slice(0));
    this.currentBuffer = decoded;
    this.sourceNode1.buffer = this.currentBuffer;
    console.log("Buffer 1 loaded");

    // Request buffer 2 data
    this.buferRequest.emit(2);
  }

  public async loadBuffer2() {
    // Fetch and decode the next audio buffer asynchronously
    let combinedBuffer = this.bufferService.getAllBufferData();

    // Now `combinedBuffer` contains the combined data of buffer1 and buffer2

    let decoded = await this.audioContext.decodeAudioData(combinedBuffer);
    this.nextBuffer = decoded;
    // Swap current and next buffers

    // Schedule the next buffer to start playing immediately after the current buffer ends
    this.sourceNode2.buffer = this.nextBuffer;
    console.log("Source 2 buffer duration:", this.nextBuffer);
    console.log("Buffer 2 loaded");
    console.log(this.bufferService);
  }



  public async loadNextAudioBuffer() {
    // Fetch and decode the next audio buffer asynchronously
    let combinedBuffer = this.bufferService.getAllBufferData();

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

  public async updateBuffer1() {
    let decoded = await this.audioContext.decodeAudioData(this.bufferService.getAllBufferData());
    this.currentBuffer = decoded;

    let newSourceNode1 = this.audioContext.createBufferSource();
    newSourceNode1.connect(this.gainNode);
    newSourceNode1.buffer = this.currentBuffer;

    console.log("Buffer 1 reloaded");

    this.sourceNode1 = newSourceNode1;

    // Queue playback
    let duration = this.nextBuffer.duration;
    this.sourceNode1.start(this.audioContext.currentTime + duration, duration);
    console.log("Buffer 2 queued");
  }
}
