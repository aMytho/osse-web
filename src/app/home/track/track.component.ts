import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() onPlay = new EventEmitter();

  star = faStar
  dots = faEllipsisV

  public onDoubleClick() {
    this.onPlay.emit();
  }
}
