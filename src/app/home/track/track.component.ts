import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Track } from '../../shared/services/track/track';
import { IconComponent } from '../../shared/ui/icon/icon.component';
import { mdiClose, mdiDotsVertical, mdiPlaylistPlus, mdiStar, mdiTrashCan } from '@mdi/js';

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
  @Output() onPlaylistAdd = new EventEmitter<Track>();
  public mode: string = 'view';

  star = mdiStar;
  dots = mdiDotsVertical;
  trash = mdiTrashCan;
  cancel = mdiClose;
  playlist = mdiPlaylistPlus;

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
    this.onPlaylistAdd.emit(this.track);
  }
}

