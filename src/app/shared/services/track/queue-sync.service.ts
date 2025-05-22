import { Injectable } from '@angular/core';
import { fetcher } from '../../util/fetcher';
import { Track } from './track';
import { OsseTrack } from './osse-track';

@Injectable({
  providedIn: 'root'
})
export class QueueSyncService {
  private queueDebounce: number = 0;

  constructor() { }

  /**
  * Syncs the queue in 5 seconds, with debounce.
  */
  syncQueue(trackIds: number[]) {
    clearTimeout(this.queueDebounce);
    this.queueDebounce = setTimeout(() => {
      fetcher('queue', {
        method: 'POST',
        body: JSON.stringify({
          'ids': trackIds
        })
      })
    }, 5000);
  }

  async getQueueFromServer(): Promise<TrackQueue> {
    let req = await fetcher('queue');
    if (req.ok) {
      let result: QueueResponse = await req.json();
      console.log(result);
      if (result.trackId) {
        return {
          queue: result.tracks.map((t) => new Track(t)),
          trackId: result.trackId,
          trackPosition: result.trackPosition
        }
      }
    }

    return {
      queue: [],
      trackId: null,
      trackPosition: 0
    };
  }
}

type QueueResponse = {
  trackId: number | null;
  trackPosition: number;
  tracks: OsseTrack[];
}

type TrackQueue = {
  queue: Track[];
  trackId: number | null;
  trackPosition: number;
}
