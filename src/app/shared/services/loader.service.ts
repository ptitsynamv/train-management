import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this._loadingSubject.asObservable();

  public show(): void {
    this._loadingSubject.next(true);
  }

  public hide(): void {
    this._loadingSubject.next(false);
  }
}
