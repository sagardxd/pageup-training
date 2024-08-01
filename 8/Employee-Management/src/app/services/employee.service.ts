import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeById, Employees, postEmployee, postEmployeeResponse } from '../models/emloyee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  public getEmolpyees(): Observable<Employees> {
    return this.http.get<Employees>('https://192.168.1.25:8081/api/Employee');
  }

  public addEmployee(body: postEmployee): Observable<postEmployeeResponse> {
    return this.http.post<postEmployeeResponse>(`https://192.168.1.25:8081/api/Employee`, body);
  }

  public updateEmployee(body: postEmployee, id: number): Observable<postEmployeeResponse> {
    return this.http.put<postEmployeeResponse>(`https://192.168.1.25:8081/api/Employee/${id}`, body);
  }

  public getEmployeesByDepartmentName(departmentName: string): Observable<Employees> {
    return this.http.get<Employees>(`https://192.168.1.25:8081/api/Employee/department?departmentName=${departmentName}`);
  }

  public getEmployeeById(id: number): Observable<EmployeeById> {
    return this.http.get<EmployeeById>(`https://192.168.1.25:8081/api/Employee/${id}`);
  }
}
