import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styles: ``
})
export class ButtonComponent {
  @Input()
  public text: string = '';
  
  @Input()
  public arc: string = 'success';

  @Input()
  public disabled = false;

  @Input()
  public type: string = 'button';
}
