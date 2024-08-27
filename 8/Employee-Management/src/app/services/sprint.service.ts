import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { sprintGetBody, sprintTaskResponse } from '../models/sprint';

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
}
