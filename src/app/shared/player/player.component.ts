import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PlayerService } from './player.service';
import { PointState } from './point-state';
import { ConfigService } from '../services/config/config.service';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../ui/button/button.component';
import { PlaybackState } from './state-change';
import { TrackService } from '../services/track/track.service';
import { IconComponent } from '../ui/icon/icon.component';
import { mdiDotsVertical, mdiFastForward, mdiInformation, mdiPause, mdiPlay, mdiRepeat, mdiRewind, mdiSilverwareForkKnife } from '@mdi/js';
import { VolumeComponent } from './volume/volume.component';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [VolumeComponent, IconComponent, RouterLink, ButtonComponent],
  templateUrl: './player.component.html',
  styleUrl: `./player.component.css`,
})
export class PlayerComponent implements AfterViewInit {
  @ViewChild('player') player!: ElementRef<HTMLAudioElement>;
  @ViewChild('progressContainer') container!: ElementRef<HTMLDivElement>;
  @ViewChild('point') point!: ElementRef<HTMLDivElement>;
  @ViewChild('rendered') rendered!: ElementRef<HTMLDivElement>;

  public bg: string = "#";
  public currentTime: string = '';
  public totalDuration: string = '';
  public trackTitle: string = '';
  public artistTitle: string = '';
  private isDragging = false;
  private abortMouseMove = new AbortController();
  private seekDuration = 0;
  private playing: boolean = false;

  play = mdiPlay;
  pause = mdiPause;
  forward = mdiFastForward;
  back = mdiRewind;
  repeat = mdiRepeat;
  consume = mdiSilverwareForkKnife;
  info = mdiInformation;
  verticalDots = mdiDotsVertical;

  get playerIcon() {
    if (this.playing) {
      return mdiPause;
    } else {
      return mdiPlay;
    }
  }

  constructor(
    private playerService: PlayerService, private configService: ConfigService,
    private trackService: TrackService
  ) {
    // Make sure the mouse up is accessible in global contexts
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  public onPlayerToggle() {
    // If no track, don't respond to button click
    if (!this.trackService.activeTrack) return;
    this.playing = !this.playing;

    if (!this.playing) {
      this.playerService.pause();
      return;
    } else {
      this.playerService.play();
    }
  }

  public onNextTrack() {
    this.trackService.moveToNextTrack();
  }

  public onPreviousTrack() {
    this.trackService.moveToLastTrack();
  }

  onMouseDown(ev: MouseEvent) {
    this.isDragging = true;
    ev.preventDefault();

    this.setPointState(PointState.Pause);

    document.addEventListener('mousemove', this.onMouseMove, { signal: this.abortMouseMove.signal });
    document.addEventListener('mouseup', this.onMouseUp, { once: true });
  }

  onMouseMove(ev: MouseEvent) {
    if (this.isDragging) {
      const progressBarRect = this.container.nativeElement.getBoundingClientRect();
      const progressBarWidth = progressBarRect.width;
      const newPositionX = ev.clientX - progressBarRect.left;

      // Ensure the new position is within the bounds of the progress bar
      const clampedPositionX = Math.max(0, Math.min(progressBarWidth, newPositionX));

      // Update the position of the progress point
      this.point.nativeElement.style.left = clampedPositionX + 'px';
      this.seekDuration = (clampedPositionX / progressBarWidth);
    }
  }

  onMouseUp(_ev: any) {
    this.abortMouseMove.abort();
    this.abortMouseMove = new AbortController();
    this.setPointState(PointState.Play);
    let duration = Number(this.player.nativeElement.getAttribute("data-duration"));
    this.player.nativeElement.currentTime = this.seekDuration * duration;
    this.isDragging = false;
  }

  onSetPosition(ev: MouseEvent) {
    this.onMouseDown(ev);
    this.onMouseMove(ev);
  }

  setPointState(state: PointState) {
    switch (state) {
      case PointState.Pause:
        this.point.nativeElement.classList.add('paused');
        this.point.nativeElement.classList.remove('playing');
        break;
      case PointState.Play:
        this.point.nativeElement.classList.add('playing');
        this.point.nativeElement.classList.remove('paused');
        break;
      default:
        break;
    }
  }

  setGradient(start: number, color: string, end?: number) {
    if (end == undefined) {
      this.rendered.nativeElement.style.setProperty('--bar-c-' + start, color);
    } else {
      for (let i = start; i < end; i++) {
        this.rendered.nativeElement.style.setProperty('--bar-c-' + i, color);
      }
    }
  }

  private onBufferProgress(_ev: ProgressEvent<EventTarget>) {
    // Browser estimate
    const duration = this.player.nativeElement.duration;
    // DB record
    const trueDuration = Number(this.player.nativeElement.getAttribute("data-duration"));
    const buffered = this.player.nativeElement.buffered;
    this.point.nativeElement.style.animationDuration = trueDuration + "s";

    if (duration > 0) {
      for (let i = 0; i < buffered.length; i++) {
        let start = buffered.start(i) / trueDuration * 100;
        let end = buffered.end(i) / trueDuration * 100;
        this.setGradient(Math.floor(start), "var(--point-buffered)", Math.floor(end));
      }
    }
  }

  toggleSettings() {

  }

  /**
   * When the audio player is fully loaded, send the audio element to player service
   */
  ngAfterViewInit(): void {
    this.playerService.setAudioPlayer(this.player.nativeElement);
    this.playerService.trackUpdated.subscribe((val) => {
      this.totalDuration = val.getDuration();
      this.currentTime = val.getCurrentTime();
      this.trackTitle = val.title;
      // If the user is not seeking, update the position
      if (!this.isDragging) {
        this.point.nativeElement.style.left = Math.floor((val.currentSecond / val.totalSeconds) * 100) + "%";
      }
      this.artistTitle = val.artist?.name ?? '';
      // Set the cover bg
      this.bg = this.configService.get('apiURL') + "tracks/cover?id=" + val.id;
    });
    this.playerService.bufferReset.subscribe(() => {
      this.setGradient(0, "transparent", 100);
    });
    this.playerService.playbackEnded.subscribe(_ => {
      this.totalDuration = "";
      this.currentTime = "";
      this.trackTitle = "";
      this.artistTitle = "";
      this.bg = "#";
    });

    this.playerService.stateChanged.subscribe((val) => {
      if (val == PlaybackState.Paused) {
        this.playing = false;
      } else {
        this.playing = true;
      }
    });

    this.player.nativeElement.addEventListener("progress", this.onBufferProgress.bind(this));
  }
}
