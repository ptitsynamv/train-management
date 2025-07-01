import { ErrorHandler, Injectable } from '@angular/core';
import {
  NotificationService,
  ToastType,
} from '../services/notification.service';

@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private _notificationService: NotificationService) {}

  public handleError(error: any): void {
    this._notificationService.show(
      `'Global error:' ${error.message || error}`,
      ToastType.Error
    );

    // TODO: Log Sentry
  }
}
