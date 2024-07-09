import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../shared/services/config/config.service';
import { RouterLink } from '@angular/router';
import { Album } from '../shared/services/album/Album';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './albums.component.html',
  styles: ``
})
export class AlbumsComponent implements OnInit {
  albums: Album[] = [];
  private albumURL: string = this.configService.get('apiURL') + 'albums?tracks=true';

  constructor(private configService: ConfigService) {}

  async ngOnInit(): Promise<void> {
    let request = await fetch(this.albumURL);
    let result: Album[] = await request.json();
    this.albums = result;
 }
}
