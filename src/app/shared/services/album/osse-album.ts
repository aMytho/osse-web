import { OsseArtist } from "../artist/osse-artist";
import { OsseTrack } from "../track/osse-track";

export interface OsseAlbum {
  id: number;
  name: string;
  artist_ids: number[] | null;
  tracks: OsseTrack[];

  /**
   * Artist data.
  */
  artists: OsseArtist[] | null;
}
