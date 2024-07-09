import { Component, Input } from '@angular/core';
import { Track } from '../../../shared/services/track/track';

@Component({
  selector: 'app-album-track',
  standalone: true,
  imports: [],
  templateUrl: './album-track.component.html',
  styles: ``
})
export class AlbumTrackComponent {
  @Input()
  public track!: Track;
}
