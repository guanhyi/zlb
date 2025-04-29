import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@ngify/http'
import { Observable } from 'rxjs'
import { useAuthStore } from '../services/auth.service'

export class AuthInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let account = useAuthStore.getState()
        if (account?.token) {
            const newReq = request.clone({
                headers: request.headers.set('satoken', account.token)
            })

            return next.handle(newReq)
        }

        return next.handle(request)
    }
}
