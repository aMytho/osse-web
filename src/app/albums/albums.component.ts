import { Component } from '@angular/core';
import { PlaceholderData } from './album';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [],
  templateUrl: './albums.component.html',
  styles: ``
})
export class AlbumsComponent {
  fakeData = PlaceholderData;

  
}
