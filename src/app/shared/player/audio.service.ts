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
      console.log('1 ended', this.audioContext.currentTime);
      this.switchToNextBuffer();
    };

    this.sourceNode2.onended = () => {
      console.log("2 ended");
      this.loadFirstBuffer();
    };
  }

  public play() {
    const time = this.audioContext.currentTime;
    const duration = this.currentBuffer.duration;
    this.sourceNode1.start(0);
    this.sourceNode2.start(time + duration , duration);
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
    console.log("Buffer 2 loaded");

    this.queueBuffer2();
  }

  private async queueBuffer2() {
    // Queue buffer 2
    const time = this.audioContext.currentTime;
    const duration = this.currentBuffer.duration;

    // this.sourceNode2.start(time + duration, duration);
    console.log(time, duration);
    console.log("Buffer 2 queued");

    let first = this.bufferService.getBufferAtIndex(0).data;
    let last = this.bufferService.getEndBuffer().data;
    const view1 = new Uint8Array(first);
    const view2 = new Uint8Array(last);

    // Define the number of bytes you want to compare
    const numBytesToCompare = 16; // For example, you can adjust this number as needed

    // Get the last bytes of the first buffer
    const lastBytesBuf1 = view1.subarray(view1.length - numBytesToCompare);

    // Get the first bytes of the second buffer
    const firstBytesBuf2 = view2.subarray(0, numBytesToCompare);

    // Compare the last bytes of the first buffer with the first bytes of the second buffer
    let bytesMatch = true;
    for (let i = 0; i < numBytesToCompare; i++) {
      if (lastBytesBuf1[i] !== firstBytesBuf2[i]) {
        bytesMatch = false;
        break;
      }
    }

    if (bytesMatch) {
      console.log("Last bytes of the first buffer match the first bytes of the second buffer.");
    } else {
      console.log("Last bytes of the first buffer do not match the first bytes of the second buffer.");
    }
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
}
