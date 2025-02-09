import { ChangeDetectionStrategy, Component, OnInit, WritableSignal, signal } from '@angular/core';
import { ConfigService } from '../shared/services/config/config.service';
import { RouterLink } from '@angular/router';
import { Album } from '../shared/services/album/Album';
import { HeaderComponent } from '../shared/ui/header/header.component';
import { OsseAlbum } from '../shared/services/album/osse-album';
import { fetcher } from '../shared/util/fetcher';
import { IconComponent } from '../shared/ui/icon/icon.component';
import { mdiSearchWeb } from '@mdi/js';

@Component({
  selector: 'app-albums',
  imports: [RouterLink, HeaderComponent, IconComponent],
  templateUrl: './albums.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlbumsComponent implements OnInit {
  albums: WritableSignal<Album[]> = signal([]);
  filteredAlbums: WritableSignal<Album[]> = signal([]);
  coverUrlBase: WritableSignal<string> = signal(this.configService.get('apiURL') + "api/tracks/ID/cover");
  loading: WritableSignal<boolean> = signal(true);

  search = mdiSearchWeb;

  constructor(
    private configService: ConfigService
  ) { }

  public filterAlbums(event: any) {
    if (event.target.value.trim().length == 0) {
      this.filteredAlbums.set(this.albums());
    } else {
      const regex = new RegExp(event.target.value.trim(), 'i');
      this.filteredAlbums.set(this.albums().filter((a) => regex.test(a.name)));
    }
  }

  async ngOnInit(): Promise<void> {
    let request = await fetcher('albums?tracks=true');
    let result: OsseAlbum[] = await request.json();

    result.sort((a, b) => a.name.localeCompare(b.name));
    this.albums.set(result.map((a) => new Album(a)));
    this.filteredAlbums.set(this.albums());
    this.loading.set(false);
  }
}
