import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, signal, Signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-album-art-fullscreen',
  imports: [],
  templateUrl: './album-art-fullscreen.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumArtFullscreenComponent implements OnInit {
  @Input('url') url: string = '';
  @Output('onClose') onClose = new EventEmitter();
  public albumUrl: WritableSignal<string> = signal('');

  public ngOnInit(): void {
    this.albumUrl.set(this.url);
  }
}
