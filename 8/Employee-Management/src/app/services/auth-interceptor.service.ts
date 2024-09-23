import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from './loader.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  public token = '';
  private totalRequests = 0;

  constructor(private loaderService: LoaderService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Increment the request count and show the loader
    this.totalRequests++;
    this.loaderService.show();

    // Add the authorization token to the request headers
    this.token = localStorage.getItem('token') || '';
    const modifiedReq = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${this.token}`),
    });

    // Handle the request and manage loader visibility
    return next.handle(modifiedReq).pipe(
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.loaderService.hide();
        }
      })
    );
  }
}
