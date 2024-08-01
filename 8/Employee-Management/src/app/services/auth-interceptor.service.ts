import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const modifiedReq = req.clone({ headers: req.headers.append('token', 'eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJLaW1iZXJseSBKdXN0aWNlIiwiSWQiOiIiLCJqdGkiOiJiZTNiNTIxNy0zNDQ5LTQ1MzktOTkzZS00YzRjZjNmNTU4YTkiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsImV4cCI6MTcyMjg2NDU0MCwiaXNzIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NDQzMzgvIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NDQzMzgvIn0.3otPsiRA_avU5ivT6S8-DiSyo9rpEizz7CcLh4TIZzQ') });
    return next.handle(modifiedReq);
  }

}
