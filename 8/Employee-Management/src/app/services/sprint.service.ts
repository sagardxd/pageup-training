import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import {
  sprintByIdResponse,
  sprintGetBody,
  sprintPostBody,
  sprintTaskResponse,
} from '../models/sprint';

@Injectable({
  providedIn: 'root',
})
export class SprintService {
  constructor(private http: HttpClient) {}

  url = environment.apiURL;

  public getSprintsByProjectId(projectId: number): Observable<sprintGetBody> {
    return this.http.get<sprintGetBody>(
      `${this.url}/api/Sprint/project/${projectId}`
    );
  }

  public getSprintTasks(id: number): Observable<sprintTaskResponse> {
    return this.http.get<sprintTaskResponse>(`${this.url}/Tasks/sprint/${id}`);
  }

  public createSprint(
    body: sprintPostBody,
    id: number
  ): Observable<sprintTaskResponse> {
    return this.http.post<sprintTaskResponse>(
      `${this.url}/api/Sprint/${id}`,
      body
    );
  }

  public deleteSprint(id: number): Observable<sprintTaskResponse> {
    return this.http.delete<sprintTaskResponse>(`${this.url}/api/Sprint/${id}`);
  }

  public getSprintById(id: number): Observable<sprintByIdResponse> {
    return this.http.get<sprintByIdResponse>(`${this.url}/api/Sprint/${id}`);
  }
}
