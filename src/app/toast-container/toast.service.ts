import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public toasts: ToastMessage[] = [];
  constructor() { }

  public info(message: string) {
    let toast = new ToastMessage(message, NotifyType.Info, this.generateId())
    this.toasts.push(toast);

    setTimeout(() => {
      this.toasts.splice(this.toasts.length - 1, 1);
    }, 5000);
  }

  public error(message: string) {
    this.toasts.push(new ToastMessage(message, NotifyType.Error, this.generateId()));

    setTimeout(() => {
      this.toasts.splice(this.toasts.length - 1, 1);
    }, 5000);
  }

  private generateId(): number {
    return this.toasts.reduce((p, c) => {
      if (c.id > p.id) {
        return p;
      }
      return c;
    }, new ToastMessage('', NotifyType.Info, 0)).id + 1;
  }
}

export class ToastMessage {
  constructor(public message: string, public type: NotifyType, public id: number) { }
}

export enum NotifyType {
  Info,
  Error
}

