import { OsseTrack } from "../track/osse-track";

export interface OssePlaylist {
    id: number;
    name: string;
    tracks: OsseTrack[];
    count: number;
}