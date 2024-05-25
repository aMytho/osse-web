import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faVolumeLow } from '@fortawesome/free-solid-svg-icons';
import { VisualizerComponent } from './visualizer/visualizer.component';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [FontAwesomeModule, VisualizerComponent],
  templateUrl: './player.component.html',
  styles: ``
})
export class PlayerComponent {
  public bg: string = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.wikia.nocookie.net%2Fgensin-impact%2Fimages%2F3%2F39%2FThe_Wind_and_The_Star_Traveler.png%2Frevision%2Flatest%3Fcb%3D20220126025606&f=1&nofb=1&ipt=5f807cbb82b211c04cfc30e7da2888613a53c4e98e0bbc1372c303e007a0df49&ipo=images";
  
  low = faVolumeLow;
}
