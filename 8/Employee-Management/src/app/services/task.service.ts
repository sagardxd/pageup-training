import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { paginatedBody } from '../models/department';
import { Observable } from 'rxjs';
import { paginatedTaskData, TaskByIdResponse, TaskPostBody, TaskPostResponse, TaskReviewResponse } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  url = environment.apiURL;

  public getPaginatedTasks(body: paginatedBody): Observable<paginatedTaskData> {
    return this.http.post<paginatedTaskData>(`${this.url}/Paginated/tasks`, body);
  }

  public deleteTask(id: number) {
    return this.http.delete(`${this.url}/Tasks/${id}`);
  }

  public postTask(body: TaskPostBody): Observable<TaskPostResponse> {
    return this.http.post<TaskPostResponse>(`${this.url}/Tasks`, body);
  }

  public getTaskById(id: number): Observable<TaskByIdResponse> {
    return this.http.get<TaskByIdResponse>(`${this.url}/Tasks/${id}`);
  }

  public addReview(body: { taskID: number, content: string }): Observable<TaskReviewResponse> {
    return this.http.post<TaskReviewResponse>(`${this.url}/TaskReview`, body);
  }
}
