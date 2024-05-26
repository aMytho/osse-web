import { OsseArtist } from "./osse-artist";

export class Artist {
    constructor(private artist: OsseArtist) {}

    public get name() {
        return this.artist.name;
    }
}