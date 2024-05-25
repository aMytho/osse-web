import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faVolumeHigh, faVolumeLow, faVolumeOff } from '@fortawesome/free-solid-svg-icons';
import { VisualizerComponent } from './visualizer/visualizer.component';
import { PlayerService } from './player.service';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [FontAwesomeModule, VisualizerComponent],
  templateUrl: './player.component.html',
  styles: ``
})
export class PlayerComponent implements AfterViewInit {
  @ViewChild('player') player!: ElementRef<HTMLAudioElement>;
  public bg: string = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.wikia.nocookie.net%2Fgensin-impact%2Fimages%2F3%2F39%2FThe_Wind_and_The_Star_Traveler.png%2Frevision%2Flatest%3Fcb%3D20220126025606&f=1&nofb=1&ipt=5f807cbb82b211c04cfc30e7da2888613a53c4e98e0bbc1372c303e007a0df49&ipo=images";
  public currentTime: string = '';
  public totalDuration: string = '';
  public trackTitle: string = '';

  constructor(private playerService: PlayerService) {}

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

  /**
   * When the audio player is fully loaded, send the audio element to player service
   */
  ngAfterViewInit(): void {
    this.playerService.setAudioPlayer(this.player.nativeElement);
    this.playerService.trackUpdated.subscribe((val) => {
      this.totalDuration = val.getDuration();
      this.currentTime = val.getCurrentTime();
      this.trackTitle = val.title;
    })
  }
}
