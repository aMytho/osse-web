import { Component, ElementRef, ViewChild } from '@angular/core';
import { PlayerService } from '../player.service';
import { mdiVolumeOff, mdiVolumeLow, mdiVolumeHigh } from '@mdi/js';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-volume',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './volume.component.html',
  styles: ``
})
export class VolumeComponent {
  @ViewChild('volume') volumeInput!: ElementRef<HTMLInputElement>;
  volumeIcon = mdiVolumeOff;
  public showVolumeMenu: boolean = false;

  constructor(private playerService: PlayerService) {
    this.playerService.stateChanged.subscribe((_v) => this.setVolumeIcon());
  }

  onVolumeChange(event: any) {
    this.playerService.setVolume(event.target.value);
  }

  onVolumeSet() {
    this.setVolumeIcon();
    this.showVolumeMenu = false;
  }

  setVolumeIcon() {
    let volume = this.playerService.getVolume();
    if (volume == 0) {
      this.volumeIcon = mdiVolumeOff;
    } else {
      if (volume <= 0.5) {
        this.volumeIcon = mdiVolumeLow;
      } else {
        this.volumeIcon = mdiVolumeHigh;
      }
    }
  }

  onMuteToggle() {
    let volume = this.playerService.getVolume();
    if (volume == 0) {
      this.playerService.setVolume(0.5);
    } else {
      this.playerService.setVolume(0);
    }

    this.setVolumeIcon();
    this.volumeInput.nativeElement.value = String(this.playerService.getVolume());
  }

  public toggleMenu() {
    this.showVolumeMenu = !this.showVolumeMenu;
  }
}

