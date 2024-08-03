import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const modifiedReq = req.clone({ headers: req.headers.append('Authorization', 'Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJQcmluY2UiLCJJZCI6IjEiLCJVc2VySWQiOiIyIiwianRpIjoiOTQ5MTU0MTMtN2NjYS00MzZlLTkwZDYtMzBjMWRhNmRlMzUxIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiU3VwZXJBZG1pbiIsImV4cCI6MTcyMzA5NDY1MywiaXNzIjoiSnd0SXNzdWVyIiwiYXVkIjoiSnd0QXVkaWVuY2UifQ.3wjP1Z5rclBOXs9iOKn0hBXFIcALDcMnkjtGoKYa6BY') });
    return next.handle(modifiedReq);
  }
}
