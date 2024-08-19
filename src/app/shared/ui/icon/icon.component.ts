import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon.component.html',
  styles: ``
})
export class IconComponent {
  @Input('icon') data: string = '';
  @Input('class') cssClass: string = '';
  @Input('align') align: string = 'text-bottom';
}
