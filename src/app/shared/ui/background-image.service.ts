import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackgroundImageService {
  public bgChanged = new EventEmitter<string>();
  private bg: string = '#';
  constructor() { }

  public setBG(bg: string) {
    this.bg = bg;
    this.bgChanged.emit(this.bg);
  }

  public get background() {
    return this.bg;
  }
}
