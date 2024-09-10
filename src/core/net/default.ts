import { environment } from '@/environments/environment'
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@ngify/http'
import { Observable, of } from 'rxjs'

export class DefaultInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const newRequest = request.clone({
            url: environment.api + request.url
        })

        return next.handle(newRequest)
    }
}
