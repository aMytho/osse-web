import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, WritableSignal, signal } from '@angular/core';
import { Track } from '../../../services/track/track';
import { PlaylistService } from '../../../services/playlist/playlist.service';
import { Playlist } from '../../../services/playlist/Playlist';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-to-playlist',
  imports: [FormsModule],
  templateUrl: './add-to-playlist.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddToPlaylistComponent implements OnInit {
  @Input('track') track!: Track;
  @Output('onClose') onClose = new EventEmitter();
  playlists: WritableSignal<Playlist[]> = signal([]);
  model: WritableSignal<number> = signal(-1);

  constructor(private playlistService: PlaylistService) { }

  public close() {
    this.onClose.emit();
  }

  public async onSave() {
    await this.playlistService.addTrackToPlaylist(Number(this.model()), this.track.id);
    this.close();
  }

  async ngOnInit(): Promise<void> {
    this.playlists.set(await this.playlistService.getAll());
  }
}

