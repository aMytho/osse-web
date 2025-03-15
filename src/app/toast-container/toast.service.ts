import { Injectable } from '@angular/core';
import { v4 as uuid } from "uuid";

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public toasts: ToastMessage[] = [];
  constructor() { }

  public info(message: string) {
    let toast = new ToastMessage(message, NotifyType.Info, uuid(), 6)
    this.toasts.push(toast);
    setTimeout(() => this.removeToast(toast.id), 6000);
  }

  public error(message: string) {
    let toast = new ToastMessage(message, NotifyType.Error, uuid(), 7);
    this.toasts.push(toast);
    setTimeout(() => this.removeToast(toast.id), 7000);
    console.error(toast);
  }

  public removeToast(id: string) {
    let toast = this.toasts.find((t) => t.id == id);
    if (toast) {
      toast.closed = true;
      setTimeout(() => this.toasts = this.toasts.filter((t) => !t.closed), 400);
    }
  }
}

export class ToastMessage {
  public closed: boolean = false;

  constructor(public message: string, public type: NotifyType, public id: string, public duration: number = 6) { }
}

export enum NotifyType {
  Info,
  Error
}

