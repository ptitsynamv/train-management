import { Component, OnInit } from '@angular/core';
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
})
export class ListComponent implements OnInit {
  public trainInfo: TrainInfo | undefined;
  public page = 1;
  public readonly PAGE_SIZE = 10;
  private total = 0;

  constructor(private trainService: TrainService) {}

  ngOnInit() {
    this._loadTrains();
  }

  public identify(index: number, item: Train): number {
    return item.id;
  }

  public totalPages(): number {
    return Math.ceil(this.total / this.PAGE_SIZE) || 1;
  }

  public nextPage() {
    if (this.trainInfo && this.trainInfo.hasNext) {
      this.page++;
      this._loadTrains();
    }
  }

  public prevPage() {
    if (this.page > 1) {
      this.page--;
      this._loadTrains();
    }
  }

  public isLastPage(): boolean {
    return this.page * this.PAGE_SIZE >= this.total;
  }

  private _loadTrains() {
    this.trainService
      .getTrains(this.page, this.PAGE_SIZE)
      .subscribe((trainInfo) => {
        this.trainInfo = trainInfo;
        this.total = trainInfo.total;
      });
  }
}
