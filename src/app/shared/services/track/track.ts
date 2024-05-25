import { OsseTrack } from "./osse-track";

export class Track {
    public track!: OsseTrack;

    constructor(track: OsseTrack) {
        this.track = track;
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

    public hasArtist(): boolean {
        return this.track.artist_id != null;
    }

    public getArtist() {

    }
}