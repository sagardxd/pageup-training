import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  deleteDepartmentResponse,
  department,
  DepartmentCountResponse,
  departments,
  paginatedBody,
  paginatedDepartmentData,
  postDepartmentResponse,
} from '../models/department';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(private http: HttpClient) {}

  url = environment.apiURL;

  public getDepartment(): Observable<departments> {
    return this.http.get<departments>(`${this.url}/Department`);
  }

  public getPaginatedDepartment(
    paginatedData: paginatedBody
  ): Observable<paginatedDepartmentData> {
    const body = paginatedData;
    return this.http.post<paginatedDepartmentData>(
      `${this.url}/Department/pagination`,
      body
    );
  }

  public getDepartmentPaginated(): Observable<departments> {
    return this.http.get<departments>(`${this.url}/Department`);
  }
  public getDepartmentById(id: number): Observable<department> {
    return this.http.get<department>(`${this.url}/Department/${id}`);
  }

  public createDepartment(name: string): Observable<postDepartmentResponse> {
    const body = { name };
    return this.http.post<postDepartmentResponse>(
      `${this.url}/Department`,
      body
    );
  }

  public deleteDepartment(id: number): Observable<deleteDepartmentResponse> {
    return this.http.delete<deleteDepartmentResponse>(
      `${this.url}/Department/${id}`
    );
  }

  public getDepartmentCount(): Observable<DepartmentCountResponse> {
    return this.http.get<DepartmentCountResponse>(
      `${this.url}/Department/Count`
    );
  }
}
