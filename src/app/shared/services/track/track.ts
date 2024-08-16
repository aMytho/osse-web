import { getDuration } from "../../util/time";
import { ApiService } from "../api.service";
import { Artist } from "../artist/artist";
import { OsseTrack } from "./osse-track";

export class Track {
    public track!: OsseTrack;
    private trackArtist!: Artist;
    public bufferSize: number = 0;

    constructor(track: OsseTrack, private apiService: ApiService) {
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

    private async getArtist() {
        if (!this.hasArtist) return;

        let artist = await this.apiService.getArtist(this.track.artist_id as number);
        if (artist) {
            this.trackArtist = artist;
        }
    }

    public get artist() {
        return this.trackArtist || null;
    }
}
