import { WritableSignal, signal } from "@angular/core";
import { LocatorService } from "../../../locator.service";
import { getDuration } from "../../util/time";
import { ApiService } from "../api.service";
import { ArtistStoreService } from "../artist/artist-store.service";
import { OsseTrack } from "./osse-track";
import { Artist } from "../artist/artist";

export class Track {
  public track!: OsseTrack;
  private artistStore: ArtistStoreService = LocatorService.injector.get(ArtistStoreService);
  private apiService: ApiService = LocatorService.injector.get(ApiService);
  public bufferSize: number = 0;
  public artist: WritableSignal<Artist | null> = signal(null);

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
    if (!this.hasArtist()) {
      return;
    }

    // Check if it already exists in the store
    if (this.artistStore.artistIsLoaded(this.track.artist_id as number)) {
      this.setArtist();
      return;
    }

    // We need to fetch artist. Check the fetch list to make sure we don't make multiple reqeuests for the same artist.
    if (this.artistStore.isFetchingArtist(this.track.artist_id as number)) {
      await new Promise<void>((resolve, _reject) => {
        let sub = this.artistStore.artistFetched.subscribe((_v) => {
          sub.unsubscribe();
          resolve();
        });
      });

      this.setArtist();

      return;
    }

    // Not fetching artist, start fetching artist
    this.artistStore.addFetchingArtist(this.track.artist_id as number);
    let artist = await this.apiService.getArtist(this.track.artist_id as number);
    if (artist) {
      this.artistStore.setArtist(artist);
      this.setArtist();
    }

    this.artistStore.removeFetchingArtist(this.track.artist_id as number);
    this.artistStore.artistFetched.emit(this.track.artist_id as number);
  }

  private setArtist() {
    let artist = this.artistStore.getArtistById(this.track.artist_id as number) ?? null;
    this.artist.set(artist);
  }

  public get trackNumber() {
    return this.track.track_number;
  }

  public get discNumber() {
    return this.track.disc_number;
  }
}
