import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RequestHandlerService {
  private requestState = new BehaviorSubject<boolean>(false);
  public isRequesting = this.requestState.asObservable();

  public startRequest(): void {
    this.requestState.next(true);
  }

  public stopRequest(): void {
    this.requestState.next(false);
  }
}
