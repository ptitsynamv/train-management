import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Train } from '../../models/train.model';
import { TrainService } from '../../services/train.service';
import { NgFor, NgIf } from '@angular/common';
import { TrainInfo } from '../../models/shared.model';
import { BooleanToTextPipe } from '../../shared/pipes/boolean-to-text.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [NgFor, NgIf, BooleanToTextPipe, RouterLink],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
  private readonly _PAGE_SIZE = 10;
  public trainInfo: TrainInfo = {
    data: [],
    metadata: {
      total: 0,
      pageSize: this._PAGE_SIZE,
      page: 1,
      hasNext: false,
    },
  };

  constructor(
    private _trainService: TrainService,
    private _ref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._loadTrains(this.trainInfo.metadata.page);
  }

  public identify(index: number, item: Train): number {
    return item.id;
  }

  public totalPages(): number {
    return Math.ceil(this.trainInfo.metadata.total / this._PAGE_SIZE) || 1;
  }

  public nextPage(): void {
    if (this.trainInfo && this.trainInfo.metadata.hasNext) {
      this._loadTrains(this.trainInfo.metadata.page + 1);
    }
  }

  public prevPage(): void {
    if (this.trainInfo.metadata.page > 1) {
      this._loadTrains(this.trainInfo.metadata.page - 1);
    }
  }

  private _loadTrains(page: number): void {
    this._trainService
      .getTrains(page, this._PAGE_SIZE)
      .subscribe((trainInfo) => {
        if (trainInfo && trainInfo.data && trainInfo.metadata) {
          this.trainInfo = trainInfo;
          this._ref.detectChanges();
        }
      });
  }
}
