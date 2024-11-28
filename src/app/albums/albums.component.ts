import { ChangeDetectionStrategy, Component, OnInit, WritableSignal, signal } from '@angular/core';
import { ConfigService } from '../shared/services/config/config.service';
import { RouterLink } from '@angular/router';
import { Album } from '../shared/services/album/Album';
import { HeaderComponent } from '../shared/ui/header/header.component';
import { OsseAlbum } from '../shared/services/album/osse-album';

@Component({
    selector: 'app-albums',
    imports: [RouterLink, HeaderComponent],
    templateUrl: './albums.component.html',
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumsComponent implements OnInit {
  albums: WritableSignal<Album[]> = signal([]);
  coverUrlBase: WritableSignal<string> = signal(this.configService.get('apiURL') + "tracks/cover?id=");

  constructor(
    private configService: ConfigService
  ) { }

  async ngOnInit(): Promise<void> {
    let request = await fetch(this.configService.get('apiURL') + 'albums?tracks=true');
    let result: OsseAlbum[] = await request.json();

    result.sort((a, b) => a.name.localeCompare(b.name));
    this.albums.set(result.map((a) => new Album(a)));
  }
}
