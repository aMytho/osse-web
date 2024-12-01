import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, signal, Signal, WritableSignal } from '@angular/core';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'app-album-art-fullscreen',
  imports: [ButtonComponent],
  templateUrl: './album-art-fullscreen.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumArtFullscreenComponent implements OnInit {
  @Input('url') url: string = '';
  @Output('onClose') onClose = new EventEmitter();
  public albumUrl: WritableSignal<string> = signal('');

  public close() {
    this.onClose.emit();
  }

  public ngOnInit(): void {
    this.albumUrl.set(this.url);
  }
}
