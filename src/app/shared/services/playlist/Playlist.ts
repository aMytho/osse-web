import { ApiService } from "../api.service";
import { Track } from "../track/track";
import { OssePlaylist } from "./osse-playlist";

export class Playlist {
    public tracks: Track[] = [];
    constructor(private playlist: OssePlaylist, private apiService: ApiService) {
        if (playlist.tracks == undefined) {
            return
        }
        this.tracks = playlist.tracks.map(t => {
            return new Track(t, this.apiService);
        })
    }

    public get id() {
        return this.playlist.id;
    }

    public get name() {
        return this.playlist.name;
    }

    public get count() {
        return this.playlist.count;
    }
}