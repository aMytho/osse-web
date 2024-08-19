import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../shared/ui/icon/icon.component';
import { mdiCog } from '@mdi/js';


@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './navigation.component.html',
  styles: ``
})
export class NavigationComponent {
  gear = mdiCog;
}
