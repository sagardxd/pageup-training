import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { deleteDepartmentResponse, department, departments, paginatedBody, paginatedDepartmentData, postDepartmentResponse } from '../models/department';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) { }

  url = environment.apiURL;

  getDepartment(): Observable<departments> {
    return this.http.get<departments>(`${this.url}/Department`);
  }

  getPaginatedDepartment(paginatedData: paginatedBody): Observable<paginatedDepartmentData> {
    const body = paginatedData;
    return this.http.post<paginatedDepartmentData>(`${this.url}/Paginated/departments`, body);
  }

  getDepartmentPaginated(): Observable<departments> {
    return this.http.get<departments>(`${this.url}/Department`);
  }
  getDepartmentById(id: number): Observable<department> {
    return this.http.get<department>(`${this.url}/Department/${id}`);
  }

  createDepartment(name: string): Observable<postDepartmentResponse> {
    const body = { name };
    return this.http.post<postDepartmentResponse>(`${this.url}/Department`, body);
  }

  deleteDepartment(id: number): Observable<deleteDepartmentResponse> {
    return this.http.delete<deleteDepartmentResponse>(`${this.url}/Department/${id}`);
  }
}
