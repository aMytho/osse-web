import { Component, input, Input, InputSignal, output, signal, WritableSignal } from '@angular/core';
import { Track } from '../../../services/track/track';
import { TrackMatrixMode } from '../track-matrix-mode.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-matrix-item',
  imports: [CommonModule],
  templateUrl: './matrix-item.component.html',
  styles: ``
})
export class MatrixItemComponent {
  @Input()
  public track!: Track;
  public TrackMatrixMode = TrackMatrixMode;
  public mode: InputSignal<TrackMatrixMode> = input<TrackMatrixMode>(TrackMatrixMode.View);
  public selected: WritableSignal<boolean> = signal(false);

  public onClick = output();
  public onSelectToggle = output<boolean>();

  public toggleSelected() {
    this.selected.set(!this.selected());
    this.onSelectToggle.emit(this.selected());
  }
}
