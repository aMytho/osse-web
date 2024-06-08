import { Injectable } from '@angular/core';
import { ConfigService } from './config/config.service';
import { Track } from './track/track';
import { OsseTrack } from './track/osse-track';
import { Artist } from './artist/artist';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private configService: ConfigService) {

  }

  public async getAllTracks(): Promise<Track[]> {
    try {
      let request = await fetch(`${this.configService.get('apiURL')}tracks/all`);
      let response = await request.json();
      console.log(response);

      return response.map((track: OsseTrack) => new Track(track, this))
    } catch(e) {
      return [];
    }
  }

  public async getAudioRange(id: number, start: number, end: number) {
    console.log("Requesting track ", id, ' with range: ', start, '-', end);
    let request = await fetch(`${this.configService.get('apiURL')}stream/test`, {
      headers: {
        'Range': `bytes=${start}-${end}`,
        'Track': `${id}`
      }
    });

    return await request.json();
  }

  public async getArtist(id: number): Promise<Artist | null> {
    return null;
    let request = await fetch(`${this.configService.get('apiURL')}artists?id=${id}`);
    if (request.ok) {
      let artist = await request.json();
      return new Artist(artist);
    } else {
      return null;
    }
  }
}
