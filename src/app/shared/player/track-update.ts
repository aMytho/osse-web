import { Track } from "../services/track/track";

export class TrackUpdate {
    constructor(private track: Track, private info: TrackPlayerInfo) {}

    public getDuration() {
        let date = new Date(0);
        date.setSeconds(this.track.duration);
        
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        return `${minutes}:${seconds}`;
    }

    public getCurrentTime() {
        let date = new Date(0);
        date.setSeconds(this.info.time);
        
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        return `${minutes}:${seconds}`;
    }

    get title() {
        return this.track.title;
    }
}

export interface TrackPlayerInfo {
    time: number;
}