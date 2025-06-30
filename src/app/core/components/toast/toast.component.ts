import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
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
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  public toasts = computed(() => this._notificationService.toasts());
  public toastType = ToastType;

  constructor(private _notificationService: NotificationService) {
    console.log('ToastComponent initialized');
  }

  public hide(id: number): void {
    this._notificationService.hide(id);
  }
}
