import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Track } from '../../shared/services/track/track';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { mdiClose, mdiDotsVertical, mdiStar, mdiTrashCan } from '@mdi/js';

@Component({
  selector: 'app-track',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './track.component.html'
})
export class TrackComponent {
  @Input() track!: Track;
  @Output() onPlay = new EventEmitter();
  @Output() onRemove = new EventEmitter();
  public mode: string = 'view';

  star = mdiStar;
  dots = mdiDotsVertical;
  trash = mdiTrashCan;
  cancel = mdiClose;

  public onDoubleClick() {
    this.onPlay.emit();
  }

  public toggleView() {
    if (this.mode == 'view') {
      this.mode = 'act';
    } else {
      this.mode = 'view';
    }
  }

  public toggleViewWithEvent(ev: Event) {
      ev.preventDefault();
      this.toggleView();
  }

  public removeTrack() {
    this.onRemove.emit();
  }

  public addToPlaylist() {
    // to do
  }
}
