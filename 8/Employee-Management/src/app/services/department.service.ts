import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { deleteDepartmentResponse, department, departments, postDepartmentResponse } from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) { }

  getDepartment(): Observable<departments> {
    return this.http.get<departments>('https://192.168.1.25:8081/api/Department');
  }

  getDepartmentById(id: number): Observable<department> {
    return this.http.get<department>(`https://192.168.1.25:8081/api/Department/${id}`);
  }

  createDepartment(name: string): Observable<any> {
    const body = { name };
    return this.http.post<any>(`https://192.168.1.25:8081/api/Department`, body);
  }

  deleteDepartment(id: number): Observable<deleteDepartmentResponse> {
    return this.http.delete<deleteDepartmentResponse>(`https://192.168.1.25:8081/api/Department/${id}`);
  }



}
