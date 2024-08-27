import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { paginatedBody } from '../models/department';
import { Observable } from 'rxjs';
import {
  paginatedTaskData,
  TaskByIdResponse,
  TaskCount,
  TaskLogResponse,
  TaskPaginationBodyTask,
  TaskPaginationResponse,
  TaskPostBody,
  TaskPostResponse,
  TaskReviewResponse,
  TasUpdatetBody,
} from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  url = environment.apiURL;

  public getPaginatedTasks(body: paginatedBody): Observable<paginatedTaskData> {
    return this.http.post<paginatedTaskData>(
      `${this.url}/Paginated/tasks`,
      body
    );
  }

  public getEpicTasks(
    id: string,
    paginatedData: TaskPaginationBodyTask
  ): Observable<TaskPaginationResponse> {
    return this.http.post<TaskPaginationResponse>(
      `${this.url}/Tasks/pagination/${id}`,
      paginatedData
    );
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

  public addReview(
    taskID: number,
    body: {
      content: string;
    }
  ): Observable<TaskReviewResponse> {
    return this.http.post<TaskReviewResponse>(
      `${this.url}/TaskReview/${taskID}`,
      body
    );
  }

  public getChildren(id: number): Observable<any> {
    return this.http.get<any>(`${this.url}/Tasks/task${id}/children`);
  }

  public updateTaskStatus(movedTo: number, taskId: number) {
    return this.http.put(`${this.url}/Tasks/update-status/${taskId}`, movedTo);
  }

  public updateTask(body: TasUpdatetBody, taskId: number): any {
    return this.http.put(`${this.url}/Tasks/${taskId}`, body);
  }

  public getTaskLog(taskId: number): Observable<TaskLogResponse> {
    return this.http.get<TaskLogResponse>(`${this.url}/api/TaskLog/${taskId}`);
  }

  public getTaskCount(): Observable<TaskCount> {
    return this.http.get<TaskCount>(`${this.url}/Tasks/Count`);
  }
}
