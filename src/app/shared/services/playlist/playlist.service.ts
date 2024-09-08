import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { Playlist } from './Playlist';
import { OssePlaylist } from './osse-playlist';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  constructor(private configService: ConfigService) { }

  public async getPlaylist(id: number) {
    let req = await fetch(this.configService.get('apiURL') + 'playlists/' + id, {});
    let res = await req.json();

    if (req.ok) {
      return new Playlist(res);
    }

    throw "Playlist Error";
  }

  public async getAll(): Promise<Playlist[]> {
    let req = await fetch(this.configService.get('apiURL') + 'playlists', {});
    let res = await req.json();

    if (req.ok) {
      return res.map((p: OssePlaylist) => new Playlist(p));
    }

    throw "Playlist Error";
  }

  public async addTrackToPlaylist(playlistId: number, trackId: number) {
    await fetch(this.configService.get('apiURL') + 'playlists-tracks', {
      method: 'POST',
      headers: [['Content-Type', 'application/json']],
      body: JSON.stringify({
        playlist_id: playlistId,
        track_id: trackId
      })
    });
  }
}
