import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-update-password',
  imports: [],
  templateUrl: './update-password.component.html',
  styles: ``
})
export class UpdatePasswordComponent {
  @Output() onClose = new EventEmitter();

  public close() {
    this.onClose.emit();
  }
}
