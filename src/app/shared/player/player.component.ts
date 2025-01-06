import { AfterViewInit, Component, computed, ElementRef, signal, ViewChild, WritableSignal } from '@angular/core';
import { PlayerService } from './player.service';
import { PointState } from './point-state';
import { ConfigService } from '../services/config/config.service';
import { RouterLink } from '@angular/router';
import { TrackService } from '../services/track/track.service';
import { IconComponent } from '../ui/icon/icon.component';
import { mdiDotsVertical, mdiFastForward, mdiPause, mdiPlay, mdiRewind } from '@mdi/js';
import { VolumeComponent } from './volume/volume.component';
import { BufferUpdate } from './buffer-update.interface';

@Component({
  selector: 'app-player',
  imports: [VolumeComponent, IconComponent, RouterLink],
  templateUrl: './player.component.html',
  styleUrl: `./player.component.css`
})
export class PlayerComponent implements AfterViewInit {
  @ViewChild('progressContainer') container!: ElementRef<HTMLDivElement>;
  @ViewChild('point') point!: ElementRef<HTMLDivElement>;
  @ViewChild('rendered') rendered!: ElementRef<HTMLDivElement>;
  @ViewChild('trackTitleElement') trackTitleElement!: ElementRef<HTMLParagraphElement>;

  public bg: WritableSignal<string> = signal("#");
  public currentTime: WritableSignal<string> = signal('');
  public totalDuration: WritableSignal<string> = signal('');
  public trackTitle: WritableSignal<string> = signal('');
  public artistTitle: WritableSignal<string> = signal('');
  private isDragging = false;
  private abortMouseMove = new AbortController();
  private seekDuration = 0;
  public playerIcon = computed(() => this.playerService.isPlaying() ? mdiPause : mdiPlay);
  private resizeTimer = 0;

  forward = mdiFastForward;
  back = mdiRewind;
  verticalDots = mdiDotsVertical;

  constructor(
    private playerService: PlayerService, private configService: ConfigService,
    private trackService: TrackService
  ) {
    // Make sure the mouse up is accessible in global contexts
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);

    // Listen for the resize event
    window.addEventListener('resize', (e) => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.setTitleAnimationByScreenSize();
      }, 150);
    })
  }

  public onPlayerToggle() {
    // If no track, don't respond to button click
    if (!this.trackService.activeTrack) return;

    this.playerService.toggle();
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
    let duration = this.playerService.duration;
    this.playerService.play(this.seekDuration * duration());
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

  private onBufferProgress(bufferUpdate: BufferUpdate) {
    const duration = bufferUpdate.durationEstimate;
    const trueDuration = bufferUpdate.duration;
    const buffered = bufferUpdate.buffered;

    this.point.nativeElement.style.animationDuration = trueDuration + "s";

    if (duration > 0) {
      for (let i = 0; i < buffered.length; i++) {
        let start = buffered.start(i) / trueDuration * 100;
        let end = buffered.end(i) / trueDuration * 100;
        this.setGradient(Math.floor(start), "var(--point-buffered)", Math.floor(end));
      }
    }
  }

  private setTitleAnimationByScreenSize() {
    if (this.trackTitleElement.nativeElement.offsetWidth < this.trackTitleElement.nativeElement.parentElement!.offsetWidth) {
      // Pause, set text to be visible
      this.trackTitleElement.nativeElement.style.animationPlayState = 'paused';
      let anim = this.trackTitleElement.nativeElement.getAnimations()[0];
      let duration = anim.effect!.getTiming().duration;
      anim.currentTime = (duration as number) / 2;
    } else {
      this.trackTitleElement.nativeElement.style.animationPlayState = 'running';
    }
  }

  /**
   * When the audio player is fully loaded, send the audio element to player service
   */
  ngAfterViewInit(): void {
    this.playerService.trackUpdated.subscribe((val) => {
      this.totalDuration.set(val.getDuration());
      this.currentTime.set(val.getCurrentTime());
      this.trackTitle.set(val.title);
      // If the user is not seeking, update the position
      if (!this.isDragging) {
        this.point.nativeElement.style.left = Math.floor((val.currentSecond / val.totalSeconds) * 100) + "%";
      }
      this.artistTitle.set(val.artist?.name ?? '');
      // Set the cover bg
      this.bg.set(this.configService.get('apiURL') + "api/tracks/" + val.id + '/cover');
      this.setTitleAnimationByScreenSize();
    });
    this.playerService.bufferReset.subscribe(() => {
      this.setGradient(0, "transparent", 100);
    });
    this.playerService.playbackEnded.subscribe(_ => {
      this.totalDuration.set('');
      this.currentTime.set('');
      this.trackTitle.set('');
      this.artistTitle.set('');
      this.bg.set('#');
    });

    this.playerService.bufferUpdated.subscribe((ev) => this.onBufferProgress(ev));
  }
}
