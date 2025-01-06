import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackgroundImageService {
  public bgChanged = new EventEmitter<string>();
  constructor() { }

  public setBG(bg: string) {
    this.bgChanged.emit(bg);
  }
}
