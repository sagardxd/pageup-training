import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

export class Base {
  public http = inject(HttpClient);
  public messageService = inject(MessageService);

  private handleRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    options: {
      url: string;
      body?: any;
      errMsg?: string;
      httpOptions?: any;
    }
  ): Promise<T> {
    const { url, body, httpOptions, errMsg } = options;

    const requestOptions = {
      ...httpOptions,
      observe: 'body' as const,
    };

    const observable = (() => {
      switch (method) {
        case 'GET':
          return this.http.get<T>(
            `${environment.apiURL}/${url}`,
            requestOptions
          );
        case 'POST':
          return this.http.post<T>(
            `${environment.apiURL}/${url}`,
            body,
            requestOptions
          );
        case 'PUT':
          return this.http.put<T>(
            `${environment.apiURL}/${url}`,
            body,
            requestOptions
          );
        case 'DELETE':
          return this.http.delete<T>(
            `${environment.apiURL}/${url}`,
            requestOptions
          );
      }
    })() as Observable<T>;

    return new Promise<T>((resolve, reject) => {
      observable.subscribe({
        next: (value) => resolve(value),
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errMsg || `Failed to ${method.toLowerCase()} data`,
          });
          reject(err);
        },
      });
    });
  }

  public getData<T>(options: {
    url: string;
    errMsg?: string;
    httpOptions?: any;
  }): Promise<T> {
    return this.handleRequest<T>('GET', options);
  }

  public postData<T>(options: {
    url: string;
    errMsg?: string;
    body?: any;
    httpOptions?: any;
  }): Promise<T> {
    return this.handleRequest<T>('POST', options);
  }

  public putData<T>(options: {
    url: string;
    errMsg?: string;
    body?: any;
    httpOptions?: any;
  }): Promise<T> {
    return this.handleRequest<T>('PUT', options);
  }

  public deleteData<T>(options: {
    url: string;
    errMsg?: string;
    httpOptions?: any;
  }): Promise<T> {
    return this.handleRequest<T>('DELETE', options);
  }
}
