import { Component } from '@angular/core';
import { NotifyType, ToastService } from './toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-container',
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrl: `./toast-container.component.css`
})
export class ToastContainerComponent {
  constructor(private toastService: ToastService) { }
  public NotifyType = NotifyType;

  public get toasts() {
    return this.toastService.toasts;
  }

  public removeToast(id: string) {
    this.toastService.removeToast(id);
  }
}
