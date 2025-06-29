import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TrainService } from '../../services/train.service';
import { NgIf } from '@angular/common';
import { Train } from '../../models/train.model';
import Toastify from 'toastify-js';

@Component({
  selector: 'app-details',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
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
    private _trainService: TrainService
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      const { id } = params;

      Toastify({
        text: 'This is a toast',
        duration: 30000000,
        className: 'text-sm',
        style: {
          'border-radius': 'var(--radius-xl)',
          color: 'var(--color-gray-700)',
          background: 'var(--color-white)',
        },
        close: true,
      }).showToast();

      if (!id) {
        console.error('No ID provided in route parameters');
        return;
      }

      this._trainService.getTrain(+id).subscribe((train) => {
        if (!train) {
          console.error(`Train with ID ${id} not found`);
          return;
        }
        this.train = train;
        this.quantity.setValue(train.quantity);

        this.quantity.valueChanges.subscribe((value) => {
          console.log(this.quantity.errors);
        });
      });
    });
  }

  public updateQuantity() {
    if (this.train && this.train.canAssignQuantity === false) {
      console.warn('This train cannot have its quantity updated.');
      return;
    }

    if (this.train && this.quantity.invalid) {
      console.warn('Invalid quantity value:', this.quantity.errors);
      return;
    }

    if (this.train && this.quantity.value !== null) {
      console.log('Updated quantity:', this.quantity.value);
      this._trainService
        .updateTrain({ ...this.train, quantity: this.quantity.value })
        .subscribe((updatedTrain) => {
          this.train = updatedTrain;
          this.quantity.setValue(updatedTrain.quantity);
        });
    } else {
      console.warn('Train is not defined or quantity is null');
    }
  }
}
