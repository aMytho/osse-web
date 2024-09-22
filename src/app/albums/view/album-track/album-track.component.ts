import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Track } from '../../../shared/services/track/track';

@Component({
  selector: 'app-album-track',
  standalone: true,
  imports: [],
  templateUrl: './album-track.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumTrackComponent {
  @Input()
  public track!: Track;

  @Output()
  public addTrack = new EventEmitter<Track>();

  public onClick() {
    this.addTrack.emit(this.track);
  }
}
