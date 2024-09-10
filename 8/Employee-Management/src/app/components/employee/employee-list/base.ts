import { inject } from '@angular/core';
import { EmployeeService } from '../../../services/employee.service';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

export class Base {
  public http = inject(HttpClient);
  public messageService = inject(MessageService);

  getData<T>(options: {
    url: string;
    errMsg?: string;
    httpOptions?: any;
  }): Promise<T> {
    const { url, httpOptions, errMsg } = options;
    const promise = new Promise<T>((resolve, reject) => {
      (
        this.http.get<T>(
          `${environment.apiURL}/${url}`,
          httpOptions
        ) as Observable<T>
      ).subscribe({
        next: (value) => {
          resolve(value);
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errMsg,
          });
          reject(err);
        },
      });
    });
    return promise;
  }
}
