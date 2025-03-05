import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Track } from '../../../services/track/track';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'app-track-info',
  imports: [ButtonComponent],
  templateUrl: './track-info.component.html',
  styles: ``
})
export class TrackInfoComponent {
  @Input()
  public trackInfo!: Track;
  @Output() onClose = new EventEmitter();

  public close() {
    this.onClose.emit();
  }
}
