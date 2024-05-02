import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './navigation.component.html',
  styles: ``
})
export class NavigationComponent {
  gear = faGear;
}
