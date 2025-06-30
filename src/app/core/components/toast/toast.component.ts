import { Component, computed } from '@angular/core';
import {
  NotificationService,
  ToastType,
} from '../../services/notification.service';
import { NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [NgFor, NgClass],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent {
  public toasts = computed(() => this._notificationService.toasts());
  public toastType = ToastType;

  constructor(private _notificationService: NotificationService) {}

  public dismiss(id: number): void {
    this._notificationService.dismiss(id);
  }
}
