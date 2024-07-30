import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBackward, faForward, faInfo, faPause, faRepeat, faUtensils, faVolumeHigh, faVolumeLow, faVolumeOff } from '@fortawesome/free-solid-svg-icons';
import { VisualizerComponent } from './visualizer/visualizer.component';
import { PlayerService } from './player.service';
import { PointState } from './point-state';
import { ConfigService } from '../services/config/config.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [FontAwesomeModule, VisualizerComponent],
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

  forward = faForward;
  back = faBackward;
  repeat = faRepeat;
  consume = faUtensils;
  info = faInfo;

  get playerIcon() {
    return faPause;
  }

  constructor(private playerService: PlayerService, private configService: ConfigService) {
    // Make sure the mouse up is accessible in global contexts
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  onVolumeChange(event: any) {
    this.player.nativeElement.volume = event.target.value / 100;
  }

  onMuteToggle(event: any) {
    if (this.player.nativeElement.volume == 0) {
      this.player.nativeElement.volume = 0.5;
    } else {
      this.player.nativeElement.volume = 0;
    }
  }

  get muteStatusIcon() {
    if (!this.player) return faVolumeOff;

    if (this.player.nativeElement.volume == 0) {
      return faVolumeOff
    } else {
      if (this.player.nativeElement.volume <= 0.5) {
        return faVolumeLow;
      } else {
        return faVolumeHigh;
      }
    }
  }

  onMouseDown(ev: MouseEvent) {
    this.isDragging = true;
    ev.preventDefault();

    this.setPointState(PointState.Pause);

    document.addEventListener('mousemove', this.onMouseMove, {signal: this.abortMouseMove.signal});
    document.addEventListener('mouseup', this.onMouseUp, {once: true});
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

  onMouseUp(ev: any) {
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

  private onBufferProgress(ev: ProgressEvent<EventTarget>) {
    console.log(ev);
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

    this.player.nativeElement.addEventListener("progress", this.onBufferProgress.bind(this));
  }
}
