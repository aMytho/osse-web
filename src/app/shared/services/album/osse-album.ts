import { OsseTrack } from "../track/osse-track";

export interface OsseAlbum {
    id: number;
    name: string;
    artist_id: number | null;
    tracks: OsseTrack[];
}