import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, tap } from "rxjs";


export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const modifedReq = req.clone({ headers: req.headers.append('auth-Header', 'xyz') });
        console.log('Request is on its way');

        return next.handle(modifedReq).pipe(tap(event => {
            if (event.type === HttpEventType.Response) {
                console.log('Response arrived, body data: ');
                console.log(event.body);
            }
        }));
    }
}