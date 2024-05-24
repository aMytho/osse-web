import { Injectable, WritableSignal, effect, signal } from '@angular/core';
import { Track } from './track';

/**
 * This service stores all queued tracks
 */
@Injectable({
  providedIn: 'root'
})
export class TrackService {

  public tracks: Track[] = [];
  constructor() { }
}
