import { Component, OnInit } from '@angular/core';
import { Album, PlaceholderData } from './album';
import { ConfigService } from '../shared/services/config/config.service';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [],
  templateUrl: './albums.component.html',
  styles: ``
})
export class AlbumsComponent implements OnInit {
  fakeData = PlaceholderData;
  albums: Album[] = [];
  private albumURL: string = this.configService.get('apiURL') + 'albums/all';

  constructor(private configService: ConfigService) {}

  async ngOnInit(): Promise<void> {
    let request = await fetch(this.albumURL);
    let result: Album[] = await request.json();
    this.albums = result;
    console.log(this.albums);
  }
}
