import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebAudioService {
  private audioContext = new AudioContext();
  private panner = this.audioContext.createStereoPanner();

  constructor() { }

  public setUp(audioElement: HTMLAudioElement): HTMLAudioElement {
    const source = this.audioContext.createMediaElementSource(audioElement);

    // Set up panning
    source.connect(this.panner);
    this.panner.pan.value = 0;
    this.panner.connect(this.audioContext.destination);
    return audioElement;
  }

  public setPan(pan: number) {
    this.panner.pan.value = pan;
  }

  public getPanValue(): number {
    return this.panner.pan.value;
  }
}
