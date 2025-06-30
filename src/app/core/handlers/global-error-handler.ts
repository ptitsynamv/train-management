import { ErrorHandler, inject, Injectable, Injector } from '@angular/core';
import {
  NotificationService,
  ToastType,
} from '../services/notification.service';

Injectable();
export class GlobalErrorHandler implements ErrorHandler {
  private _notificationService = inject(NotificationService);
  // private _notificationService: NotificationService;

  // constructor(private _notificationService: NotificationService) {}

  // constructor(private injector: Injector) {
  //   this._notificationService = this.injector.get(NotificationService);
  // }

  public handleError(error: any): void {
    console.log('GlobalErrorHandler handleError');
    this._notificationService.show(
      `'Global error:' ${error.message || error}`,
      ToastType.Error
    );
  }
}
