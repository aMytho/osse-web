import { LocatorService } from "../../../locator.service";
import { getDuration } from "../../util/time";
import { ApiService } from "../api.service";
import { ArtistStoreService } from "../artist/artist-store.service";
import { OsseTrack } from "./osse-track";

export class Track {
  public track!: OsseTrack;
  private artistStore: ArtistStoreService = LocatorService.injector.get(ArtistStoreService);
  private apiService: ApiService = LocatorService.injector.get(ApiService);
  public bufferSize: number = 0;

  constructor(track: OsseTrack) {
    this.track = track;

    // Grab the artist info
    this.getArtist();
  }

  public get id() {
    return this.track.id;
  }

  public get title() {
    return this.track.title;
  }

  public get size() {
    return this.track.size;
  }

  public get duration() {
    return this.track.duration;
  }

  public get durationFormatted() {
    return getDuration(this.track.duration);
  }

  public hasArtist(): boolean {
    return this.track.artist_id != null;
  }

  public async getArtist() {
    if (!this.hasArtist) return;

    // Check if it already exists in the store
    if (this.artistStore.artistIsLoaded(this.track.artist_id as number)) return;

    let artist = await this.apiService.getArtist(this.track.artist_id as number);
    if (artist) {
      this.artistStore.setArtist(artist);
    }
  }

  public get artist() {
    if (!this.hasArtist) return null;

    return this.artistStore.getArtistById(this.track.artist_id as number) || null;
  }

  public get trackNumber() {
    return this.track.track_number;
  }
}
