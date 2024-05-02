import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlay, faPause, faForward, faBackward, faRepeat, faInfo, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { TrackComponent } from './track/track.component';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [FontAwesomeModule, TrackComponent],
  templateUrl: './player.component.html'
})
export class PlayerComponent {
  public bg: string = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.wikia.nocookie.net%2Fgensin-impact%2Fimages%2F3%2F39%2FThe_Wind_and_The_Star_Traveler.png%2Frevision%2Flatest%3Fcb%3D20220126025606&f=1&nofb=1&ipt=5f807cbb82b211c04cfc30e7da2888613a53c4e98e0bbc1372c303e007a0df49&ipo=images";
  public waveform: string = "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.pngall.com%2Fwp-content%2Fuploads%2F2%2FSound-Waves-PNG-Free-Image.png&f=1&nofb=1&ipt=693dc2a6173f04c6eda6dfadf21790931e5e2df0e7a4b60a2fe43d0609a62528&ipo=images";

  play = faPlay;
  pause = faPause;
  forward = faForward;
  back = faBackward;
  repeat = faRepeat;
  consume = faUtensils;
  info = faInfo;
}
