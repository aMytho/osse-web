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
  private gainNode = this.audioContext.createGain();

  // Create empty buffers to hold audio data
  private audio1 = document.createElement('audio') as HTMLAudioElement;
  private audio2 = document.createElement('audio') as HTMLAudioElement;
  private audio3 = document.createElement('audio') as HTMLAudioElement;
  private audio4 = document.createElement('audio') as HTMLAudioElement;
  private source1 = this.audioContext.createMediaElementSource(this.audio1);
  private source2 = this.audioContext.createMediaElementSource(this.audio2);
  private source3 = this.audioContext.createMediaElementSource(this.audio3);
  private source4 = this.audioContext.createMediaElementSource(this.audio4);
  private bufferSource = this.audioContext.createBufferSource();

  constructor(
    private bufferService: BufferService
  ) {
    this.source1.connect(this.gainNode);
    this.source2.connect(this.gainNode);
    this.source3.connect(this.gainNode);
    this.source4.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
  }

  public play() {
    this.audio1.play();
    this.buferRequest.emit(2);
  }

  public async loadFirstBuffer() {
    let blob = new Blob([this.bufferService.getEndBuffer().data.slice(0)], { type: 'audio/mpeg' });
    this.audio1.src = URL.createObjectURL(blob);
    console.log("Buffer 1 loaded");
  }

  public async loadBuffer2() {
    // Fetch and decode the next audio buffer asynchronously
    let combinedBuffer = this.bufferService.getAllBufferData();
    // Now `combinedBuffer` contains the combined data of buffer1 and buffer2

    let blob = new Blob([combinedBuffer], { type: 'audio/mpeg' });
    this.audio2.src = URL.createObjectURL(blob);
    this.audio2.load();
    let tm = 0;
    
    this.audio1.addEventListener('ended', () => {
      // Calculate duration when audio1 ends
      let duration = this.audio1.currentTime;
      // Set currentTime of audio2
      this.audio2.currentTime = tm;

      // Play audio2
      this.audio2.play();

      // Optionally, update buffer1
      this.updateBuffer1();
    });



    this.audio1.addEventListener('timeupdate', (e) => {
      // Calculate duration when audio1 ends
      if (this.audio1.currentTime != this.audio1.duration) {
        tm = this.audio1.currentTime;
        console.log(tm);
      }
    });

    console.log("Buffer 2 loaded");
  }


  public async updateBuffer1() {
    let data = this.bufferService.getAllBufferData();
    let blob = new Blob([data], { type: 'audio/mpeg' });
    // this.audio3.src = URL.createObjectURL(blob);
    // this.audio2.addEventListener('ended', (e) => this.audio3.play());

    console.log("Buffer 2 queued");
  }
}
