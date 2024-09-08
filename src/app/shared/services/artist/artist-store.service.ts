import { Injectable } from '@angular/core';
import { Artist } from './artist';

@Injectable({
  providedIn: 'root'
})
export class ArtistStoreService {
  public artists: Artist[] = [];

  constructor() { }

  public getArtistById(id: number) {
    return this.artists.find((a) => a.id == id);
  }

  public setArtist(artist: Artist) {
    if (this.artistIsLoaded(artist.id)) return;

    this.artists.push(artist);
  }

  public artistIsLoaded(id: number) {
    return this.artists.some((a) => a.id == id);
  }
}
