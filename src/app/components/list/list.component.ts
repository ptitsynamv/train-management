import { Component, OnInit } from '@angular/core';
import { Train } from '../../models/train.model';
import { TrainService } from '../../services/train.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-list',
  imports: [NgFor],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  public trains: Train[] = [];

  constructor(private trainService: TrainService) {}

  ngOnInit() {
    this.trainService.getTrains().subscribe((trains) => {
      this.trains = trains;
    });
  }

  public identify(index: number, item: Train): number {
    return item.id;
  }
}
