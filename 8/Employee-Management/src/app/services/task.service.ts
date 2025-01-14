import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { paginatedBody } from '../models/department';
import { Observable } from 'rxjs';
import {
  paginatedTaskData,
  TaskByIdResponse,
  TaskByProjectIdAndTasktypeResponse,
  TaskCount,
  TaskLogResponse,
  TaskPaginationBodyTask,
  TaskPaginationResponse,
  TaskPostBody,
  TaskPostResponse,
  TaskReviewResponse,
  TaskType,
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
    id: number,
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

  public getTaskLog(
    taskId: number,
    taskLogLength: number
  ): Observable<TaskLogResponse> {
    return this.http.get<TaskLogResponse>(
      `${this.url}/api/TaskLog/${taskId}/${taskLogLength}`
    );
  }

  public getTaskCount(projectId: number): Observable<TaskCount> {
    return this.http.get<TaskCount>(`${this.url}/Tasks/Count/${projectId}`);
  }

  public getTaskByProjectIdAndTasktype(
    projectId: number,
    taskType: TaskType
  ): Observable<TaskByProjectIdAndTasktypeResponse> {
    return this.http.get<TaskByProjectIdAndTasktypeResponse>(
      `${this.url}/Tasks/${projectId}/type=${taskType}`
    );
  }

  public changeParentId(taskId: number, changeParentId: number) {
    const patchData = [
      {
        op: 'replace',
        path: `/parentId`,
        value: changeParentId,
      },
    ];
    return this.http.patch(`${this.url}/Tasks/${taskId}`, patchData, {
      headers: { 'Content-Type': 'application/json-patch+json' },
    });
  }

  public editTaskReview(content: string, taskReviewId: number) {
    const body = { content };
    return this.http.put(`${this.url}/TaskReview/${taskReviewId}`, body);
  }
}
