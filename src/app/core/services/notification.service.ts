import { Injectable, signal } from '@angular/core';

export enum ToastType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
}

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public toasts = signal<ToastMessage[]>([]);
  private readonly timeoutDuration = 5000; // 5 seconds
  private _nextId = 0;

  constructor() {
    console.log('NotificationService initialized');
  }

  public show(message: string, type: ToastType = ToastType.Info): void {
    const toast: ToastMessage = {
      id: this._nextId++,
      message,
      type,
    };

    if (type === ToastType.Error) {
      console.error(message);
    } else if (type === ToastType.Warning) {
      console.warn(message);
    }

    this.toasts.update((toasts) => [...toasts, toast]);

    console.log({ pp: this.toasts() });

    setTimeout(() => this.hide(toast.id), this.timeoutDuration);
  }

  public hide(id: number): void {
    this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }
}
