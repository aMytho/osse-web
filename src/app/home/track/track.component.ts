import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisV, faStar } from '@fortawesome/free-solid-svg-icons';
import { Track } from '../../shared/services/track/track';

@Component({
  selector: 'app-track',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './track.component.html'
})
export class TrackComponent {
  @Input() track!: Track;

  star = faStar
  dots = faEllipsisV
}
