import { ApiService } from "../api.service";
import { Artist } from "../artist/artist";
import { Track } from "../track/track";
import { OsseAlbum } from "./osse-album";

export class Album {
    private trackList: Track[] = [];
    private artistInfo!: Artist;
    constructor(public album: OsseAlbum, private apiService: ApiService) {
        album.tracks.forEach(track => {
            this.trackList.push(new Track(track, apiService));
        });

        if (this.album.artist_id != null) {
            this.apiService.getArtist(this.album.artist_id).then(val => this.artistInfo = val as Artist);
        }
    }

    public get id() {
        return this.album.id;
    }

    public get name() {
        return this.album.name;
    }

    public get tracks() {
        return this.trackList;
    }

    public get artist() {
        return this.artistInfo ?? null;
    }
}