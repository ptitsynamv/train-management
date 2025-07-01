import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _loadingSubject = new BehaviorSubject<boolean>(false);
  private _requestCount = 0;
  public loading$ = this._loadingSubject.asObservable();

  public show(): void {
    this._requestCount++;
    if (this._requestCount === 1) {
      this._loadingSubject.next(true);
    }
  }

  public hide(): void {
    if (this._requestCount === 0) {
      return;
    }
    this._requestCount--;
    if (this._requestCount === 0) {
      this._loadingSubject.next(false);
    }
  }
}
