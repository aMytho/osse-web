import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation/navigation.component';
import { PlayerComponent } from './shared/player/player.component';
import { ToastContainerComponent } from './toast-container/toast-container.component';
import { BackgroundImageService } from './shared/ui/background-image.service';
import { PlayerService } from './shared/player/player.service';
import { PlaybackState } from './shared/player/state-change';
import { ModalComponent } from './shared/ui/modal/modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, PlayerComponent, ToastContainerComponent, ModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Osse';
  playerState: boolean = false;
  @ViewChild('outlet') outlet!: ElementRef;

  public get bg() {
    return this.backgroundImageService.background;
  }

  constructor(
    private backgroundImageService: BackgroundImageService,
    private playerService: PlayerService
  ) {
    this.backgroundImageService.bgChanged.subscribe((v) => {
      this.outlet.nativeElement.style.setProperty('--bg', `url('${v}')`);
    });
    this.playerService.stateChanged.subscribe((s) => {
      if (s == PlaybackState.Playing) {
        this.playerState = true;
      } else {
        this.playerState = false;
      }
    })
  }
}

