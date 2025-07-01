import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loader',
  imports: [AsyncPipe, NgIf],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent {
  public loading$: Observable<boolean>;

  constructor(private _loaderService: LoaderService) {
    this.loading$ = this._loaderService.loading$;
  }
}
