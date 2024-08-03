import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeById, Employees, postEmployee, postEmployeeResponse, updateEmployee } from '../models/emloyee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  public getEmolpyees(): Observable<Employees> {
    return this.http.get<Employees>('https://192.168.1.15:8081/Employee');
  }

  public addEmployee(body: postEmployee): Observable<postEmployeeResponse> {
    return this.http.post<postEmployeeResponse>(`https://192.168.1.15:8081/Employee`, body);
  }

  public updateEmployee(body: updateEmployee, id: number): Observable<postEmployeeResponse> {
    return this.http.put<postEmployeeResponse>(`https://192.168.1.15:8081/Employee/${id}`, body);
  }

  public getEmployeesByDepartmentName(departmentId: number): Observable<Employees> {
    return this.http.get<Employees>(`https://192.168.1.15:8081/Employee/department/${departmentId}`);
  }

  public getEmployeeById(id: number): Observable<EmployeeById> {
    return this.http.get<EmployeeById>(`https://192.168.1.15:8081/Employee/${id}`);
  }
}
