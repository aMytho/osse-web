export interface OsseTrack {
    id: number;
    title: string;
    size: number;
    duration: number;

    bitrate: number | null;
    artist_id: number | null;
    track_number: number | null;
}
