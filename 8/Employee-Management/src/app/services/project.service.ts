import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { paginatedBody } from '../models/department';
import {
  EmployeesProject,
  paginatedProjectData,
  projectByIdResponse,
  ProjectCountResponse,
  projectDeleteResponse,
  projectPostBody,
  projectRequestResponse,
} from '../models/project';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  url = environment.apiURL;

  public getPaginatedProjects(
    body: paginatedBody
  ): Observable<paginatedProjectData> {
    return this.http.post<paginatedProjectData>(
      `${this.url}/Project/pagination`,
      body
    );
  }

  public postProject(
    body: projectPostBody
  ): Observable<projectRequestResponse> {
    return this.http.post<projectRequestResponse>(`${this.url}/Project`, body);
  }

  public getProjectById(id: number): Observable<projectByIdResponse> {
    return this.http.get<projectByIdResponse>(`${this.url}/Project/${id}`);
  }

  public deleteProject(id: number): Observable<projectDeleteResponse> {
    return this.http.delete<projectDeleteResponse>(`${this.url}/Project/${id}`);
  }

  public updateProject(
    id: number,
    body: projectPostBody
  ): Observable<projectRequestResponse> {
    return this.http.put<projectRequestResponse>(
      `${this.url}/Project/${id}`,
      body
    );
  }

  public getProjectOfEmployee(id: number): Observable<EmployeesProject> {
    return this.http.get<EmployeesProject>(
      `${this.url}/Project/employee/${id}`
    );
  }

  public getProjectCount(): Observable<ProjectCountResponse> {
    return this.http.get<ProjectCountResponse>(`${this.url}/Project/Count`);
  }
}
