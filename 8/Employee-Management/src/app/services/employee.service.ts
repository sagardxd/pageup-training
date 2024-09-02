import { HttpClient } from '@angular/common/http'; // import the HttpClient module
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  EmployeeById,
  EmployeeCount,
  Employees,
  paginatedEmployeeData,
  postEmployee,
  postEmployeeResponse,
  updateEmployee,
} from '../models/emloyee';
import { environment } from '../../environments/environment.development';
import { paginatedBody } from '../models/department';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  url = environment.apiURL;

  public getEmolpyees(): Observable<Employees> {
    return this.http.get<Employees>(`${this.url}/Employee`);
  }

  public getPaginatedEmployees(
    body: paginatedBody
  ): Observable<paginatedEmployeeData> {
    return this.http.post<paginatedEmployeeData>(
      `${this.url}/Employee/pagination`,
      body
    );
  }

  public addEmployee(body: postEmployee): Observable<postEmployeeResponse> {
    return this.http.post<postEmployeeResponse>(`${this.url}/Employee`, body);
  }

  public updateEmployee(
    body: updateEmployee,
    id: number
  ): Observable<postEmployeeResponse> {
    return this.http.put<postEmployeeResponse>(
      `${this.url}/Employee/${id}`,
      body
    );
  }

  public getEmployeesByDepartmentName(
    departmentId: number
  ): Observable<Employees> {
    return this.http.get<Employees>(
      `${this.url}/Employee/department/${departmentId}`
    );
  }

  public getEmployeeById(id: number): Observable<EmployeeById> {
    return this.http.get<EmployeeById>(`${this.url}/Employee/${id}`);
  }

  public getEmployeeByIdUpdate(id: number): Observable<EmployeeById> {
    return this.http.get<EmployeeById>(`${this.url}/Employee/Update/${id}`);
  }

  public deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.url}/Employee/${id}`);
  }

  public employeeCount(): Observable<EmployeeCount> {
    return this.http.get<EmployeeCount>(`${this.url}/Employee/Count`);
  }
}
