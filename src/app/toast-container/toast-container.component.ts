import { Component } from '@angular/core';
import { ToastService } from './toast.service';

@Component({
    selector: 'app-toast-container',
    imports: [],
    templateUrl: './toast-container.component.html',
    styles: ``
})
export class ToastContainerComponent {
  constructor(private toastService: ToastService) {}

  public get toasts() {
    return this.toastService.toasts;
  }
}

