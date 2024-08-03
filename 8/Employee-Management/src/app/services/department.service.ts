import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { deleteDepartmentResponse, department, departments, postDepartmentResponse } from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) { }

  getDepartment(): Observable<departments> {
    return this.http.get<departments>('https://192.168.1.15:8081/Department');
  }
  getDepartmentById(id: number): Observable<department> {
    return this.http.get<department>(`https://192.168.1.15:8081/Department/${id}`);
  }

  createDepartment(name: string): Observable<postDepartmentResponse> {
    const body = { name };
    return this.http.post<postDepartmentResponse>(`https://192.168.1.15:8081/Department`, body);
  }

  deleteDepartment(id: number): Observable<deleteDepartmentResponse> {
    return this.http.delete<deleteDepartmentResponse>(`https://192.168.1.15:8081/Department/${id}`);
  }
}
