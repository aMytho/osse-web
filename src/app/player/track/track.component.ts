import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEllipsisV, faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-track',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './track.component.html'
})
export class TrackComponent {
  star = faStar
  dots = faEllipsisV
}
