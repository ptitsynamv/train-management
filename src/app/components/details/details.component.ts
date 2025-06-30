import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainService } from '../../services/train.service';
import { NgIf } from '@angular/common';
import { Train } from '../../models/train.model';
import {
  NotificationService,
  ToastType,
} from '../../core/services/notification.service';
import { BooleanToTextPipe } from '../../shared/pipes/boolean-to-text.pipe';

@Component({
  selector: 'app-details',
  imports: [ReactiveFormsModule, NgIf, BooleanToTextPipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent implements OnInit {
  public quantity = new FormControl(0, [
    Validators.required,
    Validators.max(Number.MAX_SAFE_INTEGER),
    Validators.pattern('^(0|[1-9][0-9]*)$'),
  ]);
  public train: Train | null = null;

  constructor(
    private _route: ActivatedRoute,
    private _trainService: TrainService,
    private _notificationService: NotificationService,
    private _router: Router,
    private _ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      const { id } = params;

      if (!id) {
        this._notificationService.show(
          'No ID provided in route parameters',
          ToastType.Error
        );
        this._router.navigate(['/']);
        return;
      }

      this._trainService.getTrain(+id).subscribe((train) => {
        if (!train) {
          this._notificationService.show(
            `Train with ID "${id}" not found`,
            ToastType.Error
          );
          this._router.navigate(['/']);
          return;
        }
        this.train = train;
        this.quantity.setValue(train.quantity);
        this._ref.detectChanges();
      });
    });
  }

  public updateQuantity(): void {
    if (!this.train) {
      this._notificationService.show('Train is not defined', ToastType.Warning);
      return;
    }

    if (this.train.canAssignQuantity === false) {
      this._notificationService.show(
        'This train cannot have its quantity updated.',
        ToastType.Warning
      );
      return;
    }

    if (this.quantity.invalid) {
      this._notificationService.show(
        `Invalid quantity value:, ${
          this.quantity.errors
            ? JSON.stringify(this.quantity.errors)
            : 'unknown'
        }`,
        ToastType.Warning
      );
      return;
    }

    if (this.quantity.value === null) {
      this._notificationService.show('Quantity is null', ToastType.Warning);
      return;
    }

    this._trainService
      .updateTrain({ ...this.train, quantity: this.quantity.value })
      .subscribe((updatedTrain) => {
        this.train = updatedTrain;
        this.quantity.setValue(updatedTrain.quantity);
        this._notificationService.show(
          `Train quantity updated to ${updatedTrain.quantity}`,
          ToastType.Success
        );
      });
  }
}
