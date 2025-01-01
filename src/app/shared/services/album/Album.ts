import { LocatorService } from "../../../locator.service";
import { ApiService } from "../api.service";
import { Artist } from "../artist/artist";
import { Track } from "../track/track";
import { OsseAlbum } from "./osse-album";

export class Album {
  private trackList: Track[] = [];
  private artistInfo!: Artist;
  private apiService: ApiService = LocatorService.injector.get(ApiService);

  constructor(public album: OsseAlbum) {
    album.tracks?.forEach(track => {
      this.trackList.push(new Track(track));
    });

    this.getArtistIfExists();
  }

  public get id() {
    return this.album.id;
  }

  public get name() {
    return this.album.name;
  }

  public get tracks() {
    return this.trackList;
  }

  public get artist() {
    return this.artistInfo ?? null;
  }

  private getArtistIfExists() {
    if (this.album.artist_id != null) {
      if (this.album.artist != null) {
        this.artistInfo = new Artist(this.album.artist);
        return;
      }

      this.apiService.getArtist(this.album.artist_id).then(val => this.artistInfo = val as Artist);
    }
  }
}
