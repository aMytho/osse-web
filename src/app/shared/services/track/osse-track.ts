import { OsseArtist } from "../artist/osse-artist";

export interface OsseTrack {
  id: number;
  title: string;
  size: number;
  duration: number;

  bitrate: number | null;
  artist_id: number | null;
  track_number: number | null;
  disc_number: number | null;

  /**
   * Artist data. A track can have an artist ID without loading the artist, but most queries load it.
  */
  artist: OsseArtist | null;
}
