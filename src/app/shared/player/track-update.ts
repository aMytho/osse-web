import { Track } from "../services/track/track";

export class TrackUpdate {
    constructor(private track: Track, private info: TrackPlayerInfo) {}

    public getDuration() {
        let date = new Date(0);
        date.setSeconds(this.track.duration + 1);
        
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        return `${this.getNicelyFormattedTime(minutes)}:${this.getNicelyFormattedTime(seconds)}`;
    }

    public getCurrentTime() {
        let date = new Date(0);
        date.setSeconds(this.info.time);
        
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        return `${this.getNicelyFormattedTime(minutes)}:${this.getNicelyFormattedTime(seconds)}`;
    }

    private getNicelyFormattedTime(time: number) {
        if (time == 0) {
            return '00';
        }

        // Handle 1,2,3,
        if (time < 10) {
            return '0' + time;
        }

        // Ok format, leave as is
        return time;
    }

    get totalSeconds() {
        return this.track.duration;
    }

    get currentSecond() {
        return this.info.time;
    }

    get title() {
        return this.track.title;
    }

    get artist() {
        if (this.track.hasArtist()) {
            return this.track.artist;
        }

        return null;
    }

    get id() {
        return this.track.track.id;
    }
}

export interface TrackPlayerInfo {
    time: number;
}