import { Injectable } from '@angular/core';
import { NotificationService, ToastType } from './notification.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private _notificationService: NotificationService) {}

  public handle(error: unknown, context = ''): void {
    let message = 'An unknown error occurred.';

    if (error instanceof HttpErrorResponse) {
      message = error.error?.message || error.statusText || 'Server error';
    } else if (error instanceof Error) {
      message = error.message;
    }

    this._notificationService.show(
      `${context ? context + ': ' : ''}${message}`,
      ToastType.Error
    );
  }
}
