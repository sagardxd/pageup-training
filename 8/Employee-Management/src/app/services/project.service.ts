import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { paginatedBody } from '../models/department';
import { paginatedProjectData } from '../models/project';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  url = environment.apiURL;

  public getPaginatedProjects(body: paginatedBody): Observable<paginatedProjectData> {
    return this.http.post<paginatedProjectData>(`${this.url}/Paginated/projects`, body);
  }

}
