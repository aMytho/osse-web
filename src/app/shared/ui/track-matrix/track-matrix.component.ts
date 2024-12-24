import { Component, Input, InputSignal, input, output } from '@angular/core';
import { Track } from '../../services/track/track';
import { TrackMatrixAction } from './track-matrix-action.enum';
import { MatrixItemComponent } from './matrix-item/matrix-item.component';
import { TrackMatrixMode } from './track-matrix-mode.enum';

@Component({
  selector: 'app-track-matrix',
  imports: [MatrixItemComponent],
  templateUrl: './track-matrix.component.html',
  styles: ``
})
export class TrackMatrixComponent {
  @Input()
  public tracks: Track[] = [];
  public selectedTracks: Track[] = [];
  public actions: TrackMatrixAction[] = [];
  public mode: InputSignal<TrackMatrixMode> = input<TrackMatrixMode>(TrackMatrixMode.View);

  public onClick = output<Track>();

  public toggleSelect(selected: boolean, track: Track) {
    if (selected) {
      this.selectedTracks.push(track);
    } else {
      this.selectedTracks = this.selectedTracks.filter((t) => t != track);
    }
  }

  public clearSelectedTracks() {
    this.selectedTracks = [];
  }

  public getSelectedTracks() {
    return this.selectedTracks;
  }
}
