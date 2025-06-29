import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TrainService } from '../../services/train.service';

@Component({
  selector: 'app-details',
  imports: [ReactiveFormsModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit {
  public quantity = new FormControl(0, [
    Validators.required,
    Validators.min(0),
    Validators.max(10000),
    Validators.pattern('^(0|[1-9][0-9]*)$'),
  ]);

  constructor(
    private _route: ActivatedRoute,
    private _trainService: TrainService
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      const { id } = params;
      if (!id) {
        console.error('No ID provided in route parameters');
        return;
      }

      this._trainService.getTrain(+id).subscribe((train) => {
        if (!train) {
          console.error(`Train with ID ${id} not found`);
          return;
        }
        this.quantity.setValue(train.quantity);
      });
    });
  }

  public updateQuantity() {
    console.log('Updated quantity:', this.quantity.value);
  }
}
