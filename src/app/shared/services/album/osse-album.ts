import { OsseArtist } from "../artist/osse-artist";
import { OsseTrack } from "../track/osse-track";

export interface OsseAlbum {
  id: number;
  name: string;
  artist_id: number | null;
  tracks: OsseTrack[];

  /**
   * Artist data. An artist may exist, but may not be loaded.
  */
  artist: OsseArtist | null;
}
