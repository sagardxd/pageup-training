import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _isLoading = new BehaviorSubject<boolean>(false);
  private _areButtonDisabled = new BehaviorSubject<boolean>(false);

  isLoading = this._isLoading.asObservable();
  areButtonDisabled = this._areButtonDisabled.asObservable();

  show(): void {
    this._isLoading.next(true);
    this._areButtonDisabled.next(true);
  }

  hide(): void {
    this._isLoading.next(false);
    this._areButtonDisabled.next(false);
  }
}
