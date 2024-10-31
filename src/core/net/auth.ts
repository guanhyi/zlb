import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@ngify/http'
import { Observable } from 'rxjs'

export class AuthInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // let account = useAccountStote.getState()
        // if (account.state?.token) {
        //     const newReq = request.clone({
        //         headers: request.headers.set('Token', account.state.token)
        //     })

        //     return next.handle(newReq)
        // }

        return next.handle(request)
    }
}
