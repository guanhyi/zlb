import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@ngify/http'
import { Inject } from '@wendellhu/redi'

import { Observable, catchError, mergeMap, of, throwError } from 'rxjs'
import { ROUTER, type RouterType } from '../services/router.service'

export class ErrorInterceptor implements HttpInterceptor {
    constructor(@Inject(ROUTER) public router: RouterType) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            mergeMap((event) => {
                if (event instanceof HttpResponse) {
                    if (event.body.status === 0) {
                        // if (event.body.errDetail) {
                        //     Toast.show({
                        //         icon: 'fail',
                        //         content: event.body.errDetail
                        //     })
                        // } else {
                        //     Toast.show({
                        //         icon: 'fail',
                        //         content: '登录错误'
                        //     })
                        // }

                        this.router.navigate('/')
                        // notification.error({
                        //     message: event.body.msg,
                        //     duration: 3
                        // })
                        return throwError(() => event)
                    }

                    if (event.body.code === '401') {
                        this.router.navigate('/authentication')
                        return throwError(() => event)
                    }

                    if (event.status !== 200) {
                        return throwError(() => event)
                    }
                }
                return of(event)
            }),
            catchError((err: HttpErrorResponse) => {
                if (err.error && err.error.status !== 200) {
                    switch (err.error.status) {
                        case 401:

                        default:
                    }
                }

                return throwError(() => err)
            })
        )
        // return next.handle(request).pipe()
    }
}
