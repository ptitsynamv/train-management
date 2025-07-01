import { Injectable } from '@angular/core';
import { Train } from '../models/train.model';
import { delay, finalize, Observable, of } from 'rxjs';
import { TrainInfo } from '../models/shared.model';
import { handleError } from '../core/handlers/rxjs-handle-error';
import { ErrorService } from '../core/services/error.service';
import { LoaderService } from '../shared/services/loader.service';

@Injectable({
  providedIn: 'root',
})
export class TrainService {
  private readonly STORAGE_KEY = 'local_train_data';
  private readonly INITIAL_TRAINS: Train[] = [
    {
      id: 1,
      name: 'Engine',
      uniqueNumber: 'ENG123',
      canAssignQuantity: false,
      quantity: 0,
    },
    {
      id: 2,
      name: 'Passenger Car',
      uniqueNumber: 'PAS456',
      canAssignQuantity: false,
      quantity: 0,
    },
    {
      id: 3,
      name: 'Freight Car',
      uniqueNumber: 'FRT789',
      canAssignQuantity: false,
      quantity: 0,
    },
    {
      id: 4,
      name: 'Wheel',
      uniqueNumber: 'WHL101',
      canAssignQuantity: true,
      quantity: 0,
    },
    {
      id: 5,
      name: 'Seat',
      uniqueNumber: 'STS234',
      canAssignQuantity: true,
      quantity: 0,
    },
    {
      id: 6,
      name: 'Window',
      uniqueNumber: 'WIN567',
      canAssignQuantity: true,
      quantity: 0,
    },
    {
      id: 7,
      name: 'Door',
      uniqueNumber: 'DR123',
      canAssignQuantity: true,
      quantity: 0,
    },
    {
      id: 8,
      name: 'Control Panel',
      uniqueNumber: 'CTL987',
      canAssignQuantity: true,
      quantity: 0,
    },
    {
      id: 9,
      name: 'Light',
      uniqueNumber: 'LGT456',
      canAssignQuantity: true,
      quantity: 0,
    },
    {
      id: 10,
      name: 'Brake',
      uniqueNumber: 'BRK789',
      canAssignQuantity: true,
      quantity: 0,
    },
    {
      id: 11,
      name: 'Bolt',
      uniqueNumber: 'BLT321',
      canAssignQuantity: true,
      quantity: 0,
    },
    {
      id: 12,
      name: 'Nut',
      uniqueNumber: 'NUT654',
      canAssignQuantity: true,
      quantity: 0,
    },
    {
      id: 13,
      name: 'Engine Hood',
      uniqueNumber: 'EH789',
      canAssignQuantity: false,
      quantity: 0,
    },
    {
      id: 14,
      name: 'Axle',
      uniqueNumber: 'AX456',
      canAssignQuantity: false,
      quantity: 0,
    },
    {
      id: 15,
      name: 'Piston',
      uniqueNumber: 'PST789',
      canAssignQuantity: false,
      quantity: 0,
    },
    {
      id: 16,
      name: 'Handrail',
      uniqueNumber: 'HND234',
      canAssignQuantity: true,
      quantity: 0,
    },
    {
      id: 17,
      name: 'Step',
      uniqueNumber: 'STP567',
      canAssignQuantity: true,
      quantity: 0,
    },
    {
      id: 18,
      name: 'Roof',
      uniqueNumber: 'RF123',
      canAssignQuantity: false,
      quantity: 0,
    },
    {
      id: 19,
      name: 'Air Conditioner',
      uniqueNumber: 'AC789',
      canAssignQuantity: false,
      quantity: 0,
    },
    {
      id: 20,
      name: 'Flooring',
      uniqueNumber: 'FLR456',
      canAssignQuantity: false,
      quantity: 0,
    },
    {
      id: 21,
      name: 'Mirror',
      uniqueNumber: 'MRR789',
      canAssignQuantity: true,
      quantity: 0,
    },
    {
      id: 22,
      name: 'Horn',
      uniqueNumber: 'HRN321',
      canAssignQuantity: false,
      quantity: 0,
    },
    {
      id: 23,
      name: 'Coupler',
      uniqueNumber: 'CPL654',
      canAssignQuantity: false,
      quantity: 0,
    },
    {
      id: 24,
      name: 'Hinge',
      uniqueNumber: 'HNG987',
      canAssignQuantity: true,
      quantity: 0,
    },
    {
      id: 25,
      name: 'Ladder',
      uniqueNumber: 'LDR456',
      canAssignQuantity: true,
      quantity: 0,
    },
    {
      id: 26,
      name: 'Paint',
      uniqueNumber: 'PNT789',
      canAssignQuantity: false,
      quantity: 0,
    },
    {
      id: 27,
      name: 'Decal',
      uniqueNumber: 'DCL321',
      canAssignQuantity: true,
      quantity: 0,
    },
    {
      id: 28,
      name: 'Gauge',
      uniqueNumber: 'GGS654',
      canAssignQuantity: true,
      quantity: 0,
    },
    {
      id: 29,
      name: 'Battery',
      uniqueNumber: 'BTR987',
      canAssignQuantity: false,
      quantity: 0,
    },
    {
      id: 30,
      name: 'Radiator',
      uniqueNumber: 'RDR456',
      canAssignQuantity: false,
      quantity: 0,
    },
  ];

  constructor(
    private _errorService: ErrorService,
    private _loaderService: LoaderService
  ) {
    const existing = localStorage.getItem(this.STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify(this.INITIAL_TRAINS)
      );
    }
  }

  public getTrains(
    page: number = 1,
    pageSize: number = 10
  ): Observable<TrainInfo> {
    const trains = this._getAllTrais();
    const start = (page - 1) * pageSize;
    const paginatedData = trains.slice(start, start + pageSize);
    const hasNext = start + pageSize < trains.length;
    const data = {
      data: paginatedData,
      metadata: {
        total: trains.length,
        pageSize,
        page,
        hasNext,
      },
    };

    return this._withLoader(data).pipe(
      handleError<TrainInfo>(this._errorService, 'Error fetching trains', {
        data: [],
        metadata: { total: 0, pageSize, page, hasNext: false },
      })
    );
  }

  public getTrain(id: number): Observable<{ train: Train | undefined }> {
    const train = this._getAllTrais().find((train) => train.id === id);

    return this._withLoader({ train }).pipe(
      handleError<{ train: Train | undefined }>(
        this._errorService,
        'Error fetching train',
        { train: undefined }
      )
    );
  }

  public updateTrain(
    updatedTrain: Train
  ): Observable<{ train: Train | undefined }> {
    const trains = this._getAllTrais().map((train) =>
      train.id === updatedTrain.id ? updatedTrain : train
    );
    this._save(trains);
    return this._withLoader({ train: updatedTrain }).pipe(
      handleError<{ train: Train | undefined }>(
        this._errorService,
        'Error update train',
        { train: undefined }
      )
    );
  }

  private _withLoader<T>(value: T, ms = 500): Observable<T> {
    this._loaderService.show();
    return of(value).pipe(
      delay(ms),
      finalize(() => this._loaderService.hide())
    );
  }

  private _getAllTrais(): Train[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  private _save(Trains: Train[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Trains));
  }
}
