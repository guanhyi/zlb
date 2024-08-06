import { type HttpEvent, type HttpHandler, type HttpInterceptor, HttpRequest } from '@ngify/http'
import { createIdentifier } from '@wendellhu/redi'
import { Observable } from 'rxjs'

export const HTTP_INTERCEPTOR = createIdentifier<HttpInterceptor[]>('HTTP_INTERCEPTOR')

export class NoopInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request)
    }
}

export class InterceptorService {
    interceptors: HttpInterceptor[] = []

    setInterceptors(interceptors: HttpInterceptor[]) {
        this.interceptors = [...this.interceptors, ...interceptors]
    }
}
